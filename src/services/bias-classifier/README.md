# RoBERTa Political Bias Classification Service (HuggingFace Production)

Este servicio proporciona clasificación de sesgo político usando un modelo RoBERTa pre-entrenado desde HuggingFace Hub.

## Características

- **Integración HuggingFace**: Usa el modelo de producción `samuelra/Roberta_biass_classifier` desde HuggingFace Hub
- **Sin configuración local**: No necesita archivos de modelo locales - descarga automáticamente desde HuggingFace
- **Clasificación async**: Construido con FastAPI para procesamiento async eficiente
- **Procesamiento por lotes**: Soporte para procesar múltiples textos simultáneamente
- **Soporte GPU**: Detecta y usa CUDA automáticamente si está disponible
- **API REST**: Endpoints REST limpios para fácil integración
- **Monitoreo de salud**: Endpoints de health check para monitorear el estado del modelo

## Instalación

1. Instalar dependencias de Python:
```bash
cd src/services/bias-classifier
pip install -r requirements.txt
```

2. No se necesitan archivos de modelo locales - el servicio descargará automáticamente el modelo desde HuggingFace Hub en la primera ejecución.

## Uso

### Iniciar el servicio
```bash
python start_service.py
```

El servicio correrá en `http://127.0.0.1:8001` y descargará automáticamente el modelo desde HuggingFace Hub.

### Endpoints disponibles

- `GET /health` - Check de salud del servicio
- `POST /classify` - Clasificar un texto individual
- `POST /classify/batch` - Clasificar múltiples textos
- `GET /docs` - Documentación interactiva

### Ejemplo de uso

```bash
# Clasificar un texto
curl -X POST "http://127.0.0.1:8001/classify" \
  -H "Content-Type: application/json" \
  -d '{"text": "El gobierno debería aumentar los programas de gasto social."}'

# Respuesta:
{
  "category": "left",
  "confidence": 0.85,
  "probabilities": {
    "left": 0.85,
    "center": 0.12,
    "right": 0.03
  },
  "processing_time": 0.05
}
```

## Información del Modelo

- **Modelo**: `samuelra/Roberta_biass_classifier` desde HuggingFace Hub
- **Arquitectura**: Clasificación de secuencias basada en RoBERTa
- **Clases**: 3 (sesgo político izquierda, centro, derecha)
- **Idioma**: Español
- **Tokenizer**: Tokenizer base de RoBERTa

## Arquitectura

- **bert_classifier.py**: Implementación del modelo RoBERTa y servicio de clasificación usando HuggingFace
- **api.py**: Servidor FastAPI con endpoints REST
- **start_service.py**: Script de inicio del servicio

## Performance

- Clasificación de texto individual: ~0.1-0.2 segundos
- Procesamiento por lotes: Significativamente más rápido para múltiples textos
- Aceleración GPU soportada
- La primera ejecución puede tomar más tiempo debido a la descarga del modelo

## Migración desde Modelo Local

Esta versión reemplaza la implementación previa del modelo local con un enfoque basado en HuggingFace Hub para despliegue en producción. La API permanece igual, pero la carga del modelo ahora se maneja automáticamente a través de HuggingFace transformers.

## Configuración

El servicio puede configurarse a través de:
- Selección de dispositivo (CPU/CUDA)
- Nombre del modelo de HuggingFace (por defecto: `samuelra/Roberta_biass_classifier`)
- Host y puerto del servidor
- Longitud máxima de secuencia

## Manejo de Errores

El servicio incluye manejo comprehensivo de errores para:
- Fallas en la descarga del modelo
- Texto de entrada inválido
- Errores de procesamiento
- Problemas de inicio del servidor
