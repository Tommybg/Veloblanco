/**
 * Bias Client Service
 * Client for communicating with the bias classification API
 */

import { logger } from "@trigger.dev/sdk/v3";

export interface BiasResult {
  category: 'left' | 'center' | 'right';
  confidence: number;
  probabilities: {
    left: number;
    center: number;
    right: number;
  };
  processing_time: number;
}

export class BiasClientService {
  private static instance: BiasClientService;
  private apiUrl: string;
  private timeout: number;

  constructor(apiUrl: string = 'http://127.0.0.1:8001', timeout: number = 30000) {
    this.apiUrl = apiUrl;
    this.timeout = timeout;
  }

  static getInstance(): BiasClientService {
    if (!BiasClientService.instance) {
      BiasClientService.instance = new BiasClientService();
    }
    return BiasClientService.instance;
  }

  /**
   * Check if the bias service is healthy
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(this.timeout)
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      return data.status === 'healthy' && data.model_loaded;
    } catch (error) {
      logger.error('Bias service health check failed:', { error: error.message });
      return false;
    }
  }

  /**
   * Classify a single text for political bias
   */
  async classifyText(text: string, maxLength: number = 512): Promise<BiasResult> {
    try {
      const response = await fetch(`${this.apiUrl}/classify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          max_length: maxLength
        }),
        signal: AbortSignal.timeout(this.timeout)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
        throw new Error(`Bias classification failed: ${errorData.detail || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      logger.error('Error classifying text:', { error: error.message, text: text.substring(0, 100) });
      throw error;
    }
  }

  /**
   * Classify multiple texts in batch
   */
  async classifyBatch(texts: string[], maxLength: number = 512): Promise<BiasResult[]> {
    try {
      if (texts.length === 0) {
        return [];
      }

      if (texts.length > 100) {
        throw new Error('Batch size too large (max 100)');
      }

      const response = await fetch(`${this.apiUrl}/classify/batch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          texts,
          max_length: maxLength
        }),
        signal: AbortSignal.timeout(this.timeout * texts.length / 10) // Scale timeout with batch size
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
        throw new Error(`Batch bias classification failed: ${errorData.detail || response.statusText}`);
      }

      const data = await response.json();
      return data.results;
    } catch (error) {
      logger.error('Error in batch classification:', { error: error.message, batchSize: texts.length });
      throw error;
    }
  }

  /**
   * Wait for the service to be ready
   */
  async waitForService(maxAttempts: number = 30, delayMs: number = 2000): Promise<boolean> {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const isHealthy = await this.healthCheck();
      if (isHealthy) {
        logger.log(`Bias service is ready after ${attempt} attempts`);
        return true;
      }

      if (attempt < maxAttempts) {
        logger.log(`Bias service not ready, attempt ${attempt}/${maxAttempts}, waiting ${delayMs}ms...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }

    logger.error(`Bias service failed to become ready after ${maxAttempts} attempts`);
    return false;
  }
}

// Export singleton instance
export const biasClient = BiasClientService.getInstance();
