"""
FastAPI server for RoBERTa Political Bias Classification Service
Provides REST endpoints for async bias classification using HuggingFace model
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
import asyncio
import logging
import uvicorn
from contextlib import asynccontextmanager

from bert_classifier import get_bias_service, initialize_service

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Pydantic models for request/response
class ClassificationRequest(BaseModel):
    text: str = Field(..., description="Text to classify for political bias")
    max_length: Optional[int] = Field(512, description="Maximum token length")

class BatchClassificationRequest(BaseModel):
    texts: List[str] = Field(..., description="List of texts to classify")
    max_length: Optional[int] = Field(512, description="Maximum token length")

class ClassificationResponse(BaseModel):
    category: str = Field(..., description="Predicted bias category: left, center, or right")
    confidence: float = Field(..., description="Confidence score (0-1)")
    probabilities: dict = Field(..., description="Probability distribution for all categories")
    processing_time: float = Field(..., description="Processing time in seconds")

class BatchClassificationResponse(BaseModel):
    results: List[dict] = Field(..., description="List of classification results")
    total_processing_time: float = Field(..., description="Total batch processing time")

class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    device: str

# Lifespan management
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting RoBERTa Bias Classification Service...")
    try:
        await initialize_service()
        logger.info("Service initialized successfully!")
        yield
    except Exception as e:
        logger.error(f"Failed to initialize service: {str(e)}")
        raise
    # Shutdown
    logger.info("Shutting down RoBERTa Bias Classification Service...")

# Create FastAPI app
app = FastAPI(
    title="RoBERTa Political Bias Classification API",
    description="Async API for classifying political bias in text using a pre-trained RoBERTa model from HuggingFace Hub (samuelra/Roberta_biass_classifier)",
    version="2.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    service = get_bias_service()
    return HealthResponse(
        status="healthy" if service.is_loaded else "loading",
        model_loaded=service.is_loaded,
        device=service.device
    )

@app.post("/classify", response_model=ClassificationResponse)
async def classify_text(request: ClassificationRequest):
    """
    Classify political bias of a single text
    
    Args:
        request: Classification request with text and optional parameters
        
    Returns:
        Classification result with category, confidence, and probabilities
    """
    try:
        service = get_bias_service()
        
        if not service.is_loaded:
            raise HTTPException(status_code=503, detail="Model not loaded yet")
        
        result = await service.classify_text(
            text=request.text,
            max_length=request.max_length
        )
        
        return ClassificationResponse(**result)
        
    except Exception as e:
        logger.error(f"Error in classify_text: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/classify/batch", response_model=BatchClassificationResponse)
async def classify_batch(request: BatchClassificationRequest):
    """
    Classify political bias of multiple texts in batch
    
    Args:
        request: Batch classification request with texts and optional parameters
        
    Returns:
        List of classification results
    """
    try:
        service = get_bias_service()
        
        if not service.is_loaded:
            raise HTTPException(status_code=503, detail="Model not loaded yet")
        
        if len(request.texts) > 100:  # Limit batch size
            raise HTTPException(status_code=400, detail="Batch size too large (max 100)")
        
        results = await service.classify_batch(
            texts=request.texts,
            max_length=request.max_length
        )
        
        # Extract total processing time from last result
        total_time = results[-1].get('batch_processing_time', 0) if results else 0
        
        return BatchClassificationResponse(
            results=results,
            total_processing_time=total_time
        )
        
    except Exception as e:
        logger.error(f"Error in classify_batch: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "RoBERTa Political Bias Classification API (HuggingFace Production)",
        "version": "2.0.0",
        "model": "samuelra/Roberta_biass_classifier",
        "endpoints": {
            "health": "/health",
            "classify": "/classify",
            "batch_classify": "/classify/batch",
            "docs": "/docs"
        }
    }

if __name__ == "__main__":
    uvicorn.run(
        "api:app",
        host="127.0.0.1",
        port=8001,
        reload=True,
        log_level="info"
    )
