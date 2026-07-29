"""
KARA Backend - Projects API Endpoints
"""
from uuid import UUID
from typing import Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy import select, func, desc
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel

from app.database.session import get_db
from app.database.models import User, Project, AgentRun, ProjectDocument
from app.auth.dependencies import get_current_user

router = APIRouter(prefix="/projects", tags=["Projects"])


# ── Schemas ─────────────────────────────────────────────────

class CreateProjectRequest(BaseModel):
    name: str
    idea: str
    problem: Optional[str] = None
    target_users: Optional[str] = None
    country: Optional[str] = None
    budget: Optional[str] = None


class UpdateProjectRequest(BaseModel):
    name: Optional[str] = None
    idea: Optional[str] = None
    problem: Optional[str] = None
    target_users: Optional[str] = None
    country: Optional[str] = None
    budget: Optional[str] = None
    clarification_answers: Optional[dict] = None


class ProjectResponse(BaseModel):
    id: str
    name: str
    idea: str
    problem: Optional[str]
    target_users: Optional[str]
    country: Optional[str]
    budget: Optional[str]
    status: str
    startup_score: Optional[int]
    total_tokens_used: int
    total_agents_run: int
    created_at: str
    updated_at: str
    completed_at: Optional[str]

    class Config:
        from_attributes = True


class ProjectListResponse(BaseModel):
    projects: list[ProjectResponse]
    total: int
    page: int
    per_page: int


class ProjectDetailResponse(ProjectResponse):
    clarification_questions: Optional[dict]
    clarification_answers: Optional[dict]
    documents_count: int = 0
    agent_runs_count: int = 0


# ── Endpoints ───────────────────────────────────────────────

@router.get("/", response_model=ProjectListResponse)
async def list_projects(
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=50),
    status_filter: Optional[str] = Query(None, alias="status"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List all projects for the current user."""
    query = select(Project).where(Project.user_id == current_user.id)

    if status_filter:
        query = query.where(Project.status == status_filter)

    # Count total
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar() or 0

    # Paginate
    query = query.order_by(desc(Project.updated_at)).offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    projects = result.scalars().all()

    return ProjectListResponse(
        projects=[
            ProjectResponse(
                id=str(p.id),
                name=p.name,
                idea=p.idea,
                problem=p.problem,
                target_users=p.target_users,
                country=p.country,
                budget=p.budget,
                status=p.status,
                startup_score=p.startup_score,
                total_tokens_used=p.total_tokens_used,
                total_agents_run=p.total_agents_run,
                created_at=p.created_at.isoformat(),
                updated_at=p.updated_at.isoformat(),
                completed_at=p.completed_at.isoformat() if p.completed_at else None,
            )
            for p in projects
        ],
        total=total,
        page=page,
        per_page=per_page,
    )


@router.post("/", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(
    body: CreateProjectRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new startup project."""
    project = Project(
        user_id=current_user.id,
        name=body.name,
        idea=body.idea,
        problem=body.problem,
        target_users=body.target_users,
        country=body.country,
        budget=body.budget,
        status="draft",
    )
    db.add(project)
    await db.flush()
    await db.refresh(project)

    return ProjectResponse(
        id=str(project.id),
        name=project.name,
        idea=project.idea,
        problem=project.problem,
        target_users=project.target_users,
        country=project.country,
        budget=project.budget,
        status=project.status,
        startup_score=project.startup_score,
        total_tokens_used=project.total_tokens_used,
        total_agents_run=project.total_agents_run,
        created_at=project.created_at.isoformat(),
        updated_at=project.updated_at.isoformat(),
        completed_at=None,
    )


@router.get("/{project_id}", response_model=ProjectDetailResponse)
async def get_project(
    project_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get detailed project information."""
    result = await db.execute(
        select(Project).where(Project.id == project_id, Project.user_id == current_user.id)
    )
    project = result.scalar_one_or_none()

    if project is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    # Count related resources
    docs_count = await db.execute(
        select(func.count()).where(ProjectDocument.project_id == project_id)
    )
    runs_count = await db.execute(
        select(func.count()).where(AgentRun.project_id == project_id)
    )

    return ProjectDetailResponse(
        id=str(project.id),
        name=project.name,
        idea=project.idea,
        problem=project.problem,
        target_users=project.target_users,
        country=project.country,
        budget=project.budget,
        status=project.status,
        startup_score=project.startup_score,
        total_tokens_used=project.total_tokens_used,
        total_agents_run=project.total_agents_run,
        clarification_questions=project.clarification_questions,
        clarification_answers=project.clarification_answers,
        documents_count=docs_count.scalar() or 0,
        agent_runs_count=runs_count.scalar() or 0,
        created_at=project.created_at.isoformat(),
        updated_at=project.updated_at.isoformat(),
        completed_at=project.completed_at.isoformat() if project.completed_at else None,
    )


@router.patch("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: UUID,
    body: UpdateProjectRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update project details."""
    result = await db.execute(
        select(Project).where(Project.id == project_id, Project.user_id == current_user.id)
    )
    project = result.scalar_one_or_none()

    if project is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    update_data = body.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(project, key, value)

    project.updated_at = datetime.utcnow()
    await db.flush()
    await db.refresh(project)

    return ProjectResponse(
        id=str(project.id),
        name=project.name,
        idea=project.idea,
        problem=project.problem,
        target_users=project.target_users,
        country=project.country,
        budget=project.budget,
        status=project.status,
        startup_score=project.startup_score,
        total_tokens_used=project.total_tokens_used,
        total_agents_run=project.total_agents_run,
        created_at=project.created_at.isoformat(),
        updated_at=project.updated_at.isoformat(),
        completed_at=project.completed_at.isoformat() if project.completed_at else None,
    )


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(
    project_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a project and all related data."""
    result = await db.execute(
        select(Project).where(Project.id == project_id, Project.user_id == current_user.id)
    )
    project = result.scalar_one_or_none()

    if project is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    await db.delete(project)
