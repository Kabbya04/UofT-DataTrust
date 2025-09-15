"""Notebook session management."""

import uuid
import subprocess
import psutil
from typing import Dict, Optional, List
from datetime import datetime

from app.utils.logging import get_logger
from app.exceptions.notebook import NotebookError, NotebookConnectionError
from .models import NotebookSession, NotebookStatus

logger = get_logger(__name__)


class NotebookManager:
    """Manages Jupyter notebook sessions."""

    def __init__(self):
        self.active_sessions: Dict[str, NotebookSession] = {}

    def create_session(
        self,
        notebook_directory: str,
        port: Optional[int] = None
    ) -> NotebookSession:
        """Create a new notebook session."""
        session_id = str(uuid.uuid4())

        try:
            session = NotebookSession(
                session_id=session_id,
                status=NotebookStatus.STARTING,
                notebook_directory=notebook_directory,
                start_time=datetime.now()
            )

            self.active_sessions[session_id] = session
            logger.info(f"Created notebook session {session_id}")

            return session

        except Exception as e:
            logger.error(f"Failed to create notebook session: {e}")
            raise NotebookError(f"Could not create notebook session: {str(e)}")

    def get_session(self, session_id: str) -> Optional[NotebookSession]:
        """Get notebook session by ID."""
        return self.active_sessions.get(session_id)

    def list_sessions(self) -> List[NotebookSession]:
        """List all active sessions."""
        return list(self.active_sessions.values())

    def stop_session(self, session_id: str) -> bool:
        """Stop a notebook session."""
        session = self.active_sessions.get(session_id)
        if not session:
            return False

        try:
            session.status = NotebookStatus.STOPPING

            if session.process_id:
                try:
                    process = psutil.Process(session.process_id)
                    process.terminate()
                    process.wait(timeout=10)
                except (psutil.NoSuchProcess, psutil.TimeoutExpired):
                    pass

            session.status = NotebookStatus.STOPPED
            del self.active_sessions[session_id]

            logger.info(f"Stopped notebook session {session_id}")
            return True

        except Exception as e:
            session.status = NotebookStatus.ERROR
            session.error_message = str(e)
            logger.error(f"Failed to stop notebook session {session_id}: {e}")
            return False

    def cleanup_dead_sessions(self) -> int:
        """Clean up dead or orphaned sessions."""
        cleaned_up = 0

        for session_id, session in list(self.active_sessions.items()):
            try:
                if session.process_id:
                    if not psutil.pid_exists(session.process_id):
                        session.status = NotebookStatus.STOPPED
                        del self.active_sessions[session_id]
                        cleaned_up += 1
                        logger.info(f"Cleaned up dead session {session_id}")

            except Exception as e:
                logger.warning(f"Error checking session {session_id}: {e}")

        return cleaned_up