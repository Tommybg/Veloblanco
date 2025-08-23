#!/usr/bin/env python3
"""
Test script for the new HuggingFace-based RoBERTa bias classifier
"""

import asyncio
import sys
from pathlib import Path

# Add the bias classifier module to the path
sys.path.append(str(Path("src/services/bias-classifier")))

from bert_classifier import BiasClassificationService

async def test_huggingface_model():
    """Test the new HuggingFace model implementation"""
    print("🚀 Testing HuggingFace RoBERTa Bias Classifier")
    print("=" * 50)
    
    # Initialize the service
    service = BiasClassificationService()
    
    try:
        print("📥 Loading model from HuggingFace Hub...")
        await service.load_model()
        print("✅ Model loaded successfully!")
        
        # Test texts in Spanish
        test_texts = [
            "El gobierno debe aumentar los programas sociales para ayudar a los más necesitados.",
            "La economía necesita menos regulación gubernamental para crecer eficientemente.",
            "Es importante mantener un equilibrio entre el gasto público y la eficiencia económica."
        ]
        
        print("\n📊 Testing single text classification:")
        print("-" * 40)
        
        for i, text in enumerate(test_texts, 1):
            print(f"\nTest {i}: {text[:50]}...")
            result = await service.classify_text(text)
            print(f"Category: {result['category']}")
            print(f"Confidence: {result['confidence']:.3f}")
            print(f"Probabilities: {result['probabilities']}")
            print(f"Processing time: {result['processing_time']:.3f}s")
        
        print("\n📈 Testing batch classification:")
        print("-" * 40)
        
        batch_results = await service.classify_batch(test_texts)
        for i, result in enumerate(batch_results, 1):
            print(f"\nBatch result {i}:")
            print(f"Category: {result['category']}")
            print(f"Confidence: {result['confidence']:.3f}")
            if 'batch_processing_time' in result:
                print(f"Total batch time: {result['batch_processing_time']:.3f}s")
        
        print("\n🎉 All tests passed! HuggingFace model is working correctly.")
        
    except Exception as e:
        print(f"❌ Error during testing: {str(e)}")
        import traceback
        traceback.print_exc()
        return False
    
    return True

if __name__ == "__main__":
    success = asyncio.run(test_huggingface_model())
    sys.exit(0 if success else 1)