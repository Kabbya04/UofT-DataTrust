from fastapi import APIRouter, HTTPException
import subprocess
import threading
import time
import os
import requests
from app.core.config import settings

router = APIRouter()

# Global state for notebook server
notebook_process = None
notebook_port = 8888

@router.post("/start")
async def start_notebook_server():
    """Start JupyterLab server"""
    global notebook_process, notebook_port
    
    if notebook_process and notebook_process.poll() is None:
        return {"status": "already_running", "url": f"http://localhost:{notebook_port}/lab"}
    
    try:
        # Ensure notebooks directory exists
        notebooks_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "notebooks")
        os.makedirs(notebooks_dir, exist_ok=True)
        
        # Start JupyterLab in background
        cmd = [
            "python", "-m", "jupyterlab",
            f"--port={notebook_port}",
            "--no-browser",
            "--allow-root",
            "--ServerApp.token=''",
            "--ServerApp.password=''",
            "--ServerApp.disable_check_xsrf=True",
            "--ServerApp.allow_origin='*'",
            "--ServerApp.tornado_settings={'headers': {'Content-Security-Policy': \"frame-ancestors 'self' *\"}}",
            "--LabApp.dev_mode=False",
            f"--notebook-dir={notebooks_dir}"
        ]
        
        notebook_process = subprocess.Popen(cmd, cwd=notebooks_dir)
        
        # Wait for server to start
        for _ in range(30):  # 30 second timeout
            try:
                response = requests.get(f"http://localhost:{notebook_port}/lab", timeout=1)
                if response.status_code == 200:
                    break
            except:
                time.sleep(1)
        
        return {"status": "started", "url": f"http://localhost:{notebook_port}/lab"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to start notebook: {str(e)}")

@router.post("/stop")
async def stop_notebook_server():
    """Stop JupyterLab server"""
    global notebook_process
    
    if notebook_process:
        notebook_process.terminate()
        notebook_process = None
        return {"status": "stopped"}
    
    return {"status": "not_running"}

@router.get("/status")
async def notebook_status():
    """Check notebook server status"""
    global notebook_process

    if notebook_process and notebook_process.poll() is None:
        return {"status": "running", "url": f"http://localhost:{notebook_port}/lab"}
    else:
        return {"status": "stopped"}

@router.get("/check-files")
async def check_existing_files():
    """Check if there are existing files in notebooks directory"""
    try:
        notebooks_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "notebooks")
        if not os.path.exists(notebooks_dir):
            return {"has_files": False, "file_count": 0}

        files = [f for f in os.listdir(notebooks_dir)
                if f not in ['Welcome.ipynb', 'startup.py'] and os.path.isfile(os.path.join(notebooks_dir, f))]

        return {"has_files": len(files) > 0, "file_count": len(files)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to check files: {str(e)}")

@router.post("/cleanup")
async def cleanup_files():
    """Manually remove all user files from notebooks directory"""
    try:
        notebooks_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "notebooks")
        if not os.path.exists(notebooks_dir):
            return {"status": "success", "files_removed": 0}

        files_removed = 0
        for filename in os.listdir(notebooks_dir):
            if filename in ['Welcome.ipynb', 'startup.py']:
                continue

            file_path = os.path.join(notebooks_dir, filename)
            if os.path.isfile(file_path):
                os.remove(file_path)
                files_removed += 1

        return {"status": "success", "files_removed": files_removed}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to cleanup files: {str(e)}")