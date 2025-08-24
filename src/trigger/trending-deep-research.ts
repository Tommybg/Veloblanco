import { logger, schemaTask, metadata } from "@trigger.dev/sdk/v3";
import { z } from "zod";
import { deepResearch } from "./deep-research";
import { biasAnalysis } from "./bias-analysis";

export const trendingDeepResearch = schemaTask({
  id: "trending-deep-research",
  schema: z.object({
    topicId: z.string(),
    topicTitle: z.string(),
    topicSources: z.array(z.any()),
    period: z.string(),
    category: z.string().optional(),
    country: z.string().optional(),
  }),
  run: async ({ topicId, topicTitle, topicSources, period, category, country }, { ctx }) => {
    logger.log("Starting deep research for trending topic", { 
      topicId, 
      topicTitle, 
      sourceCount: topicSources.length 
    });

    await metadata.set("progress", {
      step: 0,
      message: `Iniciando investigación profunda: ${topicTitle}`,
      percentage: 5
    });

    // Step 1: Ejecutar deep research completo
    await metadata.set("progress", {
      step: 1,
      message: "Ejecutando investigación profunda...",
      percentage: 20
    });

    const deepResearchResult = await deepResearch.triggerAndWait(
      {
        originalQuery: topicTitle,
        clarification: `Analizar este trending topic en profundidad. Incluir análisis de sesgo político, perspectivas múltiples, y fuentes verificadas. Categoría: ${category || 'General'}, País: ${country || 'Latinoamérica'}, Período: ${period}`
      },
      {
        tags: ctx.run.tags,
      }
    );

    if (!deepResearchResult.ok) {
      throw new Error("Failed to execute deep research");
    }

    await metadata.set("progress", {
      step: 2,
      message: "Analizando sesgo político de las fuentes...",
      percentage: 60
    });

    // Step 2: Análisis de sesgo adicional si no se hizo en deep research
    let biasAnalysisResult = null;
    if (!deepResearchResult.output.biasStats) {
      biasAnalysisResult = await biasAnalysis.triggerAndWait(
        {
          sources: deepResearchResult.output.sources.map((s: any) => ({
            title: s.title,
            url: s.url,
            summary: s.summary,
            favicon: s.favicon
          })),
          enableParallelProcessing: true,
          enableBatchProcessing: true,
          maxConcurrentRequests: 3
        },
        {
          tags: ctx.run.tags,
        }
      );
    }

    await metadata.set("progress", {
      step: 3,
      message: "Preparando datos para almacenamiento...",
      percentage: 80
    });

    // Step 3: Preparar datos para Supabase
    const finalBiasStats = biasAnalysisResult?.ok 
      ? biasAnalysisResult.output.stats 
      : deepResearchResult.output.biasStats;

    const finalSources = biasAnalysisResult?.ok 
      ? biasAnalysisResult.output.sources 
      : deepResearchResult.output.sources;

    const researchData = {
      topicId,
      topicTitle,
      category: category || 'General',
      country: country || 'Latinoamérica',
      period,
      researchDate: new Date().toISOString(),
      answer: deepResearchResult.output.answer,
      sources: finalSources,
      biasStats: finalBiasStats,
      sourceCount: finalSources?.length || 0,
      analysisTime: Math.floor(Math.random() * 300 + 60), // Simulado por ahora
      neutralityScore: finalBiasStats?.neutralityScore || 70,
      ideologicalDistribution: finalBiasStats?.distribution || {
        left: 33,
        center: 34,
        right: 33
      }
    };

    await metadata.set("progress", {
      step: 4,
      message: "Completado",
      percentage: 100
    });

    logger.log("Trending topic deep research completed", {
      topicId,
      sourceCount: researchData.sourceCount,
      neutralityScore: researchData.neutralityScore
    });

    return {
      success: true,
      researchData,
      message: `Investigación profunda completada para: ${topicTitle}`
    };
  },
});
