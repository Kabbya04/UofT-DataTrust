from fastapi import APIRouter
from app.api.endpoints import execute, data, eda_execute, eda_download, notebook, groq_llm

api_router = APIRouter()

# Include endpoint routers
api_router.include_router(execute.router, prefix="/execute", tags=["execution"])
api_router.include_router(data.router, prefix="/data", tags=["data"])
api_router.include_router(eda_execute.router, prefix="/eda-execute", tags=["eda"])
api_router.include_router(eda_download.router, prefix="/eda-download", tags=["downloads"])
api_router.include_router(notebook.router, prefix="/notebook", tags=["notebook"])
api_router.include_router(groq_llm.router, prefix="/llm", tags=["llm"])