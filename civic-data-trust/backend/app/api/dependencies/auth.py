"""Authentication dependencies."""

from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials


security = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> Optional[str]:
    """Get current user (placeholder for future authentication)."""
    # TODO: Implement actual authentication logic
    # For now, return None to indicate no authentication required
    return None


async def require_auth(
    user: Optional[str] = Depends(get_current_user)
) -> str:
    """Require authentication (placeholder)."""
    # TODO: Implement actual authentication requirement
    # For now, allow all requests
    return "anonymous"