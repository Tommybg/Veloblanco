# Configuración de Trending Topics con Análisis Pre-escritos

## 🎯 Objetivo
Implementar trending topics que al hacer click muestren un `ResultsDashboard` completo con análisis pre-escritos guardados en Supabase, sin necesidad de hacer deep research en tiempo real.

## 📋 Pasos de Implementación

### 1. Crear las Tablas en Supabase

Ejecuta el siguiente SQL en tu dashboard de Supabase:

```sql
-- Tabla para trending topics con análisis pre-escritos
CREATE TABLE trending_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  country TEXT NOT NULL,
  period TEXT NOT NULL DEFAULT '24h',
  trend TEXT NOT NULL,
  source_count INTEGER NOT NULL DEFAULT 0,
  unique_sources INTEGER NOT NULL DEFAULT 0,
  keywords TEXT[] NOT NULL DEFAULT '{}',
  time_ago TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Campos para el análisis pre-escrito
  analysis_summary TEXT NOT NULL,
  neutrality_score INTEGER NOT NULL CHECK (neutrality_score >= 0 AND neutrality_score <= 100),
  ideological_distribution JSONB NOT NULL DEFAULT '{"left": 0, "center": 0, "right": 0}',
  perspectives JSONB NOT NULL DEFAULT '{}',
  sources JSONB NOT NULL DEFAULT '[]',
  transparency JSONB NOT NULL DEFAULT '{}',
  
  -- Metadatos adicionales
  slug TEXT UNIQUE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Tabla para fuentes de los trending topics
CREATE TABLE trending_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trending_topic_id UUID REFERENCES trending_topics(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  bias_category TEXT CHECK (bias_category IN ('left', 'center', 'right')),
  credibility_score NUMERIC(3,1) CHECK (credibility_score >= 0 AND credibility_score <= 10),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_trending_topics_period ON trending_topics(period, created_at DESC);
CREATE INDEX idx_trending_topics_category ON trending_topics(category);
CREATE INDEX idx_trending_topics_country ON trending_topics(country);
CREATE INDEX idx_trending_topics_slug ON trending_topics(slug);
```

### 2. Configurar Variables de Entorno

Asegúrate de tener en tu archivo `.env`:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

### 3. Poblar la Base de Datos

Ejecuta el script de población:

```bash
node scripts/populate-trending-topics.js
```

Este script insertará 6 trending topics de ejemplo con análisis completos:

1. **Reforma fiscal en Colombia** - Política
2. **Elecciones en Argentina** - Política  
3. **Acuerdo comercial México-Brasil** - Economía
4. **Crisis energética en Venezuela** - Sociedad
5. **Tecnológicas chilenas** - Tecnología
6. **Protestas estudiantiles en Perú** - Sociedad

### 4. Verificar la Implementación

1. Ve a `/trending` en tu aplicación
2. Deberías ver los 6 trending topics cargados desde Supabase
3. Haz click en cualquier trending topic
4. Deberías navegar a `/trending-result/[slug]`
5. Verás el `ResultsDashboard` completo con el análisis pre-escrito

## 🔧 Archivos Modificados/Creados

### Nuevos Archivos:
- `src/pages/TrendingResult.tsx` - Página que muestra el Results Dashboard
- `scripts/populate-trending-topics.js` - Script para poblar la base de datos

### Archivos Modificados:
- `src/services/supabase.ts` - Nuevas interfaces y funciones
- `src/components/trending/TrendCard.tsx` - Agregada navegación
- `src/components/trending/TrendingGrid.tsx` - Consume datos reales de Supabase
- `src/App.tsx` - Nueva ruta agregada

## 🎨 Estructura de Datos

Cada trending topic incluye:

- **Información básica**: título, categoría, país, período
- **Métricas**: tendencia, número de fuentes, neutralidad
- **Análisis completo**: resumen, distribución ideológica, perspectivas
- **Fuentes**: con clasificación de sesgo y rating de credibilidad
- **Transparencia**: metadatos del análisis

## 🚀 Flujo de Usuario

1. Usuario ve trending topics en `/trending`
2. Hace click en un trending topic
3. Navega a `/trending-result/[slug]`
4. Ve el `ResultsDashboard` completo con análisis pre-escrito
5. **No hay deep research en tiempo real** - todo viene de Supabase

## 🔍 Troubleshooting

### Error: "No se encontró el trending topic"
- Verifica que las tablas existan en Supabase
- Ejecuta el script de población
- Revisa los logs de la consola

### Error: "Error al cargar trending topics"
- Verifica las variables de entorno de Supabase
- Revisa la conectividad a la base de datos
- Verifica que las tablas tengan datos

### Los trending topics no se muestran
- Verifica que `is_active = true` en la base de datos
- Revisa los filtros de categoría y país
- Verifica que el período coincida con los datos

## 📊 Personalización

Para agregar más trending topics:

1. Modifica el array `trendingTopicsData` en el script
2. Ejecuta el script nuevamente
3. Los nuevos topics se insertarán automáticamente

Para modificar el análisis existente:

1. Actualiza directamente en la base de datos
2. O modifica el script y ejecuta `upsert` para actualizar

## 🎉 Resultado Final

Al completar esta implementación tendrás:

✅ Trending topics con análisis completos y detallados  
✅ Navegación fluida entre trending topics y resultados  
✅ Misma experiencia de usuario que el ResultsDashboard  
✅ Contenido pre-generado y almacenado en Supabase  
✅ Sin necesidad de deep research en tiempo real  
✅ Base de datos escalable para futuros trending topics  

¡Tu aplicación ahora tiene trending topics completamente funcionales con análisis pre-escritos!
