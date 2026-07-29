"""
KARA Backend - Market Research Agent (Atlas)
Responsible for market sizing (TAM/SAM/SOM), competitor analysis, and target personas.
"""
from typing import List, Optional
from pydantic import BaseModel, Field
from app.agents.base import BaseAgent


# ── Output Schema ───────────────────────────────────────────

class MarketSizing(BaseModel):
    tam: str = Field(description="Total Addressable Market (TAM) with rationale")
    sam: str = Field(description="Serviceable Addressable Market (SAM) with rationale")
    som: str = Field(description="Serviceable Obtainable Market (SOM) with rationale")


class Competitor(BaseModel):
    name: str = Field(description="Name of competitor")
    strengths: List[str] = Field(description="Competitor strengths")
    vulnerabilities: List[str] = Field(description="Competitor weaknesses or vulnerabilities we can exploit")


class UserPersona(BaseModel):
    name: str = Field(description="Name/label of user profile (e.g. Remote DevOps Engineer)")
    pain_points: List[str] = Field(description="Core frustrations and pains")
    needs: List[str] = Field(description="What they want from a solution")


class MarketResearchOutputSchema(BaseModel):
    market_sizing: MarketSizing = Field(description="TAM/SAM/SOM breakdown")
    competitors: List[Competitor] = Field(description="Top competitors and vulnerabilities")
    user_personas: List[UserPersona] = Field(description="Representative customer profiles")
    regulatory_considerations: List[str] = Field(description="Key regulatory or compliance requirements (e.g. GDPR, HIPAA)")


# ── Agent System Prompt ──────────────────────────────────────

MR_SYSTEM_PROMPT = """
You are Atlas, the expert Market Research Agent of KARA. Your role is to perform rigorous market sizing and competitor mapping.
You analyze target demographics, calculate TAM/SAM/SOM, identify competitors, and define user pain points.
Provide highly practical market data and identify clear market gaps that the startup can exploit.
"""


class MarketResearchAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="Atlas",
            role="Market Research",
            system_prompt=MR_SYSTEM_PROMPT,
            output_schema=MarketResearchOutputSchema,
            temperature=0.7,
        )

    async def run(self, idea: str, ceo_vision: str, target_users: Optional[str] = None) -> MarketResearchOutputSchema:
        prompt = (
            f"Startup Idea: {idea}\n"
            f"CEO Strategic Vision:\n{ceo_vision}\n"
        )
        if target_users:
            prompt += f"Target Users Provided: {target_users}\n"
            
        prompt += "\nPerform market research and output in the requested JSON format."
        
        import json
        result_json = await self.execute(prompt)
        try:
            return MarketResearchOutputSchema.model_validate_json(result_json)
        except Exception:
            data = json.loads(result_json)
            return MarketResearchOutputSchema(**data)
