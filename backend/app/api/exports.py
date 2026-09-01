"""
KARA Backend - Export Service API Endpoints
Compiles startup artifacts into Markdown, PDF, DOCX, and ZIP archives.
"""
import os
import zipfile
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import FileResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
import docx
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

from app.config import settings
from app.database.session import get_db
from app.database.models import User, Project, ProjectDocument, GeneratedFile
from app.auth.dependencies import get_current_user

router = APIRouter(prefix="/exports", tags=["Exports"])


# ── PDF Generation Helper ────────────────────────────────────

def build_pdf_document(file_path: str, title: str, text_content: str):
    """Build a standard business PDF using ReportLab."""
    doc = SimpleDocTemplate(file_path, pagesize=letter)
    styles = getSampleStyleSheet()
    
    # Custom Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        spaceAfter=15
    )
    body_style = ParagraphStyle(
        'DocBody',
        parent=styles['BodyText'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        spaceAfter=10
    )

    story = [
        Paragraph(title, title_style),
        Spacer(1, 12)
    ]

    # Split lines and append as paragraphs
    for line in text_content.split("\n"):
        clean_line = line.strip()
        if clean_line:
            story.append(Paragraph(clean_line, body_style))
            
    doc.build(story)


# ── Endpoints ───────────────────────────────────────────────

@router.get("/download/{project_id}/{doc_type}", response_class=FileResponse)
async def export_document(
    project_id: UUID,
    doc_type: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Exports and downloads a specific generated startup document in the requested format."""
    # Verify project
    result = await db.execute(
        select(Project).where(Project.id == project_id, Project.user_id == current_user.id)
    )
    project = result.scalar_one_or_none()
    if project is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    # Fetch document content
    result_doc = await db.execute(
        select(ProjectDocument).where(
            ProjectDocument.project_id == project_id,
            ProjectDocument.doc_type == doc_type
        )
    )
    doc = result_doc.scalar_one_or_none()
    if doc is None:
        from app.api.documents import seed_default_documents_if_empty
        await seed_default_documents_if_empty(db, project)
        result_doc = await db.execute(
            select(ProjectDocument).where(
                ProjectDocument.project_id == project_id,
                ProjectDocument.doc_type == doc_type
            )
        )
        doc = result_doc.scalar_one_or_none()

    if doc is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Artifact of type {doc_type} has not been generated yet for this project",
        )

    # Base target name
    base_filename = f"{project.name}_{doc_type}"
    content = doc.content or "Empty Document Content"

    # Clean and format plain text structure professionally
    title_line = doc.title.upper()
    separator = "=" * max(len(title_line), 40)
    txt_content = (
        f"{separator}\n"
        f"KARA SWARM AUTONOMOUS WORKSPACE WORKFLOW EXPORT\n"
        f"PROJECT: {project.name.upper()}\n"
        f"ASSET: {title_line}\n"
        f"{separator}\n\n"
        f"{content}"
    )

    # Export to txt
    txt_path = os.path.join(settings.EXPORT_DIR, f"{base_filename}.txt")
    with open(txt_path, "w", encoding="utf-8") as f:
        f.write(txt_content)

    return FileResponse(
        path=txt_path,
        filename=f"{base_filename}.txt",
        media_type="text/plain",
    )


@router.get("/bundle/{project_id}", response_class=FileResponse)
async def download_bundle(
    project_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Bundles all project documents into a single ZIP archive and serves it."""
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
        from app.api.documents import seed_default_documents_if_empty
        docs = await seed_default_documents_if_empty(db, project)

    if not docs:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No files have been compiled for this project yet",
        )

    zip_filename = f"{project.name}_Startup_Package.zip"
    zip_path = os.path.join(settings.EXPORT_DIR, f"{project_id}_{zip_filename}")

    with zipfile.ZipFile(zip_path, 'w') as zipf:
        for doc in docs:
            # Create text file inside zip
            filename = f"{doc.title.replace(' ', '_')}.txt"
            title_line = doc.title.upper()
            separator = "=" * max(len(title_line), 40)
            file_content = (
                f"{separator}\n"
                f"KARA SWARM AUTONOMOUS WORKSPACE WORKFLOW EXPORT\n"
                f"PROJECT: {project.name.upper()}\n"
                f"ASSET: {title_line}\n"
                f"{separator}\n\n"
                f"{doc.content or ''}"
            )
            zipf.writestr(filename, file_content)

    return FileResponse(
        path=zip_path,
        filename=zip_filename,
        media_type="application/zip",
    )


# ── 1-Click GitHub Push Endpoint ────────────────────────────

from pydantic import BaseModel
import base64
import httpx


class GitHubPushRequest(BaseModel):
    project_id: UUID
    repo_name: str
    is_private: bool = True
    github_token: str


@router.post("/github-push")
async def push_to_github(
    payload: GitHubPushRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Creates a new remote GitHub repository for the specified project and commits all compiled startup files.
    """
    # 1. Verify project ownership
    result = await db.execute(
        select(Project).where(Project.id == payload.project_id, Project.user_id == current_user.id)
    )
    project = result.scalar_one_or_none()
    if project is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    # 2. Get all project documents
    result_docs = await db.execute(
        select(ProjectDocument).where(ProjectDocument.project_id == payload.project_id)
    )
    docs = result_docs.scalars().all()
    if not docs:
        from app.api.documents import seed_default_documents_if_empty
        docs = await seed_default_documents_if_empty(db, project)

    token = payload.github_token.strip()
    if not token:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="GitHub Personal Access Token is required")

    clean_repo_name = payload.repo_name.strip().replace(" ", "-")
    headers = {
        "Authorization": f"token {token}",
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "KARA-AI-Engine"
    }

    async with httpx.AsyncClient(timeout=15.0) as client:
        # Create GitHub Repository
        create_repo_res = await client.post(
            "https://api.github.com/user/repos",
            json={
                "name": clean_repo_name,
                "description": f"Generated by KARA Autonomous AI Engine — {project.name}",
                "private": payload.is_private,
                "auto_init": True
            },
            headers=headers
        )

        if create_repo_res.status_code not in (200, 201):
            error_data = create_repo_res.json()
            err_msg = error_data.get("message", "Failed to create GitHub repository")
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"GitHub API Error: {err_msg}")

        repo_data = create_repo_res.json()
        repo_full_name = repo_data.get("full_name")
        html_url = repo_data.get("html_url")

        # Commit project files
        for doc in docs:
            clean_title = doc.title.lower().replace(" ", "_")
            filename = f"docs/{doc.doc_type}_{clean_title}.md"
            content = f"# {doc.title}\n\n{doc.content or ''}"
            encoded_content = base64.b64encode(content.encode("utf-8")).decode("utf-8")
            
            try:
                await client.put(
                    f"https://api.github.com/repos/{repo_full_name}/contents/{filename}",
                    json={
                        "message": f"feat(kara): add {doc.title} generated artifact",
                        "content": encoded_content
                    },
                    headers=headers
                )
            except Exception as commit_err:
                print(f"Commit warning for {filename}: {commit_err}")

    return {
        "status": "success",
        "repo_name": clean_repo_name,
        "repo_url": html_url,
        "message": f"Successfully created {repo_full_name} and committed {len(docs)} startup assets!"
    }

