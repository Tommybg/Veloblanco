import { logger, schemaTask, metadata } from "@trigger.dev/sdk/v3";
import { z } from "zod";
import { search } from "./search";
import { batch } from "@trigger.dev/sdk/v3";

export const trendingTopics = schemaTask({
  id: "trending-topics",
  schema: z.object({
    period: z.enum(["24h", "7d", "30d"]).default("24h"),
    category: z.string().optional(),
    country: z.string().optional(),
  }),
  run: async ({ period, category, country }, { ctx }) => {
    logger.log("Detecting trending topics", { period, category, country });

    await metadata.set("progress", {
      step: 0,
      message: "Analizando tendencias del día...",
      percentage: 10
    });

    // Consultas base para detectar trending topics
    const trendingQueries = [
      "noticias más importantes Colombia hoy",
      "tendencias políticas Latinoamérica últimas horas",
      "eventos destacados economía región",
      "acontecimientos sociales Colombia trending",
      "tecnología innovación América Latina",
      "deportes Colombia resultados destacados"
    ];

    // Filtrar por categoría si se especifica
    let filteredQueries = trendingQueries;
    if (category && category !== "todos") {
      const categoryMap: Record<string, string[]> = {
        "política": ["noticias políticas Colombia", "elecciones Latinoamérica", "gobierno región"],
        "economía": ["economía Colombia hoy", "mercado financiero región", "comercio Latinoamérica"],
        "tecnología": ["tecnología Colombia", "startups Latinoamérica", "innovación región"],
        "sociedad": ["sociedad Colombia", "eventos sociales región", "cultura Latinoamérica"],
        "deportes": ["deportes Colombia", "fútbol región", "eventos deportivos Latinoamérica"]
      };
      filteredQueries = categoryMap[category.toLowerCase()] || trendingQueries;
    }

    // Filtrar por país si se especifica
    if (country && country !== "todos") {
      filteredQueries = filteredQueries.map(query => `${query} ${country}`);
    }

    await metadata.set("progress", {
      step: 1,
      message: "Buscando fuentes de trending topics...",
      percentage: 30
    });

    // Ejecutar búsquedas en paralelo
    const searchResults = await batch.triggerByTaskAndWait<typeof search[]>(
      filteredQueries.slice(0, 6).map((query) => ({
        task: search,
        payload: { query },
        options: {
          tags: ctx.run.tags,
        },
      })),
    );

    await metadata.set("progress", {
      step: 2,
      message: "Procesando y analizando tendencias...",
      percentage: 60
    });

    // Procesar resultados y detectar trending topics
    const allResults = searchResults.runs
      .filter((run): run is typeof run & { ok: true; output: any } => run.ok)
      .flatMap((run) => run.output.results);

    // Agrupar por temas similares y calcular métricas de trending
    const topicGroups = new Map<string, {
      title: string;
      sources: any[];
      count: number;
      keywords: Set<string>;
      urls: Set<string>;
    }>();

    allResults.forEach((result) => {
      // Extraer palabras clave del título y resumen
      const text = `${result.title || ""} ${result.summary}`.toLowerCase();
      const keywords = text
        .split(/\s+/)
        .filter(word => word.length > 3)
        .slice(0, 5);

      // Crear un identificador de tema basado en palabras clave
      const topicKey = keywords.slice(0, 3).join(" ");

      if (!topicGroups.has(topicKey)) {
        topicGroups.set(topicKey, {
          title: result.title || "Tema trending",
          sources: [],
          count: 0,
          keywords: new Set(),
          urls: new Set()
        });
      }

      const group = topicGroups.get(topicKey)!;
      group.sources.push(result);
      group.count++;
      keywords.forEach(k => group.keywords.add(k));
      group.urls.add(result.url);
    });

    // Convertir a array y ordenar por relevancia
    const trendingTopics = Array.from(topicGroups.entries())
      .map(([key, group]) => ({
        id: key,
        title: group.title,
        sources: group.sources,
        sourceCount: group.count,
        uniqueSources: group.urls.size,
        keywords: Array.from(group.keywords).slice(0, 5),
        trend: `+${Math.floor(Math.random() * 200 + 50)}%`, // Simulado por ahora
        timeAgo: period === "24h" ? `${Math.floor(Math.random() * 24)}h` : 
                 period === "7d" ? `${Math.floor(Math.random() * 7)}d` : 
                 `${Math.floor(Math.random() * 30)}d`
      }))
      .sort((a, b) => b.sourceCount - a.sourceCount)
      .slice(0, 10);

    await metadata.set("progress", {
      step: 3,
      message: "Completado",
      percentage: 100
    });

    logger.log("Trending topics detected", { 
      totalTopics: trendingTopics.length,
      totalSources: allResults.length 
    });

    return {
      trendingTopics,
      totalSources: allResults.length,
      period,
      category,
      country
    };
  },
});
