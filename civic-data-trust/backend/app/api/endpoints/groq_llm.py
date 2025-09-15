"""
Groq LLM API endpoints
"""
import logging
from typing import Dict, Any, Optional
from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import StreamingResponse
import pandas as pd
import json

from app.services.groq_service import groq_service
from app.models.requests import LLMRequest, WorkflowNodeRequest
from app.models.responses import LLMResponse, WorkflowNodeResponse
from app.core.config import settings

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/analyze", response_model=LLMResponse)
async def analyze_data_with_llm(request: LLMRequest):
    """
    Analyze data using Groq LLM
    """
    if not groq_service:
        raise HTTPException(
            status_code=503,
            detail="Groq service not available. Please check GROQ_API_KEY configuration."
        )

    try:
        # Convert data to DataFrame
        if isinstance(request.data, dict):
            df = pd.DataFrame(request.data)
        elif isinstance(request.data, list):
            df = pd.DataFrame(request.data)
        else:
            raise ValueError("Invalid data format. Expected dict or list.")

        # Collect streaming response
        response_parts = []
        async for chunk in groq_service.analyze_csv_data(
            data=df,
            analysis_type=request.analysis_type,
            user_query=request.query
        ):
            response_parts.append(chunk)

        analysis = "".join(response_parts)

        return LLMResponse(
            analysis=analysis,
            model_used=groq_service.default_model,
            status="success"
        )

    except Exception as e:
        logger.error(f"Error in LLM analysis: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/analyze/stream")
async def stream_analysis(request: LLMRequest):
    """
    Stream LLM analysis results
    """
    if not groq_service:
        raise HTTPException(
            status_code=503,
            detail="Groq service not available. Please check GROQ_API_KEY configuration."
        )

    try:
        # Convert data to DataFrame
        if isinstance(request.data, dict):
            df = pd.DataFrame(request.data)
        elif isinstance(request.data, list):
            df = pd.DataFrame(request.data)
        else:
            raise ValueError("Invalid data format. Expected dict or list.")

        async def generate_stream():
            async for chunk in groq_service.analyze_csv_data(
                data=df,
                analysis_type=request.analysis_type,
                user_query=request.query
            ):
                yield f"data: {json.dumps({'content': chunk})}\n\n"

        return StreamingResponse(
            generate_stream(),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
            }
        )

    except Exception as e:
        logger.error(f"Error in streaming analysis: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/workflow/node", response_model=WorkflowNodeResponse)
async def process_workflow_node(request: WorkflowNodeRequest):
    """
    Process a workflow node with LLM capabilities
    """
    if not groq_service:
        raise HTTPException(
            status_code=503,
            detail="Groq service not available. Please check GROQ_API_KEY configuration."
        )

    try:
        result = await groq_service.process_workflow_node(
            node_type=request.node_type,
            input_data=request.input_data,
            node_config=request.node_config
        )

        return WorkflowNodeResponse(**result)

    except Exception as e:
        logger.error(f"Error processing workflow node: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health")
async def health_check():
    """
    Check Groq service health
    """
    return {
        "service": "groq-llm",
        "status": "healthy" if groq_service else "unavailable",
        "api_key_configured": bool(settings.GROQ_API_KEY),
        "default_model": groq_service.default_model if groq_service else None
    }