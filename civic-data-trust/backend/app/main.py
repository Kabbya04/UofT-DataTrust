from contextlib import asynccontextmanager
from typing import AsyncGenerator
import asyncio
import logging
import os
import time
from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from app.api.api import api_router
from app.core.config import settings

# Setup logging for Python 3.12+
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Global state for performance monitoring
app_state = {"requests_processed": 0, "execution_time": 0.0}

# Cleanup task for notebook files (24-hour retention)
async def cleanup_notebook_files():
    """Remove notebook files older than 24 hours"""
    try:
        notebooks_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "notebooks")
        if not os.path.exists(notebooks_dir):
            return

        current_time = time.time()
        files_removed = 0

        for filename in os.listdir(notebooks_dir):
            if filename in ['Welcome.ipynb', 'startup.py']:
                continue  # Keep permanent files

            file_path = os.path.join(notebooks_dir, filename)
            if os.path.isfile(file_path):
                file_age = current_time - os.path.getmtime(file_path)
                if file_age > 86400:  # 24 hours in seconds
                    os.remove(file_path)
                    files_removed += 1

        if files_removed > 0:
            logger.info(f"Cleaned up {files_removed} notebook files older than 24 hours")
    except Exception as e:
        logger.error(f"Notebook cleanup failed: {e}")

async def run_cleanup_schedule():
    """Run cleanup task every 6 hours"""
    while True:
        try:
            await asyncio.sleep(21600)  # 6 hours
            await cleanup_notebook_files()
        except asyncio.CancelledError:
            break
        except Exception as e:
            logger.error(f"Cleanup schedule error: {e}")

@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Application lifespan events - Python 3.12+ optimized"""
    # Startup
    logger.info(f"Starting {settings.PROJECT_NAME} v{settings.VERSION}")
    logger.info(f"Python version optimizations enabled: {settings.ENABLE_PERFORMANCE_MONITORING}")
    
    # Initialize any background tasks or connections here
    if settings.USE_ASYNCIO_OPTIMIZATION:
        # Python 3.12+ asyncio optimizations
        try:
            loop = asyncio.get_event_loop()
            if hasattr(asyncio, 'eager_task_factory'):
                loop.set_task_factory(asyncio.eager_task_factory)  # Python 3.12+ feature
            else:
                logger.info("eager_task_factory not available, skipping optimization")
        except Exception as e:
            logger.warning(f"Failed to set asyncio optimizations: {e}")

    # Start cleanup task (runs every 6 hours)
    cleanup_task = asyncio.create_task(run_cleanup_schedule())

    yield

    # Cancel cleanup task on shutdown
    cleanup_task.cancel()
    try:
        await cleanup_task
    except asyncio.CancelledError:
        pass
    
    # Shutdown
    logger.info(f"Shutting down {settings.PROJECT_NAME}")
    logger.info(f"Total requests processed: {app_state['requests_processed']}")

def create_application() -> FastAPI:
    """Create and configure the FastAPI application"""
    
    app = FastAPI(
        title=settings.PROJECT_NAME,
        version=settings.VERSION,
        description="Backend API for Data Science Workflow Canvas - Optimized for Python 3.12+",
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

    # Include API router
    app.include_router(api_router, prefix=settings.API_V1_STR)

    return app

app = create_application()

@app.get("/")
async def root():
    """Root endpoint with Python version info"""
    import sys
    app_state["requests_processed"] += 1
    
    return {
        "message": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "python_version": f"{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}",
        "docs_url": "/docs",
        "optimizations": {
            "python_3_12_plus": sys.version_info >= (3, 12),
            "performance_monitoring": settings.ENABLE_PERFORMANCE_MONITORING,
            "asyncio_optimization": settings.USE_ASYNCIO_OPTIMIZATION
        }
    }

@app.get("/health")
async def health_check():
    """Health check with performance metrics"""
    import sys
    return {
        "status": "healthy",
        "python_version": f"{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}",
        "requests_processed": app_state["requests_processed"],
        "performance_optimizations_active": sys.version_info >= (3, 12)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        loop="asyncio"  # Optimal for Python 3.12+
    )