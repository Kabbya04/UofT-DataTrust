"""Validation dependencies."""

from typing import Dict, Any
from fastapi import HTTPException, status, UploadFile, Depends
from app.core.config import Settings
from app.api.dependencies.core import get_settings
from app.exceptions.validation import ValidationError
from app.exceptions.file import InvalidFileTypeError
from app.utils.validation import validate_file_size, validate_file_type


async def validate_file_upload(
    file: UploadFile,
    settings: Settings = Depends(get_settings)
) -> UploadFile:
    """Validate uploaded file."""
    try:
        # Validate file size
        if file.size and not validate_file_size(file.size, settings.MAX_FILE_SIZE):
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=f"File too large. Maximum size: {settings.MAX_FILE_SIZE} bytes"
            )

        # Validate file type
        if file.filename and not validate_file_type(file.filename, settings.ALLOWED_FILE_TYPES):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid file type. Allowed types: {settings.ALLOWED_FILE_TYPES}"
            )

        return file

    except ValidationError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


async def validate_execution_request(
    request_data: Dict[str, Any],
    settings: Settings = Depends(get_settings)
) -> Dict[str, Any]:
    """Validate execution request."""
    try:
        # Validate function chain length
        if "function_chain" in request_data:
            chain_length = len(request_data["function_chain"])
            if chain_length > settings.MAX_CHAIN_LENGTH:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Function chain too long. Maximum length: {settings.MAX_CHAIN_LENGTH}"
                )

        # Validate required fields for custom workflows
        if request_data.get("workflow_type") == "custom":
            if not request_data.get("function_chain"):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="function_chain is required for custom workflow type"
                )

        return request_data

    except ValidationError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )