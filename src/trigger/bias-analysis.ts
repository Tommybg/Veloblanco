/**
 * Trigger.dev task for political bias analysis
 * Integrates with the deep research pipeline
 */

import { logger, schemaTask } from "@trigger.dev/sdk/v3";
import { z } from "zod";
import { biasPipeline } from "../services/bias-pipeline";
import { SearchResult } from "../types/research";

export const BiasAnalysisSchema = z.object({
  sources: z.array(z.object({
    title: z.string().nullable(),
    url: z.string(),
    summary: z.string(),
    favicon: z.string().nullable(),
  })),
  enableParallelProcessing: z.boolean().default(true),
  enableBatchProcessing: z.boolean().default(true),
  maxConcurrentRequests: z.number().default(5),
});

export const biasAnalysis = schemaTask({
  id: "bias-analysis",
  schema: BiasAnalysisSchema,
  run: async ({ 
    sources, 
    enableParallelProcessing, 
    enableBatchProcessing,
    maxConcurrentRequests 
  }, { ctx }) => {
    const startTime = Date.now();
    
    logger.log("Starting bias analysis task", { 
      sourceCount: sources.length,
      enableParallelProcessing,
      enableBatchProcessing,
      maxConcurrentRequests
    });

    try {
      // Initialize the bias pipeline
      await biasPipeline.initialize();
      
      // Convert input sources to SearchResult format
      const searchResults: SearchResult[] = sources.map(source => ({
        title: source.title,
        url: source.url,
        summary: source.summary,
        favicon: source.favicon
      }));

      // Analyze sources for political bias
      const analyzedSources = await biasPipeline.analyzeBatch(searchResults, {
        enableParallelProcessing,
        enableBatchProcessing,
        maxConcurrentRequests,
        timeoutMs: 30000
      });

      const processingTime = Date.now() - startTime;
      
      // Calculate analysis statistics
      const stats = calculateBiasStats(analyzedSources);
      
      logger.log("Bias analysis task completed", {
        processingTime,
        totalSources: analyzedSources.length,
        analyzedSources: stats.analyzedCount,
        stats
      });

      return {
        sources: analyzedSources,
        stats,
        processingTime
      };
      
    } catch (error) {
      logger.error("Error in bias analysis task", { 
        error: error.message,
        sourceCount: sources.length 
      });
      
      // Return sources without bias analysis on error
      return {
        sources: sources.map(source => ({
          title: source.title,
          url: source.url,
          summary: source.summary,
          favicon: source.favicon
        })),
        stats: {
          analyzedCount: 0,
          distribution: { left: 0, center: 0, right: 0 },
          averageCertainty: 0,
          highCertaintyCount: 0,
          agreementRate: 0
        },
        processingTime: Date.now() - startTime,
        error: error.message
      };
    }
  },
});

/**
 * Calculate statistics from bias analysis results
 */
function calculateBiasStats(sources: SearchResult[]) {
  const analyzedSources = sources.filter(s => s.biasClassification);
  const classifications = analyzedSources.map(s => s.biasClassification!);
  
  if (classifications.length === 0) {
    return {
      analyzedCount: 0,
      distribution: { left: 0, center: 0, right: 0 },
      averageCertainty: 0,
      highCertaintyCount: 0,
      agreementRate: 0
    };
  }
  
  // Calculate distribution counts first
  const counts = {
    left: classifications.filter(c => c.fusedResult.category === 'left').length,
    center: classifications.filter(c => c.fusedResult.category === 'center').length,
    right: classifications.filter(c => c.fusedResult.category === 'right').length
  };
  
  // Convert counts to percentages
  const total = counts.left + counts.center + counts.right;
  const distribution = {
    left: total > 0 ? Math.round((counts.left / total) * 100) : 0,
    center: total > 0 ? Math.round((counts.center / total) * 100) : 0,
    right: total > 0 ? Math.round((counts.right / total) * 100) : 0
  };
  
  // Calculate average certainty
  const certainties = classifications.map(c => c.fusedResult.certainty);
  const averageCertainty = certainties.reduce((a, b) => a + b, 0) / certainties.length;
  
  // Calculate high certainty count (>= 80%)
  const highCertaintyCount = certainties.filter(c => c >= 80).length;
  
  // Calculate agreement rate (both BERT and OpenAI agree)
  const agreements = classifications.filter(c => 
    c.bertPrediction.category === c.openaiVerification.category
  ).length;
  const agreementRate = (agreements / classifications.length) * 100;
  
  return {
    analyzedCount: classifications.length,
    distribution,
    averageCertainty: Math.round(averageCertainty),
    highCertaintyCount,
    agreementRate: Math.round(agreementRate)
  };
}
