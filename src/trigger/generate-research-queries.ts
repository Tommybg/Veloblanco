import { openai } from "@ai-sdk/openai";
import { logger, schemaTask, wait } from "@trigger.dev/sdk/v3";
import { generateObject, generateText } from "ai";
import { z } from "zod";
import { PLANNING_PROMPT } from "../prompts/planning_prompt";
import { PLAN_PARSING_PROMPT } from "../prompts/plan-parsing";

export const generateResearchQueries = schemaTask({
  id: "generate-research-queries",
  maxDuration: 300,
  schema: z.object({
    originalQuery: z.string(),
    clarification: z.string().optional(),
  }),
  run: async ({ originalQuery, clarification }) => {
    logger.log("Generating research queries", { originalQuery, clarification });

    // Asegurar que la consulta incluya contexto español
    const spanishContextQuery = originalQuery.includes('español') || 
                                originalQuery.includes('Colombia') || 
                                originalQuery.includes('Latinoamérica')
      ? originalQuery
      : `${originalQuery} Colombia Latinoamérica español`;

    const planningResponse = await generateText({
      model: openai("gpt-4.1"),
      system: PLANNING_PROMPT,
      prompt: `
      Consulta Original: ${spanishContextQuery}
      Aclaración: ${clarification || "Ninguna"}
      
      **IMPORTANTE**: Genera consultas de búsqueda que prioricen fuentes en español, 
      especialmente medios colombianos y latinoamericanos. Incluye términos como 
      "Colombia", "español", "Latinoamérica" cuando sea relevante.
      `.trim(),
    });

    logger.log("Planning response", {
      planningResponse: planningResponse.text,
    });

    const planParsingResponse = await generateObject({
      model: openai("gpt-4.1"),
      system: PLAN_PARSING_PROMPT,
      prompt: `
      Plan: ${planningResponse.text}
      `.trim(),
      schema: z.object({
        queries: z.array(z.string()),
      }),
    });

    logger.log("Generated Spanish-priority queries", {
      queries: planParsingResponse.object.queries,
    });

    return {
      queries: planParsingResponse.object.queries,
    };
  },
});