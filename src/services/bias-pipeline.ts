/**
 * Bias Pipeline Service
 * Orchestrates the complete bias analysis pipeline combining BERT and OpenAI
 */

import { logger } from "@trigger.dev/sdk/v3";
import { biasClient, type BiasResult } from "./bias-client";
import { biasVerifier, type BiasVerificationResult } from "./bias-verifier";
import { biasFusion, type BiasClassification } from "./bias-fusion";
import type { SearchResult } from "../types/research";

export interface BiasAnalysisOptions {
  enableParallelProcessing?: boolean;
  enableBatchProcessing?: boolean;
  maxConcurrentRequests?: number;
  timeoutMs?: number;
  fallbackToSingleModel?: boolean;
}

export class BiasPipelineService {
  private static instance: BiasPipelineService;
  private isInitialized = false;

  static getInstance(): BiasPipelineService {
    if (!BiasPipelineService.instance) {
      BiasPipelineService.instance = new BiasPipelineService();
    }
    return BiasPipelineService.instance;
  }

  /**
   * Initialize the bias pipeline
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    logger.log('Initializing bias analysis pipeline...');

    try {
      // Check if bias service is available
      const isServiceReady = await biasClient.waitForService(10, 2000);
      
      if (!isServiceReady) {
        logger.warn('Bias service not available, analysis will use fallback methods');
      }

      this.isInitialized = true;
      logger.log('Bias pipeline initialized successfully', { serviceReady: isServiceReady });
    } catch (error) {
      logger.error('Failed to initialize bias pipeline', { error: error.message });
      throw error;
    }
  }

  /**
   * Analyze a single source for bias
   */
  async analyzeSingle(
    source: SearchResult,
    options: BiasAnalysisOptions = {}
  ): Promise<SearchResult> {
    const text = this.prepareTextForAnalysis(source);
    
    try {
      const classification = await this.analyzeText(text, source, options);
      
      return {
        ...source,
        biasClassification: classification
      };
    } catch (error) {
      logger.error('Error analyzing single source', { 
        error: error.message,
        sourceUrl: source.url 
      });
      
      // Return source without bias classification on error
      return source;
    }
  }

  /**
   * Analyze multiple sources in batch
   */
  async analyzeBatch(
    sources: SearchResult[],
    options: BiasAnalysisOptions = {}
  ): Promise<SearchResult[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    logger.log('Starting batch bias analysis', { 
      sourceCount: sources.length,
      options 
    });

    const {
      enableParallelProcessing = true,
      maxConcurrentRequests = 5
    } = options;

    if (enableParallelProcessing && sources.length > 1) {
      return this.analyzeParallel(sources, options, maxConcurrentRequests);
    } else {
      return this.analyzeSequential(sources, options);
    }
  }

  /**
   * Analyze sources in parallel with controlled concurrency
   */
  private async analyzeParallel(
    sources: SearchResult[],
    options: BiasAnalysisOptions,
    maxConcurrent: number
  ): Promise<SearchResult[]> {
    logger.log('Using parallel processing', { maxConcurrent });
    
    const results: SearchResult[] = [];
    const chunks = this.chunkArray(sources, maxConcurrent);
    
    for (const chunk of chunks) {
      const chunkPromises = chunk.map(source => 
        this.analyzeSingle(source, options)
      );
      
      const chunkResults = await Promise.all(chunkPromises);
      results.push(...chunkResults);
    }
    
    return results;
  }

  /**
   * Analyze sources sequentially
   */
  private async analyzeSequential(
    sources: SearchResult[],
    options: BiasAnalysisOptions
  ): Promise<SearchResult[]> {
    logger.log('Using sequential processing');
    
    const results: SearchResult[] = [];
    
    for (const source of sources) {
      const result = await this.analyzeSingle(source, options);
      results.push(result);
    }
    
    return results;
  }

  /**
   * Analyze text using both BERT and OpenAI, then fuse results
   */
  private async analyzeText(
    text: string,
    source: SearchResult,
    options: BiasAnalysisOptions
  ): Promise<BiasClassification> {
    const startTime = Date.now();
    
    try {
      if (options.enableParallelProcessing) {
        return await this.analyzeParallelModels(text, source, options);
      } else {
        return await this.analyzeSequentialModels(text, source, options);
      }
    } catch (error) {
      logger.error('Error in text analysis', { 
        error: error.message,
        sourceUrl: source.url 
      });
      
      const processingTime = Date.now() - startTime;
      return biasFusion.createDefaultClassification(processingTime);
    }
  }

  /**
   * Run BERT and OpenAI analysis in parallel
   */
  private async analyzeParallelModels(
    text: string,
    source: SearchResult,
    options: BiasAnalysisOptions
  ): Promise<BiasClassification> {
    const processingStartTime = Date.now();
    
    // Run both analyses in parallel
    const [bertResult, openaiResult] = await Promise.allSettled([
      this.runBertAnalysis(text),
      this.runOpenAIAnalysis(text, source)
    ]);

    const processingTime = Date.now() - processingStartTime;

    return this.processPredictionResults(
      bertResult.status === 'fulfilled' ? bertResult.value : null,
      openaiResult.status === 'fulfilled' ? openaiResult.value : null,
      { ...options, processingTime }
    );
  }

  /**
   * Run BERT and OpenAI analysis sequentially
   */
  private async analyzeSequentialModels(
    text: string,
    source: SearchResult,
    options: BiasAnalysisOptions
  ): Promise<BiasClassification> {
    const processingStartTime = Date.now();
    
    let bertResult: BiasResult | null = null;
    let openaiResult: BiasVerificationResult | null = null;

    try {
      bertResult = await this.runBertAnalysis(text);
    } catch (error) {
      logger.error('BERT analysis failed', { error: error.message });
    }

    try {
      openaiResult = await this.runOpenAIAnalysis(text, source);
    } catch (error) {
      logger.error('OpenAI analysis failed', { error: error.message });
    }

    const processingTime = Date.now() - processingStartTime;

    return this.processPredictionResults(bertResult, openaiResult, { ...options, processingTime });
  }

  /**
   * Run BERT analysis via bias client
   */
  private async runBertAnalysis(text: string): Promise<BiasResult> {
    return await biasClient.classifyText(text);
  }

  /**
   * Run OpenAI analysis via bias verifier
   */
  private async runOpenAIAnalysis(text: string, source: SearchResult): Promise<BiasVerificationResult> {
    return await biasVerifier.verifyBias(text, source.url, source.title);
  }

  /**
   * Process and fuse prediction results
   */
  private processPredictionResults(
    bertResult: BiasResult | null,
    openaiResult: BiasVerificationResult | null,
    options: BiasAnalysisOptions & { processingTime?: number }
  ): BiasClassification {
    const processingTime = options.processingTime || 0;
    
    // Handle case where both failed
    if (!bertResult && !openaiResult) {
      logger.warn("Both BERT and OpenAI failed, using default classification");
      return biasFusion.createDefaultClassification(processingTime);
    }
    
    // Handle case where only one succeeded
    if (!bertResult && openaiResult) {
      logger.log("Using OpenAI-only classification");
      return biasFusion.createOpenAIOnlyClassification(openaiResult, processingTime);
    }
    
    if (bertResult && !openaiResult) {
      logger.log("Using BERT-only classification");
      return biasFusion.createBertOnlyClassification(bertResult, processingTime);
    }
    
    // Both succeeded - fuse results
    logger.log("Fusing BERT and OpenAI results");
    return biasFusion.fuseResults(
      bertResult!,
      openaiResult!,
      processingTime
    );
  }

  /**
   * Prepare text for analysis by combining title and summary
   */
  private prepareTextForAnalysis(source: SearchResult): string {
    const parts = [];
    
    if (source.title) {
      parts.push(`Title: ${source.title}`);
    }
    
    if (source.summary) {
      parts.push(`Content: ${source.summary}`);
    }
    
    return parts.join('\n\n') || 'No content available';
  }

  /**
   * Split array into chunks of specified size
   */
  private chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }
}

// Export singleton instance
export const biasPipeline = BiasPipelineService.getInstance();
