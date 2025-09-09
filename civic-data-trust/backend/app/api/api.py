from fastapi import APIRouter
from app.api.endpoints import execute, data, eda_execute

api_router = APIRouter()

# Include endpoint routers
api_router.include_router(execute.router, prefix="/execute", tags=["execution"])
api_router.include_router(data.router, prefix="/data", tags=["data"])
api_router.include_router(eda_execute.router, prefix="/eda-execute", tags=["eda"])