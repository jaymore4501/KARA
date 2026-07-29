"""
KARA Backend - Database Session Management
"""
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from app.config import settings

is_sqlite = settings.DATABASE_URL.startswith("sqlite")

engine_kwargs = {"echo": settings.DATABASE_ECHO}
if not is_sqlite:
    engine_kwargs.update({
        "pool_size": 20,
        "max_overflow": 10,
        "pool_pre_ping": True
    })

engine = create_async_engine(
    settings.DATABASE_URL,
    **engine_kwargs
)

async_session = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def get_db() -> AsyncSession:
    """Dependency that provides a database session."""
    async with async_session() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
