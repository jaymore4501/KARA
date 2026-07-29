"""
KARA Backend - Google Gemini API Client Service
Handles text generation, embeddings, and chat interaction.
"""
import os
from typing import Optional, Any, Generator, AsyncGenerator
from google import genai
from google.genai import types
from google.genai.errors import APIError

from app.config import settings

class GeminiClient:
    def __init__(self):
        self._client = None
        self.api_key = settings.GEMINI_API_KEY or os.environ.get("GEMINI_API_KEY")
        if self.api_key:
            self._client = genai.Client(api_key=self.api_key)

    @property
    def client(self) -> genai.Client:
        if not self._client:
            # Try reloading key from env if it wasn't present at init
            self.api_key = settings.GEMINI_API_KEY or os.environ.get("GEMINI_API_KEY")
            if self.api_key:
                self._client = genai.Client(api_key=self.api_key)
            else:
                raise ValueError(
                    "GEMINI_API_KEY is not set. Please provide it in the .env file "
                    "or environment variables to enable AI generation."
                )
        return self._client

    async def generate_text(
        self,
        prompt: str,
        system_instruction: Optional[str] = None,
        model: Optional[str] = None,
        temperature: float = 0.7,
        json_schema: Optional[Any] = None,
    ) -> str:
        """Generate text from a prompt using Gemini."""
        model_name = model or settings.GEMINI_MODEL
        
        config = types.GenerateContentConfig(
            temperature=temperature,
            system_instruction=system_instruction,
        )
        
        if json_schema:
            config.response_mime_type = "application/json"
            config.response_schema = json_schema

        try:
            # Note: The new SDK supports async/sync calls.
            # In google-genai, generation is called on client.models.generate_content
            response = self.client.models.generate_content(
                model=model_name,
                contents=prompt,
                config=config,
            )
            return response.text or ""
        except APIError as e:
            print(f"Gemini API Error: {e}")
            raise
        except Exception as e:
            print(f"Unexpected generation error: {e}")
            raise

    async def generate_stream(
        self,
        prompt: str,
        system_instruction: Optional[str] = None,
        model: Optional[str] = None,
        temperature: float = 0.7,
    ) -> Generator[str, None, None]:
        """Generate text stream from a prompt using Gemini."""
        model_name = model or settings.GEMINI_MODEL
        
        config = types.GenerateContentConfig(
            temperature=temperature,
            system_instruction=system_instruction,
        )

        try:
            response_stream = self.client.models.generate_content_stream(
                model=model_name,
                contents=prompt,
                config=config,
            )
            for chunk in response_stream:
                if chunk.text:
                    yield chunk.text
        except APIError as e:
            print(f"Gemini API Stream Error: {e}")
            raise
        except Exception as e:
            print(f"Unexpected stream error: {e}")
            raise

    async def get_embedding(self, text: str, model: Optional[str] = None) -> list[float]:
        """Generate embedding vector for search/RAG."""
        model_name = model or settings.GEMINI_EMBEDDING_MODEL
        try:
            response = self.client.models.embed_content(
                model=model_name,
                contents=text,
            )
            # The structure of embed_content response
            if response.embeddings:
                return response.embeddings[0].values
            return []
        except Exception as e:
            print(f"Embedding generation error: {e}")
            return []


# Global Gemini client instance
gemini_service = GeminiClient()
