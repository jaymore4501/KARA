"""
KARA Backend - Analytics API Endpoints
Returns system utilization, token usage statistics, and execution metrics.
"""
from typing import Dict, Any, List
from fastapi import APIRouter, Depends
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db
from app.database.models import User, Project, AgentRun
from app.auth.dependencies import get_current_user

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/summary")
async def get_analytics_summary(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Retrieve summarized usage metrics for the active user's workspace."""
    # 1. Projects Count
    result_projects = await db.execute(
        select(func.count()).select_from(Project).where(Project.user_id == current_user.id)
    )
    total_projects = result_projects.scalar() or 0

    # 2. Total Token Metrics
    result_tokens = await db.execute(
        select(func.sum(Project.total_tokens_used)).where(Project.user_id == current_user.id)
    )
    total_tokens = result_tokens.scalar() or 0

    # 3. Total Agents Executed
    result_agents = await db.execute(
        select(func.sum(Project.total_agents_run)).where(Project.user_id == current_user.id)
    )
    total_agents = result_agents.scalar() or 0

    # 4. Success Rates / Run log metrics
    result_runs = await db.execute(
        select(AgentRun).join(Project).where(Project.user_id == current_user.id).limit(10)
    )
    recent_runs = result_runs.scalars().all()

    # Calculate remaining credits: 1 credit per 1000 tokens consumed
    credits_consumed = total_tokens // 1000
    remaining_credits = max(0, current_user.credits - credits_consumed)

    return {
        "user_id": str(current_user.id),
        "total_projects": total_projects,
        "total_tokens_used": total_tokens,
        "total_agents_run": total_agents,
        "credits_remaining": remaining_credits,
        "plan_type": current_user.plan,
        "recent_runs": [
            {
                "id": str(run.id),
                "agent_name": run.agent_name,
                "agent_role": run.agent_type,
                "status": run.status,
                "created_at": run.created_at.isoformat(),
            }
            for run in recent_runs
        ],
    }
