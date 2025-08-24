// Express server for handling API routes
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { deepResearch } from './src/trigger/deep-research.ts';
import { runs } from '@trigger.dev/sdk/v3';

if (!process.env.TRIGGER_SECRET_KEY) {
  console.error("TRIGGER_SECRET_KEY is missing");
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:8080', 'http://localhost:8081', 'http://localhost:8082', 'http://localhost:8083'], // Vite dev server
  credentials: true
}));
app.use(express.json());

// Deep Research API endpoint
app.post('/api/deep-research', async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { query, clarification } = req.body;
    
    if (!query || typeof query !== 'string') {
      return res.status(400).json({
        status: 'failed',
        error: 'Invalid request: query is required'
      });
    }
    
    console.log('Server: Triggering deep research workflow for:', query);
    
    // Trigger the actual Trigger.dev workflow and poll for completion (v3 API)
    const handle = await deepResearch.trigger({
      originalQuery: query,
      clarification,
    });
    
    const timeoutMs = 600_000; // 10 minutes
    const pollIntervalMs = 2_000;
    const startPoll = Date.now();
    let runResult = await runs.retrieve(handle.id);
    
    while (
      runResult.status !== 'COMPLETED' &&
      runResult.status !== 'FAILED' &&
      Date.now() - startPoll < timeoutMs
    ) {
      await new Promise((r) => setTimeout(r, pollIntervalMs));
      runResult = await runs.retrieve(handle.id);
    }
    
    if (runResult.status !== 'COMPLETED') {
      console.error('Server: Deep research workflow failed or timed out', {
        status: runResult.status,
        runId: handle.id,
      });
      return res.status(500).json({
        status: 'failed',
        error:
          runResult.status === 'FAILED'
            ? runResult?.error?.message || 'Deep research workflow failed'
            : 'Deep research workflow timed out',
      });
    }
    
    const analysisTime = Math.round((Date.now() - startTime) / 1000);
    
    // Parse the AI response to extract dashboard data
    const dashboardData = parseAnswerForDashboard(runResult.output.answer, analysisTime);
    
    // Include bias analysis and sources with bias data if available
    if (runResult.output.biasAnalysis) {
      dashboardData.biasAnalysis = runResult.output.biasAnalysis;
      
      // Use bias analysis distribution if available (more accurate than text parsing)
      if (runResult.output.biasAnalysis.distribution) {
        console.log('Server: Using bias analysis distribution instead of text parsing:', runResult.output.biasAnalysis.distribution);
        dashboardData.ideologicalDistribution = runResult.output.biasAnalysis.distribution;
      }
    }
    
    if (runResult.output.sourcesWithBias) {
      dashboardData.sourcesWithBias = runResult.output.sourcesWithBias;
    }
    
    console.log('Server: Deep research completed successfully');
    console.log('Server: Dashboard data extracted:', {
      neutralityScore: dashboardData.neutralityScore,
      sourcesCount: dashboardData.sources.length,
      analysisTime: dashboardData.transparency.analysisTime,
      biasAnalyzedSources: runResult.output.biasAnalysis?.analyzedCount || 0
    });
    
    res.json({
      status: 'completed',
      data: dashboardData,
    });
    
  } catch (error) {
    console.error('Server: Deep research API error:', error);
    res.status(500).json({
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
});

// Start a deep research run and return tracking info
app.post('/api/deep-research/start', async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query || typeof query !== 'string') {
      return res.status(400).json({
        error: 'Invalid request: query is required'
      });
    }
    
    console.log('Server: Starting research run for:', query);
    
    // Trigger the actual Trigger.dev workflow
    const handle = await deepResearch.trigger({
      originalQuery: query,
    });
    
    // For now, return just the runId without public access token
    // Real-time updates will be handled through polling
    res.json({
      runId: handle.id,
      publicAccessToken: null // Will use polling instead
    });
  } catch (error) {
    console.error('Server: Error starting research run:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to start research run'
    });
  }
});

// Get the result of a deep research run
app.get('/api/deep-research/result/:runId', async (req, res) => {
  try {
    const { runId } = req.params;
    
    if (!runId) {
      return res.status(400).json({
        error: 'runId is required'
      });
    }
    
    console.log('Server: Checking result for run:', runId);
    
    const runResult = await runs.retrieve(runId);
    
    if (!runResult) {
      return res.status(404).json({
        error: 'Run not found'
      });
    }
    
    // Return status based on run state
    if (runResult.status === 'COMPLETED') {
      return res.json({
        status: 'completed',
        data: runResult.output
      });
    } else if (runResult.status === 'FAILED') {
      return res.json({
        status: 'FAILED',
        error: runResult.error || 'Run failed'
      });
    } else {
      return res.json({
        status: 'running'
      });
    }
  } catch (error) {
    console.error('Server: Error fetching run result:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to fetch run result'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Deep research API available at http://localhost:${PORT}/api/deep-research`);
});

/**
 * Parses the AI response to extract structured dashboard data
 */
function parseAnswerForDashboard(answer, analysisTime) {
  console.log('Server: Parsing dashboard data from AI response...');
  
  // Extract structured data from the Dashboard Data Output section
  const neutralityScore = extractMetric(answer, /## Neutrality Score: (\d+)%/) || 75;
  
  // Extract ideological distribution
  const leftPercentage = extractMetric(answer, /- Left: (\d+)%/) || 33;
  const centerPercentage = extractMetric(answer, /- Center: (\d+)%/) || 34;
  const rightPercentage = extractMetric(answer, /- Right: (\d+)%/) || 33;
  
  // Extract transparency metrics
  const sourcesProcessed = extractMetric(answer, /## Sources Processed: (\d+) articles/) || 0;
  const newsOutlets = extractMetric(answer, /- News Outlets: (\d+) sources/) || 0;
  const academic = extractMetric(answer, /- Academic: (\d+) sources/) || 0;
  const government = extractMetric(answer, /- Government: (\d+) sources/) || 0;
  const other = extractMetric(answer, /- Other: (\d+) sources/) || 0;
  
  // Extract sources from references section
  const sources = extractSources(answer);
  
  console.log('Server: Extracted metrics:', {
    neutralityScore,
    ideologicalDistribution: { left: leftPercentage, center: centerPercentage, right: rightPercentage },
    sourcesProcessed,
    sourceBreakdown: { newsOutlets, academic, government, other }
  });
  
  return {
    answer,
    sources,
    neutralityScore,
    ideologicalDistribution: {
      left: leftPercentage,
      center: centerPercentage,
      right: rightPercentage,
    },
    transparency: {
      sourcesProcessed: sourcesProcessed || sources.length,
      analysisTime,
      sourceBreakdown: {
        newsOutlets,
        academic,
        government,
        other,
      },
    },
  };
}

/**
 * Extracts numeric metrics from the AI response using regex
 */
function extractMetric(text, regex) {
  const match = text.match(regex);
  return match ? parseInt(match[1], 10) : null;
}

/**
 * Extracts sources from the References section of the AI response
 */
function extractSources(answer) {
  const sources = [];
  
  // Find the References section
  const referencesMatch = answer.match(/### References\n([\s\S]*?)(?=\n##|$)/);
  if (!referencesMatch) {
    console.warn('Server: No references section found in AI response');
    return sources;
  }
  
  const referencesText = referencesMatch[1];
  
  // Parse each reference line
  // Format: "1. [Title](URL) - Outlet - Classification"
  const referenceRegex = /\d+\.\s*\[([^\]]+)\]\(([^)]+)\)\s*-\s*([^-]+)\s*-\s*(.+)/g;
  let match;
  
  while ((match = referenceRegex.exec(referencesText)) !== null) {
    const [, title, url, outlet, classification] = match;
    
    sources.push({
      title: title.trim(),
      url: url.trim(),
      summary: `Fuente: ${outlet.trim()} - ${classification.trim()}`,
      favicon: null, // We don't extract favicons from the AI response
    });
  }
  
  console.log(`Server: Extracted ${sources.length} sources from references`);
  return sources;
}
