"""
KARA Backend - Agent Execution API Endpoints
"""
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db
from app.database.models import User, Project
from app.auth.dependencies import get_current_user
from app.workflows.startup_pipeline import execute_startup_workflow

router = APIRouter(prefix="/agents", tags=["Agent Execution"])


# ── Background Execution Wrapper ─────────────────────────────

async def run_startup_generation_task(project_id: str, idea: str, problem: str, target_users: str, country: str, budget: str):
    """Executes the workflow graph in the background."""
    try:
        await execute_startup_workflow(
            project_id=project_id,
            idea=idea,
            problem=problem,
            target_users=target_users,
            country=country,
            budget=budget,
        )
    except Exception as e:
        print(f"Background execution failed for project {project_id}: {e}")
        # Reset project status to draft on error
        async with AsyncSession() as session:
            result = await session.execute(select(Project).where(Project.id == UUID(project_id)))
            proj = result.scalar_one_or_none()
            if proj:
                proj.status = "failed"
                await session.commit()


# ── Endpoints ───────────────────────────────────────────────

@router.post("/run/{project_id}", status_code=status.HTTP_202_ACCEPTED)
async def run_project_pipeline(
    project_id: UUID,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Initiates the autonomous AI workforce pipeline to compile a startup idea."""
    # Check if project exists
    result = await db.execute(
        select(Project).where(Project.id == project_id, Project.user_id == current_user.id)
    )
    project = result.scalar_one_or_none()

    if project is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )

    if project.status == "generating":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Project generation is already in progress",
        )

    # Update project status
    project.status = "generating"
    await db.flush()
    await db.commit()

    # Queue background task
    background_tasks.add_task(
        run_startup_generation_task,
        project_id=str(project.id),
        idea=project.idea,
        problem=project.problem or "",
        target_users=project.target_users or "",
        country=project.country or "",
        budget=project.budget or "",
    )

    return {
        "message": "AI pipeline generation successfully queued in the background.",
        "project_id": str(project.id),
        "status": "generating",
    }
