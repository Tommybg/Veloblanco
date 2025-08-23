/**
 * Bias Fusion Service
 * Combines results from multiple bias detection sources (BERT + OpenAI)
 */

import { logger } from "@trigger.dev/sdk/v3";

export interface BertResult {
  category: 'left' | 'center' | 'right';
  confidence: number;
  probabilities: {
    left: number;
    center: number;
    right: number;
  };
}

export interface OpenAIResult {
  category: 'left' | 'center' | 'right';
  confidence: number;
  reasoning: string;
}

export interface FusedResult {
  category: 'left' | 'center' | 'right';
  certainty: number; // 0-100
  confidence: number; // 0-1
  method: 'bert_only' | 'openai_only' | 'fused' | 'default';
}

export interface BiasClassification {
  bertPrediction: BertResult;
  openaiVerification: OpenAIResult;
  fusedResult: FusedResult;
  processingTime: number;
}

export class BiasFusionService {
  private static instance: BiasFusionService;

  static getInstance(): BiasFusionService {
    if (!BiasFusionService.instance) {
      BiasFusionService.instance = new BiasFusionService();
    }
    return BiasFusionService.instance;
  }

  /**
   * Fuse BERT and OpenAI results into a single classification
   */
  fuseResults(
    bertResult: BertResult,
    openaiResult: OpenAIResult,
    processingTime: number = 0
  ): BiasClassification {
    logger.log('Fusing BERT and OpenAI results', {
      bert: bertResult.category,
      openai: openaiResult.category,
      bertConfidence: bertResult.confidence,
      openaiConfidence: openaiResult.confidence
    });

    const fusedResult = this.calculateFusedResult(bertResult, openaiResult);

    return {
      bertPrediction: bertResult,
      openaiVerification: openaiResult,
      fusedResult,
      processingTime
    };
  }

  /**
   * Create classification when only BERT result is available
   */
  createBertOnlyClassification(bertResult: BertResult, processingTime: number = 0): BiasClassification {
    logger.log('Creating BERT-only classification', { category: bertResult.category });

    const fusedResult: FusedResult = {
      category: bertResult.category,
      certainty: Math.round(bertResult.confidence * 100),
      confidence: bertResult.confidence,
      method: 'bert_only'
    };

    return {
      bertPrediction: bertResult,
      openaiVerification: {
        category: bertResult.category,
        confidence: bertResult.confidence,
        reasoning: 'OpenAI verification not available'
      },
      fusedResult,
      processingTime
    };
  }

  /**
   * Create classification when only OpenAI result is available
   */
  createOpenAIOnlyClassification(openaiResult: OpenAIResult, processingTime: number = 0): BiasClassification {
    logger.log('Creating OpenAI-only classification', { category: openaiResult.category });

    const fusedResult: FusedResult = {
      category: openaiResult.category,
      certainty: Math.round(openaiResult.confidence * 100),
      confidence: openaiResult.confidence,
      method: 'openai_only'
    };

    return {
      bertPrediction: {
        category: openaiResult.category,
        confidence: openaiResult.confidence,
        probabilities: this.generateProbabilities(openaiResult.category, openaiResult.confidence)
      },
      openaiVerification: openaiResult,
      fusedResult,
      processingTime
    };
  }

  /**
   * Create default classification when both fail
   */
  createDefaultClassification(processingTime: number = 0): BiasClassification {
    logger.warn('Creating default classification - both BERT and OpenAI failed');

    const fusedResult: FusedResult = {
      category: 'center',
      certainty: 50,
      confidence: 0.5,
      method: 'default'
    };

    const defaultResult = {
      category: 'center' as const,
      confidence: 0.5,
      probabilities: { left: 0.33, center: 0.34, right: 0.33 }
    };

    return {
      bertPrediction: defaultResult,
      openaiVerification: {
        category: 'center',
        confidence: 0.5,
        reasoning: 'Default classification - analysis failed'
      },
      fusedResult,
      processingTime
    };
  }

  /**
   * Calculate the fused result from BERT and OpenAI predictions
   */
  private calculateFusedResult(bertResult: BertResult, openaiResult: OpenAIResult): FusedResult {
    // Check for agreement
    const agree = bertResult.category === openaiResult.category;
    
    if (agree) {
      // Both models agree - high certainty
      const avgConfidence = (bertResult.confidence + openaiResult.confidence) / 2;
      const certainty = Math.min(Math.round(avgConfidence * 100 + 10), 100); // Boost for agreement
      
      return {
        category: bertResult.category,
        certainty,
        confidence: avgConfidence,
        method: 'fused'
      };
    } else {
      // Models disagree - use higher confidence prediction but reduce certainty
      const bertWeight = this.calculateModelWeight(bertResult);
      const openaiWeight = this.calculateModelWeight(openaiResult);
      
      if (bertWeight > openaiWeight) {
        return {
          category: bertResult.category,
          certainty: Math.round(bertResult.confidence * 80), // Reduced for disagreement
          confidence: bertResult.confidence * 0.9,
          method: 'fused'
        };
      } else {
        return {
          category: openaiResult.category,
          certainty: Math.round(openaiResult.confidence * 80), // Reduced for disagreement
          confidence: openaiResult.confidence * 0.9,
          method: 'fused'
        };
      }
    }
  }

  /**
   * Calculate weight for model based on confidence and other factors
   */
  private calculateModelWeight(result: BertResult | OpenAIResult): number {
    // Base weight on confidence
    let weight = result.confidence;
    
    // Add small bias towards BERT for consistency
    if ('probabilities' in result) {
      weight += 0.05; // Small BERT preference
    }
    
    return weight;
  }

  /**
   * Generate probability distribution for a given category and confidence
   */
  private generateProbabilities(category: 'left' | 'center' | 'right', confidence: number): {
    left: number;
    center: number;
    right: number;
  } {
    const base = (1 - confidence) / 2;
    
    switch (category) {
      case 'left':
        return { left: confidence, center: base, right: base };
      case 'center':
        return { left: base, center: confidence, right: base };
      case 'right':
        return { left: base, center: base, right: confidence };
    }
  }
}

// Export singleton instance
export const biasFusion = BiasFusionService.getInstance();
