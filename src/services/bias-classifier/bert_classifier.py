"""
RoBERTa-based Political Bias Classifier Service (HuggingFace Production Version)
Uses the pre-trained model from HuggingFace Hub for production deployment
"""

import torch
from transformers import RobertaTokenizer, RobertaForSequenceClassification
import asyncio
import logging
from typing import Dict, List, Tuple, Optional
import time
import json

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class BiasClassificationService:
    """
    Async service for political bias classification using RoBERTa from HuggingFace
    """
    
    def __init__(self, model_name: str = "samuelra/Roberta_biass_classifier", device: str = None):
        self.model_name = model_name
        self.device = device or ('cuda' if torch.cuda.is_available() else 'cpu')
        self.model = None
        self.tokenizer = None
        self.label_map = {0: 'left', 1: 'center', 2: 'right'}
        self.is_loaded = False
        
        logger.info(f"Initializing BiasClassificationService with model: {self.model_name}")
        logger.info(f"Using device: {self.device}")
    
    async def load_model(self):
        """Load the pre-trained RoBERTa model from HuggingFace Hub asynchronously"""
        try:
            logger.info(f"Loading tokenizer from roberta-base...")
            self.tokenizer = RobertaTokenizer.from_pretrained("roberta-base")
            
            logger.info(f"Loading model from {self.model_name}...")
            self.model = RobertaForSequenceClassification.from_pretrained(self.model_name)
            
            # Move model to device
            self.model.to(self.device)
            self.model.eval()
            self.is_loaded = True
            
            logger.info("Model loaded successfully from HuggingFace Hub!")
            
            # Test the model with a sample input
            await self._test_model()
            
        except Exception as e:
            logger.error(f"Error loading model from HuggingFace: {str(e)}")
            raise
    
    async def _test_model(self):
        """Test the model with a sample input"""
        try:
            test_text = "This is a test sentence for model verification."
            result = await self.classify_text(test_text)
            logger.info(f"Model test successful: {result}")
        except Exception as e:
            logger.error(f"Model test failed: {str(e)}")
            raise
    
    async def classify_text(self, text: str, max_length: int = 512) -> Dict:
        """
        Classify political bias of a text
        
        Args:
            text: Text to classify
            max_length: Maximum token length
            
        Returns:
            Dict with classification results
        """
        if not self.is_loaded:
            raise RuntimeError("Model not loaded. Call load_model() first.")
        
        start_time = time.time()
        
        try:
            # Tokenize the text
            inputs = self.tokenizer(
                text,
                return_tensors="pt",
                truncation=True,
                max_length=max_length,
                padding=True
            )
            
            # Move inputs to device
            inputs = {k: v.to(self.device) for k, v in inputs.items()}
            
            # Perform inference
            with torch.no_grad():
                outputs = self.model(**inputs)
                probabilities = torch.softmax(outputs.logits, dim=-1)
            
            # Get predictions
            probs = probabilities.cpu().numpy()[0]
            predicted_class = int(torch.argmax(probabilities, dim=1).cpu().numpy()[0])
            confidence = float(probs[predicted_class])
            
            processing_time = time.time() - start_time
            
            return {
                'category': self.label_map[predicted_class],
                'confidence': confidence,
                'probabilities': {
                    'left': float(probs[0]),
                    'center': float(probs[1]),
                    'right': float(probs[2])
                },
                'processing_time': processing_time
            }
            
        except Exception as e:
            logger.error(f"Error during classification: {str(e)}")
            raise
    
    async def classify_batch(self, texts: List[str], max_length: int = 512) -> List[Dict]:
        """
        Classify multiple texts in batch for efficiency
        
        Args:
            texts: List of texts to classify
            max_length: Maximum token length
            
        Returns:
            List of classification results
        """
        if not self.is_loaded:
            raise RuntimeError("Model not loaded. Call load_model() first.")
        
        start_time = time.time()
        
        try:
            # Tokenize all texts
            inputs = self.tokenizer(
                texts,
                return_tensors="pt",
                truncation=True,
                max_length=max_length,
                padding=True
            )
            
            # Move inputs to device
            inputs = {k: v.to(self.device) for k, v in inputs.items()}
            
            # Perform batch inference
            with torch.no_grad():
                outputs = self.model(**inputs)
                probabilities = torch.softmax(outputs.logits, dim=-1)
            
            # Process results
            results = []
            probs = probabilities.cpu().numpy()
            predicted_classes = torch.argmax(probabilities, dim=1).cpu().numpy()
            
            processing_time = time.time() - start_time
            
            for i, (text, pred_class, prob_dist) in enumerate(zip(texts, predicted_classes, probs)):
                confidence = float(prob_dist[pred_class])
                
                results.append({
                    'text': text,
                    'category': self.label_map[int(pred_class)],
                    'confidence': confidence,
                    'probabilities': {
                        'left': float(prob_dist[0]),
                        'center': float(prob_dist[1]),
                        'right': float(prob_dist[2])
                    }
                })
            
            # Add total processing time to the last result
            if results:
                results[-1]['batch_processing_time'] = processing_time
            
            return results
            
        except Exception as e:
            logger.error(f"Error during batch classification: {str(e)}")
            raise

# Global service instance
bias_service = BiasClassificationService()

async def initialize_service():
    """Initialize the bias classification service"""
    await bias_service.load_model()

def get_bias_service() -> BiasClassificationService:
    """Get the global bias service instance"""
    return bias_service
