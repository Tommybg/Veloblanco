// Script para poblar la base de datos con trending topics (LATAM, extendido)
// Ejecutar con: node scripts/populate-trending-topics.js

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Configurar dotenv
dotenv.config();

// Configuración de Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase environment variables');
  console.log('Asegúrate de tener VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en tu .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * NOTAS
 * - analysis_summary: resumen largo para la card.
 * - perspective_*_summary/keywords: campos “flat” que pide tu tabla (sin título).
 * - perspectives JSONB: se mantiene para compatibilidad con tu ResultsDashboard (usa center.summary).
 * - Fuentes: bias_category ∈ {'left','center','right'} para no romper el CHECK.
 */

const trendingTopicsData = [
  // ===== COLOMBIA 1 =====
  {
    title: "Fallece Miguel Uribe Turbay tras atentado del 7 de junio",
    category: "Política",
    country: "Colombia",
    period: "24h",
    trend: "+320%",
    source_count: 32,
    unique_sources: 23,
    keywords: ["Miguel Uribe Turbay", "magnicidio", "atentado", "Bogotá", "seguridad en campaña"],
    time_ago: "1w",

    // Resumen largo (card)
    analysis_summary:
      "El fallecimiento del senador Miguel Uribe Turbay, herido en el ataque del 7 de junio en Bogotá y confirmado tras semanas en UCI, reconfiguró la agenda política y elevó el escrutinio sobre la seguridad en campaña. La investigación pasó de tentativa a homicidio agravado e incluye capturas, hipótesis de autoría intelectual y revisión de protocolos para eventos proselitistas. El caso reaviva debates sobre coordinación interinstitucional (Fiscalía–Policía–autoridades locales), capacidad de anticipación de riesgos, y el papel del discurso público en la escalada de amenazas, con efectos sobre la movilización electoral y la confianza ciudadana.",

    neutrality_score: 74,
    ideological_distribution: { left: 30, center: 45, right: 25 },

    // Perspectivas “flat” (sin título)
    perspective_left_summary:
      "El caso evidencia fallas persistentes en la protección a líderes sociales y políticos. Se requieren reformas con enfoque de derechos, inversión sostenida en prevención, y fortalecimiento de la justicia para desmontar estructuras de violencia política.",
    perspective_left_keywords: ["protección a líderes", "violencia política", "enfoque de derechos", "prevención"],
    perspective_center_summary:
      "El homicidio endurece el debate sobre seguridad electoral. La investigación avanza con capturas y líneas sobre posible autoría intelectual. Se impone revisar esquemas de protección, protocolos de eventos y coordinación entre Fiscalía, Policía y autoridades territoriales.",
    perspective_center_keywords: ["seguridad electoral", "coordinación", "protocolos", "esquemas de protección"],
    perspective_right_summary:
      "La respuesta estatal debe ser contundente. Se requieren penas ejemplares, inteligencia ofensiva y refuerzo de esquemas para candidatos con riesgo, a fin de preservar el proceso democrático frente a estructuras criminales.",
    perspective_right_keywords: ["mano dura", "inteligencia", "esquemas de seguridad", "estado de derecho"],

    // Objeto de compatibilidad para la UI
    perspectives: {
      left: {
        title: "Perspectiva Progresista",
        summary:
          "El caso evidencia fallas persistentes en la protección a líderes sociales y políticos. Se requieren reformas con enfoque de derechos, inversión sostenida en prevención, y fortalecimiento de la justicia para desmontar estructuras de violencia política.",
        keywords: ["protección a líderes", "violencia política", "enfoque de derechos", "prevención"]
      },
      center: {
        title: "Perspectiva Neutral",
        summary:
          "El homicidio endurece el debate sobre seguridad electoral. La investigación avanza con capturas y líneas sobre posible autoría intelectual. Se impone revisar esquemas de protección, protocolos de eventos y coordinación entre Fiscalía, Policía y autoridades territoriales.",
        keywords: ["seguridad electoral", "coordinación", "protocolos", "esquemas de protección"]
      },
      right: {
        title: "Perspectiva Conservadora",
        summary:
          "La respuesta estatal debe ser contundente. Se requieren penas ejemplares, inteligencia ofensiva y refuerzo de esquemas para candidatos con riesgo, a fin de preservar el proceso democrático frente a estructuras criminales.",
        keywords: ["mano dura", "inteligencia", "esquemas de seguridad", "estado de derecho"]
      }
    },

    sources: [
      { name: "El Tiempo", url: "https://eltiempo.com", category: "center", rating: 8.6 },
      { name: "El Espectador", url: "https://elespectador.com", category: "left", rating: 7.9 },
      { name: "Semana", url: "https://semana.com", category: "right", rating: 7.6 },
      { name: "W Radio", url: "https://wradio.com.co", category: "center", rating: 7.8 },
      { name: "Vanguardia", url: "https://vanguardia.com", category: "center", rating: 7.3 },
      { name: "Observatorio de Medios LATAM (simulado)", url: "https://observatoriomedios.latam/sesgo", category: "center", rating: 6.9 },
      { name: "Plataforma Cívica por la Paz (simulado)", url: "https://plataformapaz.lat/sintesis", category: "left", rating: 6.5 }
    ],

    transparency: {
      sourcesProcessed: 32,
      analysisTime: 220,
      sourceBreakdown: { newsOutlets: 23, academic: 2, government: 2, other: 5 }
    },

    slug: "fallece-miguel-uribe-turbay-tras-atentado",
    is_active: true
  },

  // ===== COLOMBIA 2 =====
  {
    title: "Juicio de Álvaro Uribe: veredicto y libertades durante apelación",
    category: "Política",
    country: "Colombia",
    period: "24h",
    trend: "+245%",
    source_count: 38,
    unique_sources: 26,
    keywords: ["Álvaro Uribe", "manipulación de testigos", "soborno", "apelación", "libertad inmediata"],
    time_ago: "4d",

    analysis_summary:
      "Tras el fallo condenatorio en primera instancia por soborno y manipulación de testigos, el proceso ingresó a una fase de apelación que mantiene alta sensibilidad política y jurídica. El Tribunal dispuso la libertad del exmandatario mientras se resuelve el recurso, bajo el entendido de que no afecta la continuidad ni la validez del proceso. En esta etapa, la discusión gira en torno al control de legalidad del fallo, la valoración probatoria y los estándares de imparcialidad. El desenlace dependerá de los tiempos de la judicatura, la consistencia argumentativa en segunda instancia y el manejo institucional del caso para evitar erosión de confianza en la justicia.",

    neutrality_score: 71,
    ideological_distribution: { left: 40, center: 34, right: 26 },

    perspective_left_summary:
      "La condena reafirma la posibilidad de exigir cuentas a figuras de alto poder y envía un mensaje contra la impunidad. Es crucial sostener independencia judicial y protección a testigos.",
    perspective_left_keywords: ["rendición de cuentas", "independencia judicial", "testigos", "debido proceso"],
    perspective_center_summary:
      "La apelación examinará legalidad y valoración probatoria del fallo. La libertad durante el trámite no implica absolución ni revoca la sentencia; la solvencia de la segunda instancia será determinante para la legitimidad del resultado.",
    perspective_center_keywords: ["segunda instancia", "control de legalidad", "valoración probatoria", "legitimidad"],
    perspective_right_summary:
      "Sectores afines piden garantías reforzadas de imparcialidad y respeto a la presunción de inocencia, con especial cuidado frente a filtraciones mediáticas y prejuzgamientos que puedan sesgar el proceso.",
    perspective_right_keywords: ["presunción de inocencia", "imparcialidad", "debido proceso", "medios"],

    perspectives: {
      left: {
        title: "Perspectiva Progresista",
        summary:
          "La condena reafirma la posibilidad de exigir cuentas a figuras de alto poder y envía un mensaje contra la impunidad. Es crucial sostener independencia judicial y protección a testigos.",
        keywords: ["rendición de cuentas", "independencia judicial", "testigos", "debido proceso"]
      },
      center: {
        title: "Perspectiva Neutral",
        summary:
          "La apelación examinará legalidad y valoración probatoria del fallo. La libertad durante el trámite no implica absolución ni revoca la sentencia; la solvencia de la segunda instancia será determinante para la legitimidad del resultado.",
        keywords: ["segunda instancia", "control de legalidad", "valoración probatoria", "legitimidad"]
      },
      right: {
        title: "Perspectiva Conservadora",
        summary:
          "Sectores afines piden garantías reforzadas de imparcialidad y respeto a la presunción de inocencia, con especial cuidado frente a filtraciones mediáticas y prejuzgamientos que puedan sesgar el proceso.",
        keywords: ["presunción de inocencia", "imparcialidad", "debido proceso", "medios"]
      }
    },

    sources: [
      { name: "El País América", url: "https://elpais.com/america-colombia", category: "center", rating: 8.8 },
      { name: "El Tiempo", url: "https://eltiempo.com", category: "center", rating: 8.3 },
      { name: "La Silla Vacía", url: "https://lasillavacia.com", category: "center", rating: 7.9 },
      { name: "Semana", url: "https://semana.com", category: "right", rating: 7.4 },
      { name: "RCN Radio", url: "https://rcnradio.com", category: "center", rating: 7.5 },
      { name: "Centro de Estudios Judiciales (simulado)", url: "https://cej.lat/analitica", category: "center", rating: 6.7 },
      { name: "Colectivo Garantías y Derechos (simulado)", url: "https://garantiasyderechos.lat/dossier", category: "left", rating: 6.5 }
    ],

    transparency: {
      sourcesProcessed: 38,
      analysisTime: 250,
      sourceBreakdown: { newsOutlets: 26, academic: 3, government: 1, other: 8 }
    },

    slug: "juicio-alvaro-uribe-veredicto-y-apelacion",
    is_active: true
  },

  // ===== ARGENTINA 1 =====
  {
    title: "Milei sostiene veto al aumento extraordinario de pensiones",
    category: "Política",
    country: "Argentina",
    period: "24h",
    trend: "+190%",
    source_count: 26,
    unique_sources: 18,
    keywords: ["Milei", "veto", "pensiones", "Congreso", "jubilaciones"],
    time_ago: "3d",

    analysis_summary:
      "La Cámara de Diputados convalidó el veto presidencial al aumento extraordinario de jubilaciones, consolidando la estrategia del Ejecutivo de preservar el ancla fiscal en un contexto de desinflación aún frágil. Los defensores del veto sostienen que una expansión discrecional del gasto comprometería metas fiscales y expectativas; críticos alegan que la medida profundiza la pérdida de poder adquisitivo de los jubilados. El episodio revela la tensión entre disciplina presupuestaria y protección social, y anticipa nuevas negociaciones sobre movilidad, segmentación de apoyos y sostenibilidad política de las reformas.",

    neutrality_score: 76,
    ideological_distribution: { left: 38, center: 44, right: 18 },

    perspective_left_summary:
      "El veto prioriza el ajuste por sobre la protección del ingreso de los jubilados. Se requieren mecanismos de recomposición focalizados y una fórmula de movilidad que cubra la canasta real.",
    perspective_left_keywords: ["poder adquisitivo", "movilidad jubilatoria", "protección social", "canasta básica"],
    perspective_center_summary:
      "El oficialismo argumenta que un aumento extraordinario desanclaría el programa fiscal. La discusión se centra en consistencia macro, costos de transición y viabilidad política de cambios graduales en movilidad y subsidios.",
    perspective_center_keywords: ["ancla fiscal", "transición", "viabilidad política", "movilidad"],
    perspective_right_summary:
      "Sostener la disciplina fiscal es condición para estabilizar la macro, bajar riesgo país y recuperar crédito. Cualquier alivio debe estar financiado y orientado a segmentos críticos.",
    perspective_right_keywords: ["disciplina fiscal", "estabilización", "riesgo país", "financiamiento"],

    perspectives: {
      left: {
        title: "Perspectiva Progresista",
        summary:
          "El veto prioriza el ajuste por sobre la protección del ingreso de los jubilados. Se requieren mecanismos de recomposición focalizados y una fórmula de movilidad que cubra la canasta real.",
        keywords: ["poder adquisitivo", "movilidad jubilatoria", "protección social", "canasta básica"]
      },
      center: {
        title: "Perspectiva Neutral",
        summary:
          "El oficialismo argumenta que un aumento extraordinario desanclaría el programa fiscal. La discusión se centra en consistencia macro, costos de transición y viabilidad política de cambios graduales en movilidad y subsidios.",
        keywords: ["ancla fiscal", "transición", "viabilidad política", "movilidad"]
      },
      right: {
        title: "Perspectiva Conservadora",
        summary:
          "Sostener la disciplina fiscal es condición para estabilizar la macro, bajar riesgo país y recuperar crédito. Cualquier alivio debe estar financiado y orientado a segmentos críticos.",
        keywords: ["disciplina fiscal", "estabilización", "riesgo país", "financiamiento"]
      }
    },

    sources: [
      { name: "RTVE", url: "https://www.rtve.es/noticias", category: "center", rating: 8.4 },
      { name: "La Nación", url: "https://lanacion.com.ar", category: "center", rating: 8.1 },
      { name: "Clarín", url: "https://clarin.com", category: "center", rating: 8.0 },
      { name: "Página/12", url: "https://pagina12.com.ar", category: "left", rating: 7.8 },
      { name: "TN", url: "https://tn.com.ar", category: "center", rating: 7.3 },
      { name: "Instituto Fiscal Argentino (simulado)", url: "https://ifa.ar/nota", category: "right", rating: 6.9 }
    ],

    transparency: {
      sourcesProcessed: 26,
      analysisTime: 180,
      sourceBreakdown: { newsOutlets: 18, academic: 2, government: 2, other: 4 }
    },

    slug: "milei-veto-aumento-emergencia-pensiones",
    is_active: true
  },

  // ===== ARGENTINA 2 (FÚTBOL) =====
  {
    title: "Selección Argentina agenda amistosos internacionales para noviembre",
    category: "Deportes",
    country: "Argentina",
    period: "24h",
    trend: "+115%",
    source_count: 18,
    unique_sources: 13,
    keywords: ["Selección Argentina", "amistosos", "Messi", "AFA", "fechas FIFA"],
    time_ago: "today",

    analysis_summary:
      "La AFA trabaja en una ventana de amistosos internacionales para noviembre como parte de la preparación hacia las competiciones de 2026. Los reportes señalan negociaciones por sedes y rivales con promotoras y federaciones, en un calendario que también incorpora Eliminatorias. Con Messi disponible, la expectativa de demanda de taquilla y audiencias televisivas es elevada. La priorización del cuerpo técnico equilibra criterios deportivos (nivel de oposición, viajes, descanso) y objetivos comerciales, con impacto en la rotación y oportunidades para jugadores emergentes.",

    neutrality_score: 84,
    ideological_distribution: { left: 20, center: 60, right: 20 },

    perspective_left_summary:
      "La gira favorece la integración cultural y el acceso al deporte como bien social; debe contemplar iniciativas de base y transparencia en la relación con promotoras.",
    perspective_left_keywords: ["integración", "acceso", "transparencia", "deporte base"],
    perspective_center_summary:
      "Las confirmaciones dependen de contratos, logística y ventanas FIFA. Con cartel estelar, se proyectan altos ingresos y exposición global; el cuerpo técnico ajustará cargas de viaje y competencia.",
    perspective_center_keywords: ["logística", "ventanas FIFA", "ingresos", "exposición"],
    perspective_right_summary:
      "Los amistosos deben maximizar ingresos y mantener competitividad frente a selecciones exigentes; la marca Argentina y la presencia de Messi permiten optimizar la negociación.",
    perspective_right_keywords: ["competitividad", "marca", "negociación", "ingresos"],

    perspectives: {
      left: {
        title: "Perspectiva Progresista",
        summary:
          "La gira favorece la integración cultural y el acceso al deporte como bien social; debe contemplar iniciativas de base y transparencia en la relación con promotoras.",
        keywords: ["integración", "acceso", "transparencia", "deporte base"]
      },
      center: {
        title: "Perspectiva Neutral",
        summary:
          "Las confirmaciones dependen de contratos, logística y ventanas FIFA. Con cartel estelar, se proyectan altos ingresos y exposición global; el cuerpo técnico ajustará cargas de viaje y competencia.",
        keywords: ["logística", "ventanas FIFA", "ingresos", "exposición"]
      },
      right: {
        title: "Perspectiva Conservadora",
        summary:
          "Los amistosos deben maximizar ingresos y mantener competitividad frente a selecciones exigentes; la marca Argentina y la presencia de Messi permiten optimizar la negociación.",
        keywords: ["competitividad", "marca", "negociación", "ingresos"]
      }
    },

    sources: [
      { name: "TyC Sports", url: "https://www.tycsports.com", category: "center", rating: 7.9 },
      { name: "Olé", url: "https://www.ole.com.ar", category: "center", rating: 7.6 },
      { name: "La Nación - Deportes", url: "https://lanacion.com.ar/deportes", category: "center", rating: 8.0 },
      { name: "ESPN", url: "https://www.espn.com", category: "center", rating: 8.2 },
      { name: "The Times of India", url: "https://timesofindia.indiatimes.com", category: "center", rating: 7.8 },
      { name: "Observatorio Económico del Deporte (simulado)", url: "https://oed.lat/analisis", category: "center", rating: 6.7 }
    ],

    transparency: {
      sourcesProcessed: 18,
      analysisTime: 130,
      sourceBreakdown: { newsOutlets: 13, academic: 1, government: 0, other: 4 }
    },

    slug: "seleccion-argentina-amistosos-noviembre-2025",
    is_active: true
  },

  // ===== MÉXICO 1 (STARTUPS) =====
  {
    title: "Ecosistema startup en México acelera en 2025 (fintech y logística B2B)",
    category: "Tecnología",
    country: "México",
    period: "24h",
    trend: "+128%",
    source_count: 24,
    unique_sources: 17,
    keywords: ["startups México", "fintech", "rondas", "B2B", "innovación"],
    time_ago: "1w",

    analysis_summary:
      "Pese a un entorno de capital selectivo, el ecosistema emprendedor mexicano muestra resiliencia en verticales B2B con foco en unit economics. Fintech de pagos, conciliación y crédito a pymes, junto a logística y supply-chain, destacan por propuestas con retorno claro y eficiencia operativa. Las rondas favorecen compañías con crecimiento disciplinado, monetización validada y reducción de riesgo operacional. La agenda regulatoria y la madurez de talento técnico sostienen el dinamismo, con expansión regional hacia Centroamérica y el cono sur a través de partnerships y canales enterprise.",

    neutrality_score: 79,
    ideological_distribution: { left: 22, center: 58, right: 20 },

    perspective_left_summary:
      "El auge debe traducirse en empleos formales, bancarización de pymes y cierre de brechas de acceso al crédito en regiones periféricas.",
    perspective_left_keywords: ["empleo", "inclusión financiera", "pymes", "brechas regionales"],
    perspective_center_summary:
      "Mapeos 2025 muestran resiliencia en fintech B2B y logística con foco en eficiencia, gobernanza y ROI verificable. La expansión prioriza venta enterprise y alianzas con incumbentes.",
    perspective_center_keywords: ["resiliencia", "gobernanza", "ROI", "alianzas"],
    perspective_right_summary:
      "Un marco pro-mercado y simplificación regulatoria incentivan inversión, competencia e innovación; la disciplina de costos fortalece la ruta a rentabilidad.",
    perspective_right_keywords: ["pro-mercado", "competencia", "inversión", "rentabilidad"],

    perspectives: {
      left: {
        title: "Perspectiva Progresista",
        summary:
          "El auge debe traducirse en empleos formales, bancarización de pymes y cierre de brechas de acceso al crédito en regiones periféricas.",
        keywords: ["empleo", "inclusión financiera", "pymes", "brechas regionales"]
      },
      center: {
        title: "Perspectiva Neutral",
        summary:
          "Mapeos 2025 muestran resiliencia en fintech B2B y logística con foco en eficiencia, gobernanza y ROI verificable. La expansión prioriza venta enterprise y alianzas con incumbentes.",
        keywords: ["resiliencia", "gobernanza", "ROI", "alianzas"]
      },
      right: {
        title: "Perspectiva Conservadora",
        summary:
          "Un marco pro-mercado y simplificación regulatoria incentivan inversión, competencia e innovación; la disciplina de costos fortalece la ruta a rentabilidad.",
        keywords: ["pro-mercado", "competencia", "inversión", "rentabilidad"]
      }
    },

    sources: [
      { name: "Forbes México", url: "https://forbes.com.mx", category: "center", rating: 8.1 },
      { name: "El Economista", url: "https://eleconomista.com.mx", category: "center", rating: 8.0 },
      { name: "Expansión", url: "https://expansion.mx", category: "center", rating: 7.9 },
      { name: "TechCrunch en Español", url: "https://techcrunch.com/tag/latin-america", category: "center", rating: 7.8 },
      { name: "Entorno VC", url: "https://entorno.vc", category: "center", rating: 7.6 },
      { name: "Centro de Emprendimiento UNAM (simulado)", url: "https://ce-unam.mx/reportes", category: "left", rating: 6.8 }
    ],

    transparency: {
      sourcesProcessed: 24,
      analysisTime: 150,
      sourceBreakdown: { newsOutlets: 17, academic: 2, government: 0, other: 5 }
    },

    slug: "ecosistema-startup-mexico-2025-fintech-logistica",
    is_active: true
  },

  // ===== MÉXICO 2 (FINANZAS) =====
  {
    title: "Banxico recorta la tasa a 7.75% y mantiene sesgo dependiente de datos",
    category: "Finanzas",
    country: "México",
    period: "24h",
    trend: "+142%",
    source_count: 28,
    unique_sources: 20,
    keywords: ["Banxico", "tasa de interés", "recorte", "política monetaria", "inflación"],
    time_ago: "2w",

    analysis_summary:
      "La Junta de Gobierno recortó 25 pb la tasa de referencia a 7.75% y reiteró un enfoque gradual dependiente de datos. La señal apunta a evaluar desinflación del componente subyacente, holguras de la economía y posibles traspasos cambiarios antes de nuevos ajustes. Los agentes leen un balance entre credibilidad antiinflacionaria y soporte a la actividad. El calendario de datos (inflación, expectativas y actividad) será clave para calibrar próximos pasos, en un contexto externo de volatilidad acotada y condiciones financieras internacionales que aún lucen restrictivas.",

    neutrality_score: 83,
    ideological_distribution: { left: 18, center: 64, right: 18 },

    perspective_left_summary:
      "El alivio monetario debe ir acompañado de políticas que protejan el ingreso real de los hogares y mitiguen choques de precios en canastas básicas.",
    perspective_left_keywords: ["ingreso real", "canasta básica", "mitigación de choques", "protección social"],
    perspective_center_summary:
      "La decisión de -25 pb mantiene puertas abiertas a recortes graduales, condicionados a la trayectoria del núcleo y expectativas ancladas. Se monitorean holguras, tipo de cambio y transmisión crediticia.",
    perspective_center_keywords: ["gradualismo", "núcleo inflacionario", "expectativas", "transmisión"],
    perspective_right_summary:
      "La prudencia es esencial para preservar el anclaje de expectativas y la credibilidad del banco central; cualquier aceleración de recortes debe esperar evidencia clara de desinflación sostenida.",
    perspective_right_keywords: ["credibilidad", "anclaje", "prudencia", "desinflación"],

    perspectives: {
      left: {
        title: "Perspectiva Progresista",
        summary:
          "El alivio monetario debe ir acompañado de políticas que protejan el ingreso real de los hogares y mitiguen choques de precios en canastas básicas.",
        keywords: ["ingreso real", "canasta básica", "mitigación de choques", "protección social"]
      },
      center: {
        title: "Perspectiva Neutral",
        summary:
          "La decisión de -25 pb mantiene puertas abiertas a recortes graduales, condicionados a la trayectoria del núcleo y expectativas ancladas. Se monitorean holguras, tipo de cambio y transmisión crediticia.",
        keywords: ["gradualismo", "núcleo inflacionario", "expectativas", "transmisión"]
      },
      right: {
        title: "Perspectiva Conservadora",
        summary:
          "La prudencia es esencial para preservar el anclaje de expectativas y la credibilidad del banco central; cualquier aceleración de recortes debe esperar evidencia clara de desinflación sostenida.",
        keywords: ["credibilidad", "anclaje", "prudencia", "desinflación"]
      }
    },

    sources: [
      { name: "Banxico (comunicado)", url: "https://www.banxico.org.mx", category: "center", rating: 9.5 },
      { name: "El Financiero", url: "https://elfinanciero.com.mx", category: "center", rating: 8.3 },
      { name: "El Economista", url: "https://eleconomista.com.mx", category: "center", rating: 8.1 },
      { name: "Reuters", url: "https://reuters.com", category: "center", rating: 9.0 },
      { name: "Bloomberg Línea", url: "https://www.bloomberglinea.com", category: "center", rating: 8.4 },
      { name: "Observatorio de Inflación MX (simulado)", url: "https://inflacionmx.org/nota", category: "center", rating: 6.9 }
    ],

    transparency: {
      sourcesProcessed: 28,
      analysisTime: 160,
      sourceBreakdown: { newsOutlets: 20, academic: 1, government: 3, other: 4 }
    },

    slug: "banxico-recorta-tasa-7-75-agosto-2025",
    is_active: true
  }
];

async function populateTrendingTopics() {
  try {
    console.log('🚀 Iniciando población de trending topics...');
    console.log('📋 Verificando estructura de la base de datos...');

    console.log('📝 Insertando trending topics...');
    for (const topicData of trendingTopicsData) {
      try {
        // Upsert por slug
        const { data, error } = await supabase
          .from('trending_topics')
          .upsert(topicData, { onConflict: 'slug' })
          .select()
          .single();

        if (error) {
          console.error(`❌ Error insertando "${topicData.title}":`, error.message);
          continue;
        }

        console.log(`✅ Insertado: ${topicData.title}`);

        // Insertar fuentes relacionadas SIN onConflict
        if (topicData.sources?.length) {
          const sourcesToInsert = topicData.sources.map((source) => ({
            trending_topic_id: data.id,
            title: source.name,
            url: source.url,
            bias_category: source.category, // left | center | right
            credibility_score: source.rating
          }));

          const { error: sourcesError } = await supabase
            .from('trending_sources')
            .insert(sourcesToInsert);

          if (sourcesError) {
            console.error(`⚠️ Error insertando fuentes para "${topicData.title}": ${sourcesError.message}`);
          } else {
            console.log(`   📚 Fuentes insertadas: ${topicData.sources.length}`);
          }
        }
      } catch (err) {
        console.error(`❌ Error procesando "${topicData.title}":`, err.message || err);
      }
    }

    console.log('🎉 Población de trending topics completada!');
    console.log(`📊 Total de topics procesados: ${trendingTopicsData.length}`);
  } catch (error) {
    console.error('💥 Error general:', error.message);
  }
}

// Ejecutar el script
populateTrendingTopics();
