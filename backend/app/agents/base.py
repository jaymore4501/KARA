"""
KARA Backend - Base AI Agent Class
Provides common wrapper for prompting, Gemini API calling, and schema validation.
"""
from typing import Optional, Any, Dict
from pydantic import BaseModel
from app.services.gemini import gemini_service


class BaseAgent:
    def __init__(
        self,
        name: str,
        role: str,
        system_prompt: str,
        output_schema: Optional[type[BaseModel]] = None,
        temperature: float = 0.7,
    ):
        self.name = name
        self.role = role
        self.system_prompt = system_prompt
        self.output_schema = output_schema
        self.temperature = temperature

    async def execute(self, prompt: str, context: Optional[Dict[str, Any]] = None) -> Any:
        """Execute the agent with a given prompt and context."""
        formatted_prompt = prompt
        if context:
            context_str = "\n".join([f"Context [{k}]: {v}" for k, v in context.items()])
            formatted_prompt = f"{context_str}\n\nTask:\n{prompt}"

        # If a pydantic schema is provided, request structured JSON output
        json_schema = None
        if self.output_schema:
            # Note: google-genai SDK takes pydantic models or JSON Schema dictionaries.
            # In google-genai, we can pass a Pydantic class directly to types.GenerateContentConfig.response_schema!
            json_schema = self.output_schema

        response_text = await gemini_service.generate_text(
            prompt=formatted_prompt,
            system_instruction=self.system_prompt,
            temperature=self.temperature,
            json_schema=json_schema,
        )

        return response_text
