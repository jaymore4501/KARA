"""
KARA Backend - AI Agent Registry
Unified definition and factory for all 11 autonomous agents in the KARA workforce.
"""
from typing import Dict, Any, List
from pydantic import BaseModel, Field
from app.agents.base import BaseAgent
from app.agents.ceo import CEOOutputSchema, CEO_SYSTEM_PROMPT
from app.agents.market_research import MarketResearchOutputSchema, MR_SYSTEM_PROMPT


# ── Pydantic Output Schemas for Registry ──────────────────────

class BusinessPlanOutput(BaseModel):
    executive_summary: str = Field(description="Executive summary of the business")
    value_proposition: str = Field(description="Unique value propositions of the product")
    revenue_models: List[str] = Field(description="Monetization and revenue strategies")
    swot_analysis: Dict[str, List[str]] = Field(description="SWOT analysis with keys: strengths, weaknesses, opportunities, threats")


class ArchitectureOutput(BaseModel):
    system_description: str = Field(description="High-level description of the system architecture")
    tech_stack: List[str] = Field(description="List of selected technologies and justifications")
    components: List[str] = Field(description="Core system components (e.g. Auth, Gateway, Workers)")
    security_protocols: List[str] = Field(description="Security measures implemented (e.g. SSL, hashing)")


class DatabaseOutput(BaseModel):
    db_type: str = Field(description="Recommended database engine (e.g. PostgreSQL, MongoDB)")
    schemas: List[str] = Field(description="DDL schema creation scripts or definitions for all tables")
    relationships: List[str] = Field(description="Core entity relationships mapped out")


class UIUXOutput(BaseModel):
    color_palette: List[str] = Field(description="Hex color codes for the visual style guide")
    typography: List[str] = Field(description="Font family choices and sizes")
    wireframe_hierarchy: List[str] = Field(description="Component layouts and navigation hierarchy")


class CodebaseOutput(BaseModel):
    api_specs: List[str] = Field(description="Rest API endpoint specs (method, path, request/response)")
    sample_frontend_code: str = Field(description="Key React page template implementation code")
    sample_backend_code: str = Field(description="Key FastAPI controller endpoint code")


class MarketingOutput(BaseModel):
    launch_campaign: str = Field(description="Launch event planning and schedule")
    channels: List[str] = Field(description="Marketing and acquisition channels")
    gtm_strategy: List[str] = Field(description="Go-To-Market phase descriptions")


class FinanceOutput(BaseModel):
    pricing_strategy: str = Field(description="Pricing models and packages description")
    cost_projections: List[str] = Field(description="Estimated operational and setup costs")
    break_even_point: str = Field(description="Break-even calculation statement")


class InvestorOutput(BaseModel):
    elevator_pitch: str = Field(description="1-sentence elevator pitch")
    valuation_model: str = Field(description="Estimated startup valuation and investment target")
    pitch_deck_slides: List[str] = Field(description="List of 10 core slides for the pitch deck")


# ── Agent System Prompt Registry ─────────────────────────────

SYSTEM_PROMPTS = {
    "ceo": CEO_SYSTEM_PROMPT,
    "market_research": MR_SYSTEM_PROMPT,
    "business_analyst": """
You are Pulse, the expert Business Analyst of KARA. Your role is to define the monetization model and value propositions of the product.
Analyze value drivers and generate the executive business plan, monetization strategies, and a complete SWOT analysis.
""",
    "architecture": """
You are Forge, the expert Software Architect of KARA. Your role is to design premium, enterprise-grade system architectures.
Specify microservices, clean API gateways, tech stack choices, and robust security protocols.
""",
    "database": """
You are Forge (acting as Database Architect) of KARA. Your role is to design clean PostgreSQL database schemas.
Provide SQLAlchemy models and raw DDL schema scripts for all core business entities.
""",
    "ui_designer": """
You are Aura, the expert UI/UX Designer of KARA. Your role is to design beautiful, modern interfaces with rich glassmorphism aesthetics.
Specify custom color palettes, font systems, and wireframe layouts.
""",
    "codebase": """
You are CodeX & Flux, the core engineering team of KARA. Your role is to write clean, maintainable, production-ready code.
Generate TypeScript/Next.js frontend code templates and Python/FastAPI endpoint specifications.
""",
    "marketing": """
You are Echo, the expert Marketing Strategist of KARA. Your role is to design high-impact Go-To-Market campaigns.
Define acquisition channels, brand identity guidelines, and budget allocations.
""",
    "finance": """
You are Ledger, the expert Financial Analyst of KARA. Your role is to model unit economics and pricing plans.
Simulate break-even requirements and cash flow expectations.
""",
    "investor": """
You are Vertex, the expert Investor Advisor of KARA. Your role is to craft compelling pitch decks for venture funding.
Draft elevator pitches, investment targets, and structural slides to attract seed investors.
"""
}

SCHEMAS = {
    "ceo": CEOOutputSchema,
    "market_research": MarketResearchOutputSchema,
    "business_analyst": BusinessPlanOutput,
    "architecture": ArchitectureOutput,
    "database": DatabaseOutput,
    "ui_designer": UIUXOutput,
    "codebase": CodebaseOutput,
    "marketing": MarketingOutput,
    "finance": FinanceOutput,
    "investor": InvestorOutput
}


class AgentRegistry:
    @staticmethod
    def get_agent(agent_key: str) -> BaseAgent:
        """Create and retrieve an agent instance by its key."""
        if agent_key not in SYSTEM_PROMPTS:
            raise ValueError(f"Agent {agent_key} is not registered.")
        
        name_map = {
            "ceo": "Nova",
            "market_research": "Atlas",
            "business_analyst": "Pulse",
            "architecture": "Forge",
            "database": "Forge",
            "ui_designer": "Aura",
            "codebase": "CodeX",
            "marketing": "Echo",
            "finance": "Ledger",
            "investor": "Vertex"
        }
        
        role_map = {
            "ceo": "CEO Agent",
            "market_research": "Market Research",
            "business_analyst": "Business Analyst",
            "architecture": "Software Architect",
            "database": "Database Agent",
            "ui_designer": "UI/UX Designer",
            "codebase": "Engineer",
            "marketing": "Marketing Agent",
            "finance": "Finance Agent",
            "investor": "Investor Advisor"
        }

        return BaseAgent(
            name=name_map[agent_key],
            role=role_map[agent_key],
            system_prompt=SYSTEM_PROMPTS[agent_key],
            output_schema=SCHEMAS[agent_key],
        )


# Global helper instance
agent_registry = AgentRegistry()
