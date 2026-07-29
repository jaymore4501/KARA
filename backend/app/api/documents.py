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
