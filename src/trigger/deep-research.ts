import { batch, logger, metadata, schemaTask } from "@trigger.dev/sdk/v3";
import { z } from "zod";
import { generateResearchQueries } from "./generate-research-queries";
import { search } from "./search";
import type { SearchResult } from "./search";
import { evaluate } from "./evaluate";
import { filterSearchResults } from "./filter-search-results";
import { answer } from "./answer";
import { biasAnalysis } from "./bias-analysis";
 
export const MAX_ITERATIONS = 2;
 
export const deepResearch = schemaTask({
  id: "deep-research",
  schema: z.object({
    originalQuery: z.string(),
    clarification: z.string().optional(),
  }),
  run: async ({ originalQuery, clarification }, { ctx }) => {
    logger.log("Deep research", { originalQuery, clarification });
 
    // Step 1: Generate research queries
    await metadata.set("progress", {
      step: 0,
      message: "Generando consultas de investigación...",
      percentage: 5
    });
 
    const queriesResult = await generateResearchQueries.triggerAndWait(
      {
        originalQuery,
        clarification,
      },
      {
        tags: ctx.run.tags,
      },
    );
 
    if (!queriesResult.ok) {
      throw new Error("Failed to generate research queries");
    }
 
    const queries = queriesResult.output.queries;
    let nextQueries = [...queries];
 
    const searchResults: SearchResult[] = [];
 
    // Step 2: Search iterations
    for (let i = 0; i < MAX_ITERATIONS; i++) {
      await metadata.set("progress", {
        step: 1,
        message: "Buscando fuentes de noticias...",
        percentage: 10 + (i * 30) // 10-40% for searches
      });
 
      const _searchResults = await batch.triggerByTaskAndWait<
        (typeof search)[]
      >(
        nextQueries.map((query) => ({
          task: search,
          payload: { query },
          options: {
            tags: ctx.run.tags,
          },
        })),
      );
 
      searchResults.push(
        ..._searchResults.runs
          .filter((run): run is typeof run & { ok: true; output: any } => run.ok)
          .flatMap((run) => run.output.results),
      );
 
      if (i === MAX_ITERATIONS - 1) {
        nextQueries = [];
        break;
      }
 
      await metadata.set("progress", {
        step: 2,
        message: "Evaluando resultados de búsqueda...",
        percentage: 40 + (i * 15) // 40-55% for evaluation
      });
 
      const evaluationResult = await evaluate.triggerAndWait(
        {
          originalQuery,
          searchResults,
          queries,
        },
        {
          tags: ctx.run.tags,
        },
      );
 
      if (!evaluationResult.ok) {
        throw new Error("Failed to evaluate");
      }
 
      nextQueries = [...evaluationResult.output.queries];
 
      if (nextQueries.length === 0) {
        break;
      }
 
      queries.push(...nextQueries);
    }
 
    // Step 3: Filter search results
    await metadata.set("progress", {
      step: 2,
      message: "Procesando y filtrando resultados...",
      percentage: 60
    });
 
      const filteredSearchResultsResult =
      await filterSearchResults.triggerAndWait(
        {
          originalQuery,
          searchResults,
        },
        {
          tags: ctx.run.tags,
        },
      );
 
    if (!filteredSearchResultsResult.ok) {
      throw new Error("Failed to filter search results");
    }
 
    // Mapear índices -> objetos completos SearchResult
    const filteredIndices = filteredSearchResultsResult.output.searchResults as number[];
    const filteredResults = filteredIndices
      .map((i) => searchResults[i])
      .filter((r) => !!r);

    // AÑADIR: Step 3.5: Analyze bias for filtered sources
    await metadata.set("progress", {
      step: 2.5,
      message: "Analizando sesgo político de las fuentes...",
      percentage: 70
    });

    const biasAnalysisResult = await biasAnalysis.triggerAndWait(
      {
        sources: filteredResults.map(r => ({
          title: r.title,
          url: r.url,
          summary: r.summary,
          favicon: r.favicon
        })),
        enableParallelProcessing: true,
        enableBatchProcessing: true,
        maxConcurrentRequests: 3
      },
      {
        tags: ctx.run.tags,
      }
    );

    let sourcesWithBias = filteredResults;
    let biasStats = null;
    
    if (biasAnalysisResult.ok) {
      sourcesWithBias = biasAnalysisResult.output.sources;
      biasStats = biasAnalysisResult.output.stats;
      logger.log("Bias analysis completed", { 
        analyzedSources: biasStats.analyzedCount,
        distribution: biasStats.distribution 
      });
    } else {
      logger.error("Bias analysis failed, proceeding without bias data");
    }

    // Step 4: Generate final answer
    await metadata.set("progress", {
      step: 3,
      message: "Generando respuesta final...",
      percentage: 80
    });
 
    const answerResult = await answer.triggerAndWait(
      {
        originalQuery,
        clarification,
        searchResults: sourcesWithBias, // CAMBIAR: usar sourcesWithBias
      },
      {
        tags: ctx.run.tags,
      },
    );
 
    if (!answerResult.ok) {
      throw new Error("Failed to generate answer");
    }
 
    // Step 5: Complete
    await metadata.set("progress", {
      step: 4,
      message: "Completado",
      percentage: 100
    });
 
    return {
      answer: answerResult.output.answer,
      sources: sourcesWithBias,        // AÑADIR: incluir fuentes con sesgo
      biasStats,                       // AÑADIR: estadísticas de sesgo
    };
  },
});