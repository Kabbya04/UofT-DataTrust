from fastapi import APIRouter, HTTPException
from app.models.responses import SampleDataResponse, DatasetInfo
from app.data.sample_data import SAMPLE_DATA

router = APIRouter()

@router.get("/sample", response_model=SampleDataResponse)
async def get_sample_data():
    """Get available sample datasets for testing"""
    try:
        datasets = {}
        
        for name, df in SAMPLE_DATA.items():
            datasets[name] = DatasetInfo(
                name=name,
                shape=list(df.shape),
                columns=list(df.columns),
                sample=df.head(3).to_dict('records'),
                description=f"Sample {name} dataset for testing workflows"
            )
        
        return SampleDataResponse(datasets=datasets)
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve sample data: {str(e)}"
        )

@router.get("/sample/{dataset_name}")
async def get_specific_dataset(dataset_name: str):
    """Get a specific sample dataset"""
    if dataset_name not in SAMPLE_DATA:
        raise HTTPException(
            status_code=404,
            detail=f"Dataset '{dataset_name}' not found. Available datasets: {list(SAMPLE_DATA.keys())}"
        )
    
    try:
        df = SAMPLE_DATA[dataset_name]
        return {
            "name": dataset_name,
            "shape": df.shape,
            "columns": list(df.columns),
            "data": df.to_dict('records')
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve dataset '{dataset_name}': {str(e)}"
        )