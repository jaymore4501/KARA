"""
KARA Backend - Documents & File Upload API Endpoints
"""
import os
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.database.session import get_db
from app.database.models import User, Project, ProjectDocument
from app.auth.dependencies import get_current_user
from app.rag.document_parser import parse_document
from app.rag.embeddings import embed_and_index_document

router = APIRouter(prefix="/documents", tags=["Documents"])


@router.post("/upload/{project_id}", status_code=status.HTTP_201_CREATED)
async def upload_document(
    project_id: UUID,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Uploads a document (PDF, DOCX, TXT, MD), parses text, and indexes vector embeddings."""
    # Verify project ownership
    result = await db.execute(
        select(Project).where(Project.id == project_id, Project.user_id == current_user.id)
    )
    project = result.scalar_one_or_none()
    if project is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    # Read and validate size
    file_bytes = await file.read()
    file_size = len(file_bytes)
    if file_size > settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File size exceeds the limit of {settings.MAX_UPLOAD_SIZE_MB}MB",
        )

    # Save file to upload directory
    file_name = file.filename or "uploaded_doc"
    file_path = os.path.join(settings.UPLOAD_DIR, f"{project_id}_{file_name}")
    
    with open(file_path, "wb") as f:
        f.write(file_bytes)

    # Parse and index text
    try:
        parsed_text = parse_document(file_path)
    except Exception as e:
        os.remove(file_path)  # cleanup
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Failed to parse document text: {e}",
        )

    # Create document record
    doc = ProjectDocument(
        project_id=project_id,
        title=file_name,
        doc_type="uploaded",
        file_path=file_path,
        file_type=file_name.split(".")[-1] if "." in file_name else "txt",
        file_size=file_size,
    )
    db.add(doc)
    await db.flush()

    # Index embeddings (RAG)
    try:
        await embed_and_index_document(db, project_id, doc.id, parsed_text)
    except Exception as e:
        print(f"Error during RAG indexing: {e}")
        # Non-fatal error, do not fail transaction if embeddings crash (API key issue)

    await db.commit()
    await db.refresh(doc)

    return {
        "id": str(doc.id),
        "title": doc.title,
        "file_type": doc.file_type,
        "file_size": doc.file_size,
        "created_at": doc.created_at.isoformat(),
    }


async def seed_default_documents_if_empty(db: AsyncSession, project: Project) -> list[ProjectDocument]:
    """Seed comprehensive default documents if none exist yet for the project."""
    result_docs = await db.execute(
        select(ProjectDocument).where(ProjectDocument.project_id == project.id)
    )
    existing_docs = result_docs.scalars().all()
    if existing_docs:
        return existing_docs

    pname = project.name
    pidea = project.idea or "Autonomous SaaS platform"
    pproblem = project.problem or "High operational inefficiency and setup latency"
    ptarget = project.target_users or "Developers, Product Managers, and Enterprise SaaS founders"

    seed_templates = [
        {
            "doc_type": "market_research",
            "title": f"{pname} Market Research Report",
            "content": f"# Market Research & Sizing Analysis for {pname}\n\n"
                       f"## Executive Summary\n"
                       f"{pname} operates within the fast-growing SaaS automation sector. Core target user segment: {ptarget}.\n\n"
                       f"## TAM / SAM / SOM Metrics\n"
                       f"- Total Addressable Market (TAM): $1.4 Billion globally across cloud developer platforms.\n"
                       f"- Serviceable Addressable Market (SAM): $380 Million addressable in North America & EU.\n"
                       f"- Serviceable Obtainable Market (SOM): $28 Million target at 7.5% initial adoption rate.\n\n"
                       f"## Competitor Benchmarking\n"
                       f"1. Legacy Solution A: High cost barrier, 3-week onboarding cycle.\n"
                       f"2. Platform B: Clunky manual UI, lack of AI autonomous synthesis.\n"
                       f"3. {pname}: Instant 1-click execution, autonomous multi-agent swarm architecture."
        },
        {
            "doc_type": "business_plan",
            "title": f"{pname} Business Plan v2",
            "content": f"# Strategic Business Plan v2 - {pname}\n\n"
                       f"## Core Value Proposition\n"
                       f"Solving: \"{pproblem}\" by providing {pidea}.\n\n"
                       f"## Revenue Streams\n"
                       f"- Builder Core Subscription: $49 / dev / month.\n"
                       f"- Autonomous Suite Enterprise Plan: $149 / month.\n"
                       f"- Usage-based API token compute credits.\n\n"
                       f"## Operations & Milestones\n"
                       f"- Q1: MVP Swarm deployment & initial beta trial onboarding.\n"
                       f"- Q2: Security audit, SOC2 certification, and Marketplace launches."
        },
        {
            "doc_type": "architecture",
            "title": f"{pname} System Architecture",
            "content": f"# Technical System Architecture Blueprint - {pname}\n\n"
                       f"## Technology Stack Specifications\n"
                       f"- Frontend Interface: Next.js 15 (React 19, TypeScript, Vanilla CSS design tokens).\n"
                       f"- REST API Service: Python FastAPI with Uvicorn async workers.\n"
                       f"- Database Layer: PostgreSQL with SQLAlchemy ORM async engine.\n"
                       f"- Vector Store RAG: PgVector / Qdrant embeddings with Gemini text-embedding-004.\n\n"
                       f"## Security & Compliance Protocols\n"
                       f"- OAuth2 JWT Token authentication with bcrypt password hashing.\n"
                       f"- AES-256 encrypted database backups & TLS 1.3 transit encryption."
        },
        {
            "doc_type": "db_schema",
            "title": f"{pname} Database Schema",
            "content": f"# PostgreSQL Relational Schema & ORM Blueprint - {pname}\n\n"
                       f"```sql\n"
                       f"CREATE TABLE users (\n"
                       f"    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n"
                       f"    email VARCHAR(255) UNIQUE NOT NULL,\n"
                       f"    hashed_password VARCHAR(255) NOT NULL,\n"
                       f"    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()\n"
                       f");\n\n"
                       f"CREATE TABLE projects (\n"
                       f"    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n"
                       f"    user_id UUID REFERENCES users(id) ON DELETE CASCADE,\n"
                       f"    name VARCHAR(255) NOT NULL,\n"
                       f"    idea TEXT NOT NULL,\n"
                       f"    status VARCHAR(50) DEFAULT 'draft'\n"
                       f");\n"
                       f"```"
        },
        {
            "doc_type": "ui_spec",
            "title": f"{pname} UI Design System",
            "content": f"# UI/UX Design System Specifications - {pname}\n\n"
                       f"## Brand Palette & Design Tokens\n"
                       f"- Primary Accent: HSL(265, 85%, 65%) - Vibrant Neon Purple\n"
                       f"- Card Backgrounds: Glassmorphism `#0B0813` with 8% white border strokes\n"
                       f"- Typography: Inter & Outfit font stacks for maximum clarity\n\n"
                       f"## Layout Standards\n"
                       f"- 12-column responsive grid with 24px gutters.\n"
                       f"- Smooth micro-animations with 200ms cubic-bezier transition curves."
        },
        {
            "doc_type": "marketing",
            "title": f"{pname} Marketing Strategy",
            "content": f"# Go-To-Market & Growth Strategy - {pname}\n\n"
                       f"## Marketing Channels\n"
                       f"1. Developer Content & Technical Blogs (SEO optimized tutorials).\n"
                       f"2. Product Hunt & Hacker News launch campaigns.\n"
                       f"3. Direct marketplace integrations on GitHub App Store.\n\n"
                       f"## Target CAC & LTV Ratio\n"
                       f"- Estimated CAC: $120 per active workspace.\n"
                       f"- Projected LTV: $1,450 per customer over 24-month retention window."
        },
        {
            "doc_type": "finance",
            "title": f"{pname} Financial Model",
            "content": f"# Financial Projection & Pro-Forma Ledger - {pname}\n\n"
                       f"## 3-Year Growth Projections\n"
                       f"- Year 1: $180,000 ARR with 120 paying accounts.\n"
                       f"- Year 2: $750,000 ARR with 480 paying accounts.\n"
                       f"- Year 3: $2,400,000 ARR with 1,500 paying accounts.\n\n"
                       f"## Gross Margin Metrics\n"
                       f"- Gross Margin target: 82% after cloud compute and token API usage debits."
        },
        {
            "doc_type": "pitch_deck",
            "title": f"{pname} Investor Pitch Deck",
            "content": f"# Investor Pitch Deck Slide Deck Specifications - {pname}\n\n"
                       f"## Slide 1: Problem Statement\n"
                       f"{pproblem}\n\n"
                       f"## Slide 2: The Solution\n"
                       f"{pidea}\n\n"
                       f"## Slide 3: Market Size & Opportunity\n"
                       f"TAM: $1.4B global market ripe for AI autonomous disruption.\n\n"
                       f"## Slide 4: Business Model & Traction\n"
                       f"Tiered SaaS pricing ($49/$149/$499 per month)."
        }
    ]

    new_docs = []
    for t in seed_templates:
        doc = ProjectDocument(
            project_id=project.id,
            title=t["title"],
            doc_type=t["doc_type"],
            content=t["content"],
            file_type="txt",
            file_size=len(t["content"].encode("utf-8")),
        )
        db.add(doc)
        new_docs.append(doc)

    await db.commit()
    return new_docs


@router.get("/{project_id}", response_model=list[dict])
async def list_project_documents(
    project_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List all documents generated or uploaded for a project."""
    # Verify project ownership
    result = await db.execute(
        select(Project).where(Project.id == project_id, Project.user_id == current_user.id)
    )
    project = result.scalar_one_or_none()
    if project is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    result_docs = await db.execute(
        select(ProjectDocument).where(ProjectDocument.project_id == project_id)
    )
    docs = result_docs.scalars().all()
    if not docs:
        docs = await seed_default_documents_if_empty(db, project)

    return [
        {
            "id": str(d.id),
            "title": d.title,
            "doc_type": d.doc_type,
            "file_type": d.file_type,
            "file_size": d.file_size,
            "created_at": d.created_at.isoformat(),
        }
        for d in docs
    ]
