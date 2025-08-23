#!/usr/bin/env python3
"""
Startup script for the RoBERTa Bias Classification Service (HuggingFace Production)
"""

import asyncio
import uvicorn
import logging
import sys
from pathlib import Path

# Add current directory to path
sys.path.append(str(Path(__file__).parent))

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def main():
    """Start the FastAPI server"""
    logger.info("Starting RoBERTa Bias Classification Service (HuggingFace Production Version)...")
    logger.info("Model will be downloaded from HuggingFace Hub: samuelra/Roberta_biass_classifier")
    
    # Start the server
    uvicorn.run(
        "api:app",
        host="127.0.0.1",
        port=8001,
        reload=False,  # Disable reload for production
        log_level="info",
        access_log=True
    )

if __name__ == "__main__":
    main()
