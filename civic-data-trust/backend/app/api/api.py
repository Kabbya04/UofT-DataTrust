from fastapi import APIRouter
from app.api.endpoints import execute, data

api_router = APIRouter()

# Include endpoint routers
api_router.include_router(execute.router, prefix="/execute", tags=["execution"])
api_router.include_router(data.router, prefix="/data", tags=["data"])