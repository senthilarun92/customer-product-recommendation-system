from fastapi.testclient import TestClient
from api.main import app


client = TestClient(app)


def test_root():
    response = client.get("/")

    assert response.status_code == 200


def test_customer():
    response = client.get("/customer/101")

    assert response.status_code == 200
    assert response.json()["customer_id"] == 101


def test_recommendations():
    response = client.get("/recommend/101")

    assert response.status_code == 200

    data = response.json()

    assert "recommendations" in data
    assert len(data["recommendations"]) > 0


def test_customer_history():
    response = client.get("/customer/101/history")

    assert response.status_code == 200


def test_dashboard_stats():
    response = client.get("/dashboard/stats")

    assert response.status_code == 200

    data = response.json()

    assert data["total_customers"] == 5
    assert data["total_products"] == 10
    assert data["total_purchases"] == 22


def test_most_purchased():
    response = client.get("/dashboard/most-purchased")

    assert response.status_code == 200
    assert "most_purchased_products" in response.json()


def test_category_purchases():
    response = client.get("/dashboard/category-purchases")

    assert response.status_code == 200
    assert "category_purchases" in response.json()


def test_customer_activity():
    response = client.get("/dashboard/customer-activity")

    assert response.status_code == 200
    assert "customer_activity" in response.json()


def test_top_recommendations():
    response = client.get("/dashboard/top-recommendations")

    assert response.status_code == 200
    assert "top_recommended_products" in response.json()

def test_invalid_customer():
    response = client.get("/customer/999")

    assert response.status_code == 404


def test_invalid_recommendation_customer():
    response = client.get("/recommend/999")

    assert response.status_code == 404