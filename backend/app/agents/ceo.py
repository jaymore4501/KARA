"""
KARA Backend - CEO Agent (Nova)
Responsible for strategic vision, core startup parameters, and milestone roadmap.
"""
from typing import List, Optional
from pydantic import BaseModel, Field
from app.agents.base import BaseAgent


# ── Output Schema ───────────────────────────────────────────

class Milestone(BaseModel):
    title: str = Field(description="Name of the milestone (e.g. MVP Launch)")
    timeline: str = Field(description="Target timeline or duration (e.g. Month 3)")
    description: str = Field(description="What needs to be achieved for this milestone")


class CEOOutputSchema(BaseModel):
    strategic_vision: str = Field(description="High-level vision statement and startup core concept")
    target_demographics: List[str] = Field(description="Primary target user segments")
    milestones: List[Milestone] = Field(description="Phased implementation roadmap milestones")
    governing_principles: List[str] = Field(description="Governing rules or standards for the startup's execution")


# ── Agent System Prompt ──────────────────────────────────────

CEO_SYSTEM_PROMPT = """
You are Nova, the expert CEO Agent of KARA. Your role is to define the strategic vision and governing framework for new startups.
You receive a startup idea, target users, and country. You must expand this into a comprehensive strategic outline.
You must be precise, professional, and inspire trust. Focus on realistic, high-growth strategies.
"""


class CEOAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="Nova",
            role="CEO Agent",
            system_prompt=CEO_SYSTEM_PROMPT,
            output_schema=CEOOutputSchema,
            temperature=0.7,
        )

    async def run(self, idea: str, problem: Optional[str] = None, country: Optional[str] = None) -> CEOOutputSchema:
        prompt = f"Startup Idea: {idea}\n"
        if problem:
            prompt += f"Problem Solved: {problem}\n"
        if country:
            prompt += f"Target Country: {country}\n"
        
        prompt += "\nGenerate the strategic outline according to the requested JSON format."
        
        # Execute using BaseAgent (which returns JSON string)
        import json
        result_json = await self.execute(prompt)
        try:
            return CEOOutputSchema.model_validate_json(result_json)
        except Exception:
            # Fallback parsing/validation in case of Gemini JSON formatting issues
            data = json.loads(result_json)
            return CEOOutputSchema(**data)
