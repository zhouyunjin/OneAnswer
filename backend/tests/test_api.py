"""
API 测试用例

测试 FastAPI 应用的基本功能和 API 端点。
"""

import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client():
    """创建测试客户端"""
    return TestClient(app)


def test_root_endpoint(client):
    """测试根路径"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "message" in data
    assert "version" in data


def test_health_check(client):
    """测试健康检查端点"""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "one-answer-backend"


def test_api_health_check(client):
    """测试 API 健康检查端点"""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "one-answer-api"


def test_get_templates(client):
    """测试获取查询模板"""
    response = client.get("/api/templates")
    assert response.status_code == 200
    data = response.json()
    assert "tabs" in data
    assert len(data["tabs"]) > 0


def test_query_endpoint(client):
    """测试查询处理端点"""
    response = client.post(
        "/api/query",
        json={
            "user_id": "test_user",
            "query_text": "当前冶炼情况怎么样",
            "output_format": "json"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "query_id" in data
    assert "intent_type" in data
    assert "structured_output" in data


def test_query_with_different_intents(client):
    """测试不同意图的查询"""
    queries = [
        "当前冶炼情况怎么样",
        "今天有哪些报警",
        "最近3天铁水情况",
    ]
    
    for query_text in queries:
        response = client.post(
            "/api/query",
            json={"query_text": query_text}
        )
        assert response.status_code == 200
        data = response.json()
        assert "query_id" in data
        assert "structured_output" in data


def test_cors_headers(client):
    """测试 CORS 头"""
    response = client.options(
        "/api/query",
        headers={
            "Origin": "http://localhost:3000",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "Content-Type",
        }
    )
    assert response.status_code in [200, 403]