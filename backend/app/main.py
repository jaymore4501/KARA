"""
KARA Backend - FastAPI Main Application
"""
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database.session import engine
from app.database.models import Base

# Import API routers
from app.api.auth import router as auth_router
from app.api.projects import router as projects_router
from app.api.agents import router as agents_router
from app.api.documents import router as documents_router
from app.api.chat import router as chat_router
from app.api.exports import router as exports_router
from app.api.analytics import router as analytics_router
from app.api.websocket import router as ws_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup and shutdown events."""
    # Startup: Create upload/export directories
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    os.makedirs(settings.EXPORT_DIR, exist_ok=True)

    # Create database tables (dev only — use Alembic in production)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    print(f"KARA Backend v{settings.APP_VERSION} started")
    yield

    # Shutdown
    await engine.dispose()
    print("KARA Backend stopped")


# ── FastAPI App ─────────────────────────────────────────────

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="KARA - Knowledge AI for Research & Automation. Multi-agent AI platform for startup creation.",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── CORS ────────────────────────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Security Headers Middleware ──────────────────────────────

@app.middleware("http")
async def add_security_headers(request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    return response

# ── Routers ─────────────────────────────────────────────────

app.include_router(auth_router, prefix=settings.API_PREFIX)
app.include_router(projects_router, prefix=settings.API_PREFIX)
app.include_router(agents_router, prefix=settings.API_PREFIX)
app.include_router(documents_router, prefix=settings.API_PREFIX)
app.include_router(chat_router, prefix=settings.API_PREFIX)
app.include_router(exports_router, prefix=settings.API_PREFIX)
app.include_router(analytics_router, prefix=settings.API_PREFIX)
app.include_router(ws_router)


# ── Health Check ────────────────────────────────────────────

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
    }


@app.get("/")
async def root():
    return {
        "message": "Welcome to KARA API",
        "docs": "/docs",
        "version": settings.APP_VERSION,
    }
