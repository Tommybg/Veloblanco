/**
 * Bias Verifier Service
 * Uses OpenAI to verify and cross-check bias classifications
 */

import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";
import { logger } from "@trigger.dev/sdk/v3";

export interface BiasVerificationResult {
  category: 'left' | 'center' | 'right';
  confidence: number;
  reasoning: string;
  processingTime: number;
}

const BiasVerificationSchema = z.object({
  category: z.enum(['left', 'center', 'right']),
  confidence: z.number().min(0).max(1),
  reasoning: z.string()
});

export class BiasVerifierService {
  private static instance: BiasVerifierService;
  private model = openai("gpt-4o-mini");
  private maxRetries = 3;
  private retryDelay = 1000;

  static getInstance(): BiasVerifierService {
    if (!BiasVerifierService.instance) {
      BiasVerifierService.instance = new BiasVerifierService();
    }
    return BiasVerifierService.instance;
  }

  /**
   * Verify bias classification using OpenAI
   */
  async verifyBias(
    text: string,
    sourceUrl?: string,
    sourceTitle?: string
  ): Promise<BiasVerificationResult> {
    const startTime = Date.now();
    
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        logger.log(`Bias verification attempt ${attempt}/${this.maxRetries}`, {
          textLength: text.length,
          sourceUrl: sourceUrl?.substring(0, 50)
        });

        const prompt = this.buildVerificationPrompt(text, sourceUrl, sourceTitle);
        
        const result = await generateObject({
          model: this.model,
          schema: BiasVerificationSchema,
          prompt,
          temperature: 0.1
        });

        const processingTime = Date.now() - startTime;
        
        logger.log('Bias verification completed', {
          category: result.object.category,
          confidence: result.object.confidence,
          processingTime,
          attempt
        });

        return {
          ...result.object,
          processingTime
        };

      } catch (error) {
        lastError = error as Error;
        logger.error(`Bias verification attempt ${attempt} failed`, { 
          error: error.message,
          attempt,
          willRetry: attempt < this.maxRetries
        });

        if (attempt < this.maxRetries) {
          await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempt));
        }
      }
    }

    // All attempts failed, return fallback
    logger.error('All bias verification attempts failed', { 
      error: lastError?.message,
      attempts: this.maxRetries
    });

    return {
      category: 'center',
      confidence: 0.5,
      reasoning: `Verification failed after ${this.maxRetries} attempts: ${lastError?.message}`,
      processingTime: Date.now() - startTime
    };
  }

  /**
   * Verify multiple texts in batch
   */
  async verifyBatch(
    texts: Array<{
      text: string;
      sourceUrl?: string;
      sourceTitle?: string;
    }>
  ): Promise<BiasVerificationResult[]> {
    logger.log('Starting batch bias verification', { count: texts.length });
    
    const results: BiasVerificationResult[] = [];
    
    // Process in parallel with controlled concurrency
    const maxConcurrent = 5;
    const chunks = this.chunkArray(texts, maxConcurrent);
    
    for (const chunk of chunks) {
      const chunkPromises = chunk.map(({ text, sourceUrl, sourceTitle }) =>
        this.verifyBias(text, sourceUrl, sourceTitle)
      );
      
      const chunkResults = await Promise.all(chunkPromises);
      results.push(...chunkResults);
    }
    
    logger.log('Batch bias verification completed', { 
      total: results.length,
      successful: results.filter(r => r.category !== 'center' || r.confidence !== 0.5).length
    });
    
    return results;
  }

  /**
   * Build the verification prompt for OpenAI
   */
  private buildVerificationPrompt(
    text: string, 
    sourceUrl?: string, 
    sourceTitle?: string
  ): string {
    return `Analyze the following text for political bias and classify it as LEFT, CENTER, or RIGHT based on the ideological spectrum.

**CLASSIFICATION GUIDELINES:**

**LEFT (Progressive/Liberal):**
- Emphasis on social equality, wealth redistribution, expanded government programs
- Support for environmental regulations, minority rights, progressive taxation
- Critical of capitalism, traditional institutions, conservative policies
- Language: "social justice," "systemic inequality," "corporate greed," "climate action"

**CENTER (Neutral/Moderate):**
- Balanced presentation of multiple viewpoints without clear ideological preference
- Fact-based reporting focused on events rather than political interpretation
- Avoids loaded language or presents both sides fairly
- Moderate positions that don't strongly align with either left or right

**RIGHT (Conservative):**
- Emphasis on individual responsibility, free markets, traditional values
- Support for limited government, strong national defense, law and order
- Critical of progressive policies, government expansion, cultural changes
- Language: "personal responsibility," "traditional values," "economic freedom," "security"

**ANALYSIS FACTORS:**
1. **Language and Framing:** How is the issue presented? What words are emphasized?
2. **Sources and Citations:** Who is quoted? What perspective do they represent?
3. **Context and Focus:** What aspects of the story are highlighted or minimized?
4. **Implicit Assumptions:** What underlying beliefs about government, society, or economics are assumed?

**TEXT TO ANALYZE:**
${text}

${sourceUrl ? `\n**SOURCE URL:** ${sourceUrl}` : ''}
${sourceTitle ? `\n**SOURCE TITLE:** ${sourceTitle}` : ''}

**IMPORTANT INSTRUCTIONS:**
- Provide a confidence score between 0 and 1 (1 = absolutely certain, 0.5 = uncertain)
- If the text appears neutral or balanced, classify as CENTER with appropriate confidence
- Focus on the overall ideological lean, not just specific policy positions
- Consider both explicit statements and implicit framing
- Provide specific examples from the text to support your classification

Return a JSON object with:
- category: "left", "center", or "right"
- confidence: number between 0 and 1
- reasoning: detailed explanation with specific examples from the text`;
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
export const biasVerifier = BiasVerifierService.getInstance();
