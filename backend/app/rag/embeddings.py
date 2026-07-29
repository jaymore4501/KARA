"""
KARA Backend - RAG Chunking and Embedding Generation
Splits document text and generates vector embeddings using Gemini.
"""
from typing import List
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.models import Embedding
from app.services.gemini import gemini_service

def chunk_text(text: str, chunk_size: int = 800, overlap: int = 150) -> List[str]:
    """Split text into overlapping chunks for indexing."""
    if not text:
        return []
    
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start += chunk_size - overlap
        
    return chunks


async def embed_and_index_document(
    db: AsyncSession,
    project_id: UUID,
    document_id: UUID,
    text_content: str
):
    """Chunk the document text, generate embeddings via Gemini, and store them."""
    chunks = chunk_text(text_content)
    
    for idx, chunk in enumerate(chunks):
        # Generate embedding vector
        vector = []
        # Only try to fetch real embeddings if API key is configured
        if gemini_service.api_key:
            try:
                vector = await gemini_service.get_embedding(chunk)
            except Exception as e:
                print(f"Error fetching embedding chunk {idx}: {e}")
        
        # Save to database
        db_embedding = Embedding(
            project_id=project_id,
            document_id=document_id,
            content_chunk=chunk,
            chunk_index=idx,
            vector_json=vector,  # Save list of floats directly to JSON column
        )
        db.add(db_embedding)
        
    await db.flush()
