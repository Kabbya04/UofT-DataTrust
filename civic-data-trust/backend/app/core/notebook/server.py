"""Notebook server management."""

import subprocess
import socket
from typing import Optional, Tuple

from app.utils.logging import get_logger
from app.exceptions.notebook import NotebookConnectionError

logger = get_logger(__name__)


class NotebookServerManager:
    """Manages Jupyter notebook server operations."""

    def __init__(self):
        self.default_port_range = (8888, 9000)

    def find_available_port(self, start_port: int = 8888, end_port: int = 9000) -> int:
        """Find an available port for the notebook server."""
        for port in range(start_port, end_port + 1):
            if self._is_port_available(port):
                return port

        raise NotebookConnectionError(
            f"No available ports found in range {start_port}-{end_port}"
        )

    def _is_port_available(self, port: int) -> bool:
        """Check if a port is available."""
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
                sock.bind(('localhost', port))
                return True
        except OSError:
            return False

    def start_notebook_server(
        self,
        notebook_directory: str,
        port: Optional[int] = None
    ) -> Tuple[subprocess.Popen, int, str]:
        """Start a Jupyter notebook server."""
        if port is None:
            port = self.find_available_port()

        # Generate a simple token for security
        token = "simple_token_123"

        cmd = [
            "jupyter", "lab",
            "--ip=0.0.0.0",
            f"--port={port}",
            f"--notebook-dir={notebook_directory}",
            "--no-browser",
            "--allow-root",
            f"--NotebookApp.token={token}",
            "--NotebookApp.password=''",
            "--NotebookApp.disable_check_xsrf=True"
        ]

        try:
            process = subprocess.Popen(
                cmd,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )

            logger.info(f"Started notebook server on port {port} with PID {process.pid}")
            return process, port, token

        except Exception as e:
            logger.error(f"Failed to start notebook server: {e}")
            raise NotebookConnectionError(f"Could not start notebook server: {str(e)}")

    def stop_notebook_server(self, process: subprocess.Popen) -> bool:
        """Stop a notebook server process."""
        try:
            process.terminate()
            process.wait(timeout=10)
            return True
        except subprocess.TimeoutExpired:
            logger.warning("Notebook server did not terminate gracefully, killing...")
            process.kill()
            return True
        except Exception as e:
            logger.error(f"Failed to stop notebook server: {e}")
            return False