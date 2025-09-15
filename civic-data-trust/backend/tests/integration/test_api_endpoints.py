"""Integration tests for API endpoints."""

import pytest
from fastapi.testclient import TestClient


class TestAPIEndpoints:
    """Test API endpoint integration."""

    def test_root_endpoint(self, client: TestClient):
        """Test root endpoint."""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "version" in data

    def test_health_endpoint(self, client: TestClient):
        """Test health check endpoint."""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"

    def test_api_router_inclusion(self, client: TestClient):
        """Test that API router is properly included."""
        # Test a known endpoint from the API router
        response = client.get("/api/v1/execute/")
        # Should return method not allowed (405) rather than not found (404)
        # since GET is not allowed but the endpoint exists
        assert response.status_code in [405, 422]  # Method not allowed or validation error