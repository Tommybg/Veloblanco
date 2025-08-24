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
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:8080'],
  credentials: true
}));
app.use(express.json());
 
// Deep Research API endpoint
app.post('/api/deep-research-start', async (req, res) => {
  try {
    const { query, clarification } = req.body;
   
    if (!query || typeof query !== 'string') {
      return res.status(400).json({
        status: 'failed',
        error: 'Invalid request: query is required'
      });
    }
   
    console.log('Server: Starting deep research workflow for:', query);
   
    const handle = await deepResearch.trigger(
      {
        originalQuery: query,
        clarification,
      },
      {
        publicTokenOptions: {
          scopes: {
            read: {
              runs: true,
            },
          },
          expirationTime: '1h',
        },
      }
    );
   
    res.json({
      status: 'started',
      runId: handle.id,
      publicAccessToken: handle.publicAccessToken,
    });
   
  } catch (error) {
    console.error('Server: Failed to start deep research:', error);
    res.status(500).json({
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
});
 
// SSE endpoint for real-time progress
app.get('/api/deep-research-stream/:runId', async (req, res) => {
  const { runId } = req.params;
 
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control'
  });
 
  const sendProgress = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };
 
  try {
    let runResult = await runs.retrieve(runId);
   
    sendProgress({
      type: 'progress',
      step: 0,
      message: 'Iniciando investigación...',
      percentage: 0,
      status: runResult.status
    });
 
    while (runResult.status !== 'COMPLETED' && runResult.status !== 'FAILED') {
      await new Promise((r) => setTimeout(r, 1000));
      runResult = await runs.retrieve(runId);
     
      if (runResult.metadata && runResult.metadata.progress) {
        const progress = runResult.metadata.progress;
        sendProgress({
          type: 'progress',
          step: progress.step,
          message: progress.message,
          percentage: progress.percentage,
          status: runResult.status
        });
      }
    }
 
    if (runResult.status === 'COMPLETED') {
      sendProgress({
        type: 'complete',
        data: parseAnswerForDashboard(runResult.output.answer, 0, runResult.output)
      });
    } else {
      sendProgress({
        type: 'error',
        error: runResult?.error?.message || 'Workflow failed'
      });
    }
  } catch (error) {
    sendProgress({
      type: 'error',
      error: error.message
    });
  } finally {
    res.end();
  }
});
 
// Retrieve run result by runId
app.get('/api/deep-research-result/:runId', async (req, res) => {
  try {
    const { runId } = req.params;
    if (!runId) return res.status(400).json({ error: 'runId is required' });
    const runResult = await runs.retrieve(runId);
    if (runResult.status !== 'COMPLETED') {
      return res.status(202).json({ status: runResult.status });
    }
    const dashboardData = parseAnswerForDashboard(runResult.output.answer, 0, runResult.output);
    res.json({ status: 'completed', data: dashboardData });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
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
function parseAnswerForDashboard(answer, analysisTime, output = {}) {
  console.log('Server: Parsing dashboard data from AI response...');
 
  // Use real bias data if available
  if (output.sources && output.biasStats) {
    console.log('Server: Using real bias analysis data:', {
      sourcesWithBias: output.sources.length,
      realDistribution: output.biasStats.distribution
    });
    
    return {
      answer,
      sourcesWithBias: output.sources,
      neutralityScore: 75, // Default, can be enhanced
      ideologicalDistribution: output.biasStats.distribution || { left: 33, center: 34, right: 33 },
      transparency: {
        sourcesProcessed: output.sources.length,
        analysisTime: analysisTime || 0,
        sourceBreakdown: { newsOutlets: 0, academic: 0, government: 0, other: 0 }
      }
    };
  }
 
  // Fallback parsing (existing logic)
  const neutralityScore = extractMetric(answer, /## Neutrality Score: (\d+)%/) || 75;
  const leftPercentage = extractMetric(answer, /- Left: (\d+)%/) || 33;
  const centerPercentage = extractMetric(answer, /- Center: (\d+)%/) || 34;
  const rightPercentage = extractMetric(answer, /- Right: (\d+)%/) || 33;
  const sourcesProcessed = extractMetric(answer, /## Sources Processed: (\d+) articles/) || 0;
 
  return {
    answer,
    sources: extractSources(answer),
    neutralityScore,
    ideologicalDistribution: { left: leftPercentage, center: centerPercentage, right: rightPercentage },
    transparency: { sourcesProcessed, analysisTime: analysisTime || 0, sourceBreakdown: { newsOutlets: 0, academic: 0, government: 0, other: 0 } }
  };
}
 
function extractMetric(text, regex) {
  const match = text.match(regex);
  return match ? parseInt(match[1], 10) : null;
}
 
function extractSources(answer) {
  const sources = [];
  const referencesMatch = answer.match(/### References\n([\s\S]*?)(?=\n##|$)/);
  if (!referencesMatch) return sources;
 
  const referencesText = referencesMatch[1];
  const referenceRegex = /\d+\.\s*\[([^\]]+)\]\(([^)]+)\)\s*-\s*([^-]+)\s*-\s*(.+)/g;
  let match;
 
  while ((match = referenceRegex.exec(referencesText)) !== null) {
    const [, title, url, outlet, classification] = match;
    sources.push({
      title: title.trim(),
      url: url.trim(),
      summary: `Fuente: ${outlet.trim()} - ${classification.trim()}`,
      favicon: null
    });
  }
 
  return sources;
}