"""
KARA Backend - RAG Retrieval Service
Retrieves relevant document chunks matching user query using local cosine similarity search.
"""
import math
from uuid import UUID
from typing import List, Tuple
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.models import Embedding
from app.services.gemini import gemini_service

def compute_cosine_similarity(v1: list[float], v2: list[float]) -> float:
    """Calculate cosine similarity score between two vectors."""
    if not v1 or not v2 or len(v1) != len(v2):
        return 0.0
    
    dot_product = sum(a * b for a, b in zip(v1, v2))
    norm_v1 = math.sqrt(sum(a * a for a in v1))
    norm_v2 = math.sqrt(sum(b * b for b in v2))
    
    if norm_v1 == 0 or norm_v2 == 0:
        return 0.0
        
    return dot_product / (norm_v1 * norm_v2)


async def retrieve_relevant_chunks(
    db: AsyncSession,
    project_id: UUID,
    query: str,
    top_k: int = 4
) -> List[Tuple[Embedding, float]]:
    """Retrieve top_k chunks relevant to query from the project's knowledge base."""
    # 1. Generate query embedding
    query_vector = []
    if gemini_service.api_key:
        try:
            query_vector = await gemini_service.get_embedding(query)
        except Exception as e:
            print(f"Error fetching query embedding: {e}")
            
    if not query_vector:
        # Fallback: if we cannot get embeddings, return latest chunks
        result = await db.execute(
            select(Embedding).where(Embedding.project_id == project_id).limit(top_k)
        )
        return [(chunk, 0.0) for chunk in result.scalars().all()]

    # 2. Fetch all embeddings for this project
    result = await db.execute(
        select(Embedding).where(Embedding.project_id == project_id)
    )
    embeddings = result.scalars().all()

    # 3. Compute similarities locally
    scored_chunks = []
    for chunk in embeddings:
        if chunk.vector_json:
            # vector_json is stored as a list of floats
            similarity = compute_cosine_similarity(query_vector, chunk.vector_json)
            scored_chunks.append((chunk, similarity))
            
    # 4. Sort and return top_k
    scored_chunks.sort(key=lambda x: x[1], reverse=True)
    return scored_chunks[:top_k]
