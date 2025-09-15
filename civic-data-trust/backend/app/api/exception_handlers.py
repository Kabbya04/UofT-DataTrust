"""FastAPI exception handlers."""

from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.exceptions.base import AppException
from app.exceptions.eda import EDAExecutionError, EDAValidationError
from app.exceptions.file import FileProcessingError, FileNotFoundError, InvalidFileTypeError
from app.exceptions.notebook import NotebookError, NotebookConnectionError
from app.utils.logging import get_logger

logger = get_logger(__name__)


async def app_exception_handler(request: Request, exc: AppException) -> JSONResponse:
    """Handle custom application exceptions."""
    logger.error(f"Application exception: {exc.message}", extra={"details": exc.details})

    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.message,
            "details": exc.details,
            "type": exc.__class__.__name__
        }
    )


async def eda_exception_handler(request: Request, exc: EDAExecutionError) -> JSONResponse:
    """Handle EDA execution exceptions."""
    logger.error(f"EDA execution error: {exc.message}", extra={"details": exc.details})

    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": "EDA execution failed",
            "message": exc.message,
            "details": exc.details,
            "type": "EDAExecutionError"
        }
    )


async def file_exception_handler(request: Request, exc: FileProcessingError) -> JSONResponse:
    """Handle file processing exceptions."""
    logger.error(f"File processing error: {exc.message}", extra={"details": exc.details})

    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": "File processing failed",
            "message": exc.message,
            "details": exc.details,
            "type": "FileProcessingError"
        }
    )


async def notebook_exception_handler(request: Request, exc: NotebookError) -> JSONResponse:
    """Handle notebook exceptions."""
    logger.error(f"Notebook error: {exc.message}", extra={"details": exc.details})

    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": "Notebook operation failed",
            "message": exc.message,
            "details": exc.details,
            "type": "NotebookError"
        }
    )


async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    """Handle FastAPI validation exceptions."""
    logger.warning(f"Validation error: {exc.errors()}")

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": "Validation failed",
            "message": "Request validation error",
            "details": {"validation_errors": exc.errors()},
            "type": "ValidationError"
        }
    )


async def http_exception_handler(request: Request, exc: StarletteHTTPException) -> JSONResponse:
    """Handle HTTP exceptions."""
    logger.warning(f"HTTP exception: {exc.status_code} - {exc.detail}")

    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": f"HTTP {exc.status_code}",
            "message": exc.detail,
            "type": "HTTPException"
        }
    )


async def general_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Handle general exceptions."""
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)

    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "Internal server error",
            "message": "An unexpected error occurred",
            "type": "InternalServerError"
        }
    )


def register_exception_handlers(app):
    """Register all exception handlers with the FastAPI app."""
    app.add_exception_handler(AppException, app_exception_handler)
    app.add_exception_handler(EDAExecutionError, eda_exception_handler)
    app.add_exception_handler(EDAValidationError, eda_exception_handler)
    app.add_exception_handler(FileProcessingError, file_exception_handler)
    app.add_exception_handler(FileNotFoundError, file_exception_handler)
    app.add_exception_handler(InvalidFileTypeError, file_exception_handler)
    app.add_exception_handler(NotebookError, notebook_exception_handler)
    app.add_exception_handler(NotebookConnectionError, notebook_exception_handler)
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(StarletteHTTPException, http_exception_handler)
    app.add_exception_handler(Exception, general_exception_handler)