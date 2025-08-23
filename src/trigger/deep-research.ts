import { batch, logger, schemaTask } from "@trigger.dev/sdk/v3";
import { z } from "zod";
import { generateResearchQueries } from "./generate-research-queries";
import { type SearchResult, search } from "./search";
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

    for (let i = 0; i < MAX_ITERATIONS; i++) {
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
          .filter((run) => run.ok)
          .flatMap((run) => run.output.results),
      );

      if (i === MAX_ITERATIONS - 1) {
        nextQueries = [];
        break;
      }

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

    const filteredSearchResultsResult =
      await filterSearchResults.triggerAndWait(
        {
          searchResults,
          originalQuery,
          clarification,
        },
        {
          tags: ctx.run.tags,
        },
      );

    if (!filteredSearchResultsResult.ok) {
      throw new Error("Failed to filter search results");
    }

    const filteredSearchResultsIndexes =
      filteredSearchResultsResult.output.searchResults;

    const finalSearchResults: SearchResult[] = [];

    for (let i = 0; i < filteredSearchResultsIndexes.length; i++) {
      finalSearchResults.push(
        searchResults[filteredSearchResultsIndexes[i] - 1],
      );
    }

    // Perform bias analysis on the final search results
    logger.log("Starting bias analysis for filtered results", { 
      count: finalSearchResults.length 
    });
    
    const biasAnalysisResult = await biasAnalysis.triggerAndWait(
      {
        sources: finalSearchResults,
        enableParallelProcessing: true,
        enableBatchProcessing: true,
        maxConcurrentRequests: 3
      },
      {
        tags: ctx.run.tags,
      },
    );

    let sourcesWithBias = finalSearchResults;
    let biasStats = null;

    if (biasAnalysisResult.ok) {
      sourcesWithBias = biasAnalysisResult.output.sources;
      biasStats = biasAnalysisResult.output.stats;
      
      logger.log("Bias analysis completed successfully", {
        analyzedSources: biasStats.analyzedCount,
        distribution: biasStats.distribution,
        averageCertainty: biasStats.averageCertainty
      });
    } else {
      logger.error("Bias analysis failed", { 
        error: biasAnalysisResult.error 
      });
    }

    const answerResult = await answer.triggerAndWait(
      {
        originalQuery,
        clarification,
        searchResults: sourcesWithBias,
      },
      {
        tags: ctx.run.tags,
      },
    );

    if (!answerResult.ok) {
      throw new Error("Failed to answer");
    }

    return {
      answer: answerResult.output.answer,
      biasAnalysis: biasStats,
      sourcesWithBias: sourcesWithBias,
    };
  },
});