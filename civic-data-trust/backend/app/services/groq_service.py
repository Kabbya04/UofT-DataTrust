"""
Groq LLM Service for data analysis and processing
"""
import asyncio
from typing import Optional, List, Dict, Any, AsyncGenerator
import pandas as pd
import logging
from groq import Groq
from app.core.config import settings

logger = logging.getLogger(__name__)

class GroqService:
    """Service for integrating Groq LLM capabilities"""

    def __init__(self):
        if not settings.GROQ_API_KEY:
            raise ValueError("GROQ_API_KEY not found in environment variables")

        self.client = Groq(api_key=settings.GROQ_API_KEY)
        self.default_model = "meta-llama/llama-4-scout-17b-16e-instruct"

    def _create_eda_system_prompt(self) -> str:
        """Create system prompt for EDA analysis"""
        return """You are an expert data scientist performing comprehensive Exploratory Data Analysis (EDA).
Analyze the provided dataset and deliver a complete EDA report with actual insights from the data.

ANALYZE THE ACTUAL DATA VALUES and provide:

## 1. Dataset Overview
- Dataset type/domain (health, business, financial, etc.)
- Shape: exact number of rows and columns
- Column names and their likely meanings
- Data types and what they represent

## 2. Data Quality Assessment
- Missing values: exact counts and percentages per column
- Duplicate records count
- Data type inconsistencies
- Invalid or suspicious values

## 3. Statistical Profile
- Numerical columns: mean, median, std dev, min/max, quartiles
- Categorical columns: unique values, mode, frequency distributions
- Key statistical insights and what they reveal

## 4. Distribution Analysis
- Shape of numerical distributions (normal, skewed, bimodal)
- Categorical variable frequencies and imbalances
- Notable patterns in value ranges

## 5. Correlation & Relationships
- Strong correlations between variables (specify values)
- Interesting relationships and dependencies
- Potential feature interactions

## 6. Outliers & Anomalies
- Identify specific outlier values and affected records
- Patterns in unusual data points
- Potential data entry errors

## 7. Domain-Specific Insights
- Business/domain implications of the findings
- What the data tells us about the subject matter
- Actionable insights for stakeholders

## 8. Data Readiness Assessment
- Suitability for different types of analysis
- Preprocessing recommendations
- Modeling considerations

Provide specific numbers, percentages, and concrete findings. Make it comprehensive like a professional EDA notebook but in prose format."""

    def _create_data_processing_prompt(self) -> str:
        """Create system prompt for data processing tasks"""
        return """You are a data processing expert. Your task is to analyze data and suggest
appropriate processing steps, transformations, and cleaning operations.

Focus on:
1. Data cleaning recommendations
2. Feature engineering suggestions
3. Data transformation needs
4. Processing pipeline recommendations
5. Best practices for data preparation

Provide practical, implementable suggestions."""

    async def analyze_csv_data(
        self,
        data: pd.DataFrame,
        analysis_type: str = "eda",
        user_query: Optional[str] = None
    ) -> AsyncGenerator[str, None]:
        """
        Analyze CSV data using Groq LLM

        Args:
            data: Pandas DataFrame with CSV data
            analysis_type: Type of analysis ('eda', 'processing', 'explanation')
            user_query: Optional user-specific query
        """
        try:
            # Prepare data summary
            data_summary = self._prepare_data_summary(data)

            # Select appropriate system prompt
            if analysis_type == "eda":
                system_prompt = self._create_eda_system_prompt()
            elif analysis_type == "processing":
                system_prompt = self._create_data_processing_prompt()
            else:
                system_prompt = "You are a helpful data analysis assistant."

            # Create user content
            user_content = f"""
Data Summary:
{data_summary}

{f"User Question: {user_query}" if user_query else ""}

Please provide a comprehensive analysis of this data."""

            messages = [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_content}
            ]

            # Create streaming completion
            completion = self.client.chat.completions.create(
                model=self.default_model,
                messages=messages,
                temperature=1,
                max_completion_tokens=1024,
                top_p=1,
                stream=True,
                stop=None
            )

            for chunk in completion:
                if chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content

        except Exception as e:
            logger.error(f"Error in Groq analysis: {e}")
            yield f"Error analyzing data: {str(e)}"

    def _prepare_data_summary(self, data: pd.DataFrame) -> str:
        """Prepare a summary of the DataFrame for LLM analysis"""
        try:
            summary_parts = []

            # Basic info
            summary_parts.append(f"Dataset shape: {data.shape[0]} rows, {data.shape[1]} columns")

            # Column information
            summary_parts.append(f"Columns: {list(data.columns)}")

            # Data types
            dtypes_info = data.dtypes.to_dict()
            summary_parts.append(f"Data types: {dtypes_info}")

            # Missing values
            missing_values = data.isnull().sum()
            if missing_values.any():
                summary_parts.append(f"Missing values: {missing_values.to_dict()}")

            # Basic statistics for numeric columns
            numeric_cols = data.select_dtypes(include=['number']).columns
            if len(numeric_cols) > 0:
                stats = data[numeric_cols].describe().to_string()
                summary_parts.append(f"Numeric columns statistics:\n{stats}")

            # Sample data (first few rows)
            sample_data = data.head(3).to_string()
            summary_parts.append(f"Sample data:\n{sample_data}")

            return "\n\n".join(summary_parts)

        except Exception as e:
            logger.error(f"Error preparing data summary: {e}")
            return f"Error preparing data summary: {str(e)}"

    async def process_workflow_node(
        self,
        node_type: str,
        input_data: Dict[str, Any],
        node_config: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Process a workflow node using Groq LLM

        Args:
            node_type: Type of node (e.g., 'llama', 'analysis')
            input_data: Input data from previous nodes
            node_config: Node configuration
        """
        try:
            if node_type.lower() == "llama":
                # Handle Llama node processing
                if "csv_data" in input_data:
                    data = pd.DataFrame(input_data["csv_data"])
                    analysis_type = node_config.get("analysis_type", "eda")
                    user_query = node_config.get("query", None)

                    # Collect streaming response
                    response_parts = []
                    async for chunk in self.analyze_csv_data(data, analysis_type, user_query):
                        response_parts.append(chunk)

                    return {
                        "analysis": "".join(response_parts),
                        "node_type": node_type,
                        "status": "completed"
                    }
                else:
                    return {
                        "error": "No CSV data found in input",
                        "status": "error"
                    }

            return {"error": f"Unsupported node type: {node_type}", "status": "error"}

        except Exception as e:
            logger.error(f"Error processing workflow node: {e}")
            return {"error": str(e), "status": "error"}

# Global service instance
groq_service = GroqService() if settings.GROQ_API_KEY else None