"""
KARA Backend - SQLAlchemy Database Models
Complete PostgreSQL schema with pgvector support.
"""
import uuid
from datetime import datetime
from typing import Optional

from sqlalchemy import (
    Column, String, Text, Boolean, Integer, Float, DateTime,
    ForeignKey, Enum, JSON, Index, BigInteger
)
from sqlalchemy import Uuid, JSON
from sqlalchemy.orm import DeclarativeBase, relationship, Mapped, mapped_column


class Base(DeclarativeBase):
    pass


# ─────────────────────────────────────────────────────────────
# Users
# ─────────────────────────────────────────────────────────────
class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    password_hash: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)  # Null for OAuth users
    avatar_url: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)
    provider: Mapped[str] = mapped_column(String(50), default="email")  # email, google, github
    provider_id: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_admin: Mapped[bool] = mapped_column(Boolean, default=False)
    credits: Mapped[int] = mapped_column(Integer, default=1000)
    plan: Mapped[str] = mapped_column(String(50), default="free")  # free, builder, autonomous, sovereign
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    projects = relationship("Project", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    settings = relationship("UserSetting", back_populates="user", cascade="all, delete-orphan")


# ─────────────────────────────────────────────────────────────
# Projects
# ─────────────────────────────────────────────────────────────
class Project(Base):
    __tablename__ = "projects"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("users.id"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    idea: Mapped[str] = mapped_column(Text, nullable=False)
    problem: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    target_users: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    country: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    budget: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    status: Mapped[str] = mapped_column(
        String(50), default="draft"
    )  # draft, clarifying, generating, completed, failed
    startup_score: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)  # 0-100
    clarification_questions: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    clarification_answers: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    total_tokens_used: Mapped[int] = mapped_column(BigInteger, default=0)
    total_agents_run: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    # Relationships
    user = relationship("User", back_populates="projects")
    documents = relationship("ProjectDocument", back_populates="project", cascade="all, delete-orphan")
    chats = relationship("ProjectChat", back_populates="project", cascade="all, delete-orphan")
    memories = relationship("ProjectMemory", back_populates="project", cascade="all, delete-orphan")
    agent_runs = relationship("AgentRun", back_populates="project", cascade="all, delete-orphan")
    generated_files = relationship("GeneratedFile", back_populates="project", cascade="all, delete-orphan")


# ─────────────────────────────────────────────────────────────
# Project Documents (generated outputs + uploaded files)
# ─────────────────────────────────────────────────────────────
class ProjectDocument(Base):
    __tablename__ = "project_documents"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    project_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("projects.id"), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(500), nullable=False)
    content: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    doc_type: Mapped[str] = mapped_column(
        String(50), nullable=False
    )  # business_plan, market_research, architecture, prd, ui_spec, api_spec, db_schema, marketing, finance, pitch_deck, uploaded
    agent_source: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)  # Which agent generated it
    file_path: Mapped[Optional[str]] = mapped_column(String(1024), nullable=True)  # For uploaded files
    file_type: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)  # pdf, docx, txt, md
    file_size: Mapped[Optional[int]] = mapped_column(BigInteger, nullable=True)
    meta_data: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    project = relationship("Project", back_populates="documents")
    embeddings = relationship("Embedding", back_populates="document", cascade="all, delete-orphan")


# ─────────────────────────────────────────────────────────────
# Project Chat Messages
# ─────────────────────────────────────────────────────────────
class ProjectChat(Base):
    __tablename__ = "project_chats"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    project_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("projects.id"), nullable=False, index=True)
    sender_type: Mapped[str] = mapped_column(String(20), nullable=False)  # user, agent, system
    sender_agent: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)  # Agent name if sender_type == agent
    content: Mapped[str] = mapped_column(Text, nullable=False)
    message_type: Mapped[str] = mapped_column(String(20), default="text")  # text, code, system, metric, file
    code_snippet: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)  # {language, code, fileName}
    meta_data: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relationships
    project = relationship("Project", back_populates="chats")


# ─────────────────────────────────────────────────────────────
# Project Memory (RAG knowledge base per project)
# ─────────────────────────────────────────────────────────────
class ProjectMemory(Base):
    __tablename__ = "project_memory"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    project_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("projects.id"), nullable=False, index=True)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    memory_type: Mapped[str] = mapped_column(
        String(50), nullable=False
    )  # agent_output, user_preference, document_summary, conversation, note
    source_agent: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    meta_data: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relationships
    project = relationship("Project", back_populates="memories")


# ─────────────────────────────────────────────────────────────
# Embeddings (pgvector for RAG)
# ─────────────────────────────────────────────────────────────
class Embedding(Base):
    __tablename__ = "embeddings"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    project_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("projects.id"), nullable=False, index=True)
    document_id: Mapped[Optional[uuid.UUID]] = mapped_column(Uuid, ForeignKey("project_documents.id"), nullable=True)
    content_chunk: Mapped[str] = mapped_column(Text, nullable=False)
    chunk_index: Mapped[int] = mapped_column(Integer, default=0)
    vector_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)  # List of floats for RAG
    meta_data: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relationships
    document = relationship("ProjectDocument", back_populates="embeddings")


# ─────────────────────────────────────────────────────────────
# Agent Runs (execution tracking)
# ─────────────────────────────────────────────────────────────
class AgentRun(Base):
    __tablename__ = "agent_runs"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    project_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("projects.id"), nullable=False, index=True)
    agent_type: Mapped[str] = mapped_column(String(50), nullable=False)  # ceo, market_research, product_manager, etc.
    agent_name: Mapped[str] = mapped_column(String(100), nullable=False)  # Nova, Atlas, Pulse, etc.
    status: Mapped[str] = mapped_column(
        String(20), default="pending"
    )  # pending, running, completed, failed
    input_data: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    output_data: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    error_message: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    tokens_used: Mapped[int] = mapped_column(BigInteger, default=0)
    execution_time_ms: Mapped[Optional[int]] = mapped_column(BigInteger, nullable=True)
    started_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relationships
    project = relationship("Project", back_populates="agent_runs")


# ─────────────────────────────────────────────────────────────
# Generated Files (exports)
# ─────────────────────────────────────────────────────────────
class GeneratedFile(Base):
    __tablename__ = "generated_files"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    project_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("projects.id"), nullable=False, index=True)
    filename: Mapped[str] = mapped_column(String(500), nullable=False)
    file_path: Mapped[str] = mapped_column(String(1024), nullable=False)
    file_type: Mapped[str] = mapped_column(String(50), nullable=False)  # pdf, docx, md, zip, json
    size_bytes: Mapped[Optional[int]] = mapped_column(BigInteger, nullable=True)
    export_type: Mapped[str] = mapped_column(String(50), nullable=False)  # full_export, single_document, pitch_deck
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relationships
    project = relationship("Project", back_populates="generated_files")


# ─────────────────────────────────────────────────────────────
# Notifications
# ─────────────────────────────────────────────────────────────
class Notification(Base):
    __tablename__ = "notifications"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("users.id"), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(500), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    notification_type: Mapped[str] = mapped_column(
        String(50), default="info"
    )  # info, success, warning, error, agent_update
    read: Mapped[bool] = mapped_column(Boolean, default=False)
    link: Mapped[Optional[str]] = mapped_column(String(1024), nullable=True)
    meta_data: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="notifications")


# ─────────────────────────────────────────────────────────────
# Analytics Events
# ─────────────────────────────────────────────────────────────
class AnalyticsEvent(Base):
    __tablename__ = "analytics_events"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("users.id"), nullable=False, index=True)
    project_id: Mapped[Optional[uuid.UUID]] = mapped_column(Uuid, ForeignKey("projects.id"), nullable=True)
    event_type: Mapped[str] = mapped_column(
        String(100), nullable=False
    )  # project_created, agent_started, agent_completed, export_generated, login, etc.
    meta_data: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


# ─────────────────────────────────────────────────────────────
# User Settings
# ─────────────────────────────────────────────────────────────
class UserSetting(Base):
    __tablename__ = "user_settings"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("users.id"), nullable=False, index=True)
    key: Mapped[str] = mapped_column(String(255), nullable=False)
    value: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    __table_args__ = (
        Index("ix_user_settings_user_key", "user_id", "key", unique=True),
    )

    # Relationships
    user = relationship("User", back_populates="settings")
