"""
KARA Backend - RAG Chat API Endpoints
Provides chat interactions context-aware of uploaded/generated startup documents.
"""
from uuid import UUID
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel

from app.database.session import get_db
from app.database.models import User, Project, ProjectChat
from app.auth.dependencies import get_current_user
from app.rag.retrieval import retrieve_relevant_chunks
from app.services.gemini import gemini_service

router = APIRouter(prefix="/chat", tags=["Project Chat"])


# ── Schemas ─────────────────────────────────────────────────

class ChatMessageRequest(BaseModel):
    message: str


class ChatMessageResponse(BaseModel):
    id: str
    sender_type: str
    sender_agent: Optional[str]
    content: str
    message_type: str
    created_at: str


# ── Endpoints ───────────────────────────────────────────────

@router.post("/{project_id}", response_model=ChatMessageResponse)
async def send_chat_message(
    project_id: UUID,
    body: ChatMessageRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Sends a chat message, retrieves RAG context from project files, and generates agent response."""
    # Verify project
    result = await db.execute(
        select(Project).where(Project.id == project_id, Project.user_id == current_user.id)
    )
    project = result.scalar_one_or_none()
    if project is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    # 1. Save user message
    user_msg = ProjectChat(
        project_id=project_id,
        sender_type="user",
        content=body.message,
        message_type="text",
    )
    db.add(user_msg)
    await db.flush()

    # 2. Retrieve relevant document chunks (RAG)
    try:
        chunks = await retrieve_relevant_chunks(db, project_id, body.message)
        context_str = "\n\n".join([f"Context Chunk {idx}: {c[0].content_chunk}" for idx, c in enumerate(chunks)])
    except Exception as e:
        print(f"RAG retrieval skipped: {e}")
        context_str = ""

    # 3. Compile prompt & generate response via CEO agent
    system_instruction = (
        "You are Nova, the CEO companion of the KARA workspace. "
        "You help users manage and build their startup based on the context of their documents. "
        "Use the retrieved document context below to answer their questions. If you do not know the answer "
        "or context is missing, use your general expertise to help them."
    )

    prompt = f"User Question: {body.message}\n\nDocument Context:\n{context_str}"
    
    agent_response_text = "I'm setting up your workspace companion. Please ensure your Gemini API key is configured to activate chat generation."
    if gemini_service.api_key:
        try:
            agent_response_text = await gemini_service.generate_text(
                prompt=prompt,
                system_instruction=system_instruction,
                temperature=0.7,
            )
        except Exception as e:
            print(f"Chat generation failed: {e}")
            agent_response_text = f"Apologies, I encountered an issue generating a response: {e}"

    # 4. Save agent message
    agent_msg = ProjectChat(
        project_id=project_id,
        sender_type="agent",
        sender_agent="Nova",
        content=agent_response_text,
        message_type="text",
    )
    db.add(agent_msg)
    await db.flush()
    await db.commit()

    return ChatMessageResponse(
        id=str(agent_msg.id),
        sender_type=agent_msg.sender_type,
        sender_agent=agent_msg.sender_agent,
        content=agent_msg.content,
        message_type=agent_msg.message_type,
        created_at=agent_msg.created_at.isoformat(),
    )


@router.get("/{project_id}", response_model=list[ChatMessageResponse])
async def get_chat_history(
    project_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Retrieve message history for a project chat companion."""
    # Verify project
    result = await db.execute(
        select(Project).where(Project.id == project_id, Project.user_id == current_user.id)
    )
    project = result.scalar_one_or_none()
    if project is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    result_chats = await db.execute(
        select(ProjectChat)
        .where(ProjectChat.project_id == project_id)
        .order_by(ProjectChat.created_at.asc())
    )
    chats = result_chats.scalars().all()

    return [
        ChatMessageResponse(
            id=str(c.id),
            sender_type=c.sender_type,
            sender_agent=c.sender_agent,
            content=c.content,
            message_type=c.message_type,
            created_at=c.created_at.isoformat(),
        )
        for c in chats
    ]
