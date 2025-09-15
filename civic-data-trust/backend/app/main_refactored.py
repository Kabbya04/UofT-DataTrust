"""Refactored main application module following FastAPI best practices."""

from contextlib import asynccontextmanager
from typing import AsyncGenerator
import asyncio
import sys
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.api import api_router
from app.api.exception_handlers import register_exception_handlers
from app.core.file_processing.manager import FileManager
from app.utils.logging import setup_logging, get_logger

# Setup logging
setup_logging(level="INFO" if not settings.DEBUG else "DEBUG")
logger = get_logger(__name__)

# Global state for monitoring
app_state = {
    "requests_processed": 0,
    "startup_time": None,
    "version": settings.VERSION
}


async def cleanup_background_task():
    """Background task for periodic cleanup."""
    file_manager = FileManager()

    while True:
        try:
            await asyncio.sleep(21600)  # 6 hours

            # Cleanup notebook files
            notebooks_dir = "./notebooks"
            cleanup_result = file_manager.cleanup_notebook_files(notebooks_dir)

            if cleanup_result["files_removed"] > 0:
                logger.info(f"Cleaned up {cleanup_result['files_removed']} notebook files")

            # Cleanup temp files
            temp_dir = "./temp"
            temp_cleanup = file_manager.cleanup_temp_files(temp_dir)

            if temp_cleanup["files_removed"] > 0:
                logger.info(f"Cleaned up {temp_cleanup['files_removed']} temp files")

        except asyncio.CancelledError:
            break
        except Exception as e:
            logger.error(f"Background cleanup error: {e}")


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Application lifespan management with enhanced monitoring."""

    # Startup
    logger.info(f"🚀 Starting {settings.PROJECT_NAME} v{settings.VERSION}")
    logger.info(f"🐍 Python version: {sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}")
    logger.info(f"⚡ Debug mode: {settings.DEBUG}")
    logger.info(f"🔧 Performance monitoring: {settings.ENABLE_PERFORMANCE_MONITORING}")

    app_state["startup_time"] = asyncio.get_event_loop().time()

    # Initialize background tasks
    cleanup_task = None
    if settings.ENABLE_PERFORMANCE_MONITORING:
        cleanup_task = asyncio.create_task(cleanup_background_task())
        logger.info("📅 Background cleanup task started")

    # Python 3.12+ optimizations
    if sys.version_info >= (3, 12) and settings.USE_ASYNCIO_OPTIMIZATION:
        try:
            loop = asyncio.get_event_loop()
            if hasattr(asyncio, 'eager_task_factory'):
                loop.set_task_factory(asyncio.eager_task_factory)
                logger.info("⚡ Python 3.12+ asyncio optimizations enabled")
        except Exception as e:
            logger.warning(f"⚠️  Could not enable asyncio optimizations: {e}")

    logger.info("✅ Application startup complete")

    yield

    # Shutdown
    logger.info("🛑 Shutting down application...")

    if cleanup_task:
        cleanup_task.cancel()
        try:
            await cleanup_task
        except asyncio.CancelledError:
            pass

    uptime = asyncio.get_event_loop().time() - app_state["startup_time"]
    logger.info(f"📊 Final stats - Requests: {app_state['requests_processed']}, Uptime: {uptime:.1f}s")
    logger.info("✅ Shutdown complete")


def create_application() -> FastAPI:
    """Create and configure the FastAPI application with all components."""

    app = FastAPI(
        title=settings.PROJECT_NAME,
        version=settings.VERSION,
        description=f"{settings.PROJECT_NAME} - Refactored Backend API",
        docs_url="/docs" if settings.DEBUG else None,
        redoc_url="/redoc" if settings.DEBUG else None,
        lifespan=lifespan
    )

    # Add CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.ALLOWED_HOSTS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Register exception handlers
    register_exception_handlers(app)

    # Include API router
    app.include_router(api_router, prefix=settings.API_V1_STR)

    return app


# Create application instance
app = create_application()


@app.get("/")
async def root():
    """Root endpoint with enhanced system information."""
    app_state["requests_processed"] += 1

    uptime = None
    if app_state["startup_time"]:
        uptime = asyncio.get_event_loop().time() - app_state["startup_time"]

    return {
        "message": f"Welcome to {settings.PROJECT_NAME}",
        "version": settings.VERSION,
        "status": "running",
        "python_version": f"{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}",
        "docs_url": "/docs" if settings.DEBUG else "disabled",
        "requests_processed": app_state["requests_processed"],
        "uptime_seconds": round(uptime, 1) if uptime else None,
        "features": {
            "performance_monitoring": settings.ENABLE_PERFORMANCE_MONITORING,
            "asyncio_optimization": settings.USE_ASYNCIO_OPTIMIZATION and sys.version_info >= (3, 12),
            "debug_mode": settings.DEBUG
        }
    }


@app.get("/health")
async def health_check():
    """Enhanced health check endpoint."""
    return {
        "status": "healthy",
        "timestamp": asyncio.get_event_loop().time(),
        "version": settings.VERSION,
        "python_version": f"{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}",
        "requests_processed": app_state["requests_processed"],
        "features": {
            "refactored_architecture": True,
            "exception_handling": True,
            "dependency_injection": True,
            "modular_design": True
        }
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main_refactored:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level="info" if not settings.DEBUG else "debug",
        loop="asyncio"
    )