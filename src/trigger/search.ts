import { batch, logger, schemaTask } from "@trigger.dev/sdk/v3";
import { z } from "zod";

import { tavily } from "@tavily/core";
import { summarize } from "./summarize";

// Initialize Tavily client inside the task to ensure env vars are loaded
function getTavilyClient() {
  return tavily({
    apiKey: process.env.TAVILY_API_KEY,
  });
}

export const SearchResultSchema = z.object({
  title: z.string().nullable(),
  url: z.string(),
  summary: z.string(),
  favicon: z.string().nullable(),
});

export type SearchResult = z.infer<typeof SearchResultSchema>;

export const search = schemaTask({
  id: "search",
  schema: z.object({
    query: z.string(),
  }),
  run: async ({ query }, { ctx }) => {
    logger.log("Searching", { query });

    // Modificar la consulta para priorizar fuentes en español
    const spanishPriorityQuery = query.includes('español') || 
                                query.includes('Colombia') || 
                                query.includes('Latinoamérica') ||
                                query.includes('Spanish')
      ? query
      : `${query} español Colombia Latinoamérica`;

    const tavilyClient = getTavilyClient();
    const searchResults = await tavilyClient.search(spanishPriorityQuery, {
      searchDepth: "basic",
      includeFavicon: true,
      // Priorizar fuentes en español
      region: "CO", // Colombia
      language: "es", // Español
      // Incluir dominios de medios colombianos y latinoamericanos
      includeDomains: [
        "eltiempo.com", "semana.com", "elespectador.com", "larepublica.co",
        "bbc.com/mundo", "cnnespanol.cnn.com", "dw.com/es", "france24.com/es",
        "infobae.com", "clarin.com", "lanacion.com.ar", "eluniverso.com"
      ]
    });

    const summaryResults = await batch.triggerByTaskAndWait<
      (typeof summarize)[]
    >(
      searchResults.results.map((result) => ({
        task: summarize,
        payload: {
          query,
          searchResult: result,
        },
        options: {
          tags: ctx.run.tags,
        },
      })),
    );

    const summaries: {
      url: string;
      summary: string;
    }[] = [];

    summaryResults.runs.forEach((run) => {
      if (run.ok) {
        summaries.push(run.output);
      }
    });

    const results: SearchResult[] = [];

    searchResults.results.forEach((result) => {
      const summary = summaries.find((summary) => summary.url === result.url);

      if (summary) {
        results.push({
          ...result,
          summary: summary.summary,
          title: result.title ?? null,
          // @ts-ignore
          favicon: result.favicon ?? null,
        });
      }
    });

    return {
      results,
    };
  },
});

