from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy import text

from database.db_connection import engine

from models.recommender import (
    create_customer_product_matrix,
    calculate_customer_similarity,
    recommend_products,
    get_product_details
)


# =========================================================
# FASTAPI APP
# =========================================================

app = FastAPI(
    title="Customer Product Recommendation API",
    description="AI-based Customer Product Recommendation System",
    version="1.0.0"
)


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# HOME
# =========================================================

@app.get("/")
def home():

    return {
        "message": "Customer Recommendation API is running!"
    }


# =========================================================
# CUSTOMER PROFILE
# =========================================================

@app.get("/customer/{customer_id}")
def get_customer_profile(customer_id: int):

    if customer_id <= 0:
        raise HTTPException(
            status_code=400,
            detail="Customer ID must be a positive number."
        )

    query = """
    SELECT
        customer_id,
        name,
        age,
        city
    FROM customers
    WHERE customer_id = :customer_id;
    """

    try:

        with engine.connect() as connection:

            result = connection.execute(
                text(query),
                {"customer_id": customer_id}
            )

            row = result.mappings().first()

        if not row:
            raise HTTPException(
                status_code=404,
                detail=f"Customer {customer_id} not found."
            )

        return {
            "customer_id": int(row["customer_id"]),
            "name": str(row["name"]),
            "age": int(row["age"]),
            "city": str(row["city"])
        }

    except HTTPException:
        raise

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Unable to retrieve customer information."
        )


# =========================================================
# RECOMMENDATIONS
# =========================================================

@app.get("/recommend/{customer_id}")
def get_recommendations(
    customer_id: int,
    top_n: int = Query(
        default=5,
        ge=1,
        le=10,
        description="Number of recommendations to return (1-10)"
    )
):

    if customer_id <= 0:
        raise HTTPException(
            status_code=400,
            detail="Customer ID must be a positive number."
        )

    try:

        matrix = create_customer_product_matrix()

        if customer_id not in matrix.index:
            raise HTTPException(
                status_code=404,
                detail=f"Customer {customer_id} not found."
            )

        similarity_df = calculate_customer_similarity(
            matrix
        )

        recommendations = recommend_products(
            customer_id,
            matrix,
            similarity_df,
            top_n
        )

        if recommendations.empty:
            raise HTTPException(
                status_code=404,
                detail="No recommendations available for this customer."
            )

        product_details = get_product_details(
            recommendations.index
        )

        result = []

        for product_id, score in recommendations.items():

            if product_id not in product_details.index:
                continue

            product = product_details.loc[product_id]

            result.append({
                "product_id": int(product_id),
                "product_name": str(
                    product["product_name"]
                ),
                "category": str(
                    product["category"]
                ),
                "price": float(
                    product["price"]
                ),
                "recommendation_score": round(
                    float(score),
                    4
                )
            })

        if not result:
            raise HTTPException(
                status_code=404,
                detail="No valid recommendations found."
            )

        return {
            "customer_id": customer_id,
            "recommendations": result
        }

    except HTTPException:
        raise

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Unable to generate recommendations."
        )


# =========================================================
# CUSTOMER PURCHASE HISTORY
# =========================================================

@app.get("/customer/{customer_id}/history")
def get_customer_history(customer_id: int):

    if customer_id <= 0:
        raise HTTPException(
            status_code=400,
            detail="Customer ID must be a positive number."
        )

    query = """
    SELECT
        p.product_id,
        p.product_name,
        p.category,
        p.price,
        pu.rating,
        pu.purchase_date,
        pu.quantity
    FROM purchases pu
    JOIN products p
        ON pu.product_id = p.product_id
    WHERE pu.customer_id = :customer_id
    ORDER BY pu.purchase_date;
    """

    try:

        with engine.connect() as connection:

            result = connection.execute(
                text(query),
                {"customer_id": customer_id}
            )

            rows = result.mappings().all()

        if not rows:
            raise HTTPException(
                status_code=404,
                detail=f"No purchase history found for customer {customer_id}."
            )

        history = []

        for row in rows:

            history.append({
                "product_id": int(
                    row["product_id"]
                ),
                "product_name": str(
                    row["product_name"]
                ),
                "category": str(
                    row["category"]
                ),
                "price": float(
                    row["price"]
                ),
                "rating": float(
                    row["rating"]
                ),
                "purchase_date": str(
                    row["purchase_date"]
                ),
                "quantity": int(
                    row["quantity"]
                )
            })

        return {
            "customer_id": customer_id,
            "purchase_history": history
        }

    except HTTPException:
        raise

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Unable to retrieve purchase history."
        )


# =========================================================
# DASHBOARD BASIC STATS
# =========================================================

@app.get("/dashboard/stats")
def get_dashboard_stats():

    try:

        customer_query = """
        SELECT COUNT(*) AS total_customers
        FROM customers;
        """

        product_query = """
        SELECT COUNT(*) AS total_products
        FROM products;
        """

        purchase_query = """
        SELECT COUNT(*) AS total_purchases
        FROM purchases;
        """

        with engine.connect() as connection:

            customer_result = connection.execute(
                text(customer_query)
            )

            product_result = connection.execute(
                text(product_query)
            )

            purchase_result = connection.execute(
                text(purchase_query)
            )

            total_customers = (
                customer_result.scalar() or 0
            )

            total_products = (
                product_result.scalar() or 0
            )

            total_purchases = (
                purchase_result.scalar() or 0
            )

        return {
            "total_customers": int(
                total_customers
            ),
            "total_products": int(
                total_products
            ),
            "total_purchases": int(
                total_purchases
            )
        }

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Unable to load dashboard statistics."
        )


# =========================================================
# MOST PURCHASED PRODUCTS
# =========================================================

@app.get("/dashboard/most-purchased")
def get_most_purchased_products():

    query = """
    SELECT
        p.product_id,
        p.product_name,
        p.category,
        SUM(pu.quantity) AS total_quantity
    FROM purchases pu
    JOIN products p
        ON pu.product_id = p.product_id
    GROUP BY
        p.product_id,
        p.product_name,
        p.category
    ORDER BY
        total_quantity DESC
    LIMIT 5;
    """

    try:

        with engine.connect() as connection:

            result = connection.execute(
                text(query)
            )

            rows = result.mappings().all()

        products = []

        for row in rows:

            products.append({
                "product_id": int(
                    row["product_id"]
                ),
                "product_name": str(
                    row["product_name"]
                ),
                "category": str(
                    row["category"]
                ),
                "total_quantity": int(
                    row["total_quantity"]
                )
            })

        return {
            "most_purchased_products": products
        }

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Unable to load most purchased products."
        )


# =========================================================
# CATEGORY-WISE PURCHASES
# =========================================================

@app.get("/dashboard/category-purchases")
def get_category_purchases():

    query = """
    SELECT
        p.category,
        SUM(pu.quantity) AS total_quantity
    FROM purchases pu
    JOIN products p
        ON pu.product_id = p.product_id
    GROUP BY p.category
    ORDER BY total_quantity DESC;
    """

    try:

        with engine.connect() as connection:

            result = connection.execute(
                text(query)
            )

            rows = result.mappings().all()

        categories = []

        for row in rows:

            categories.append({
                "category": str(
                    row["category"]
                ),
                "total_quantity": int(
                    row["total_quantity"]
                )
            })

        return {
            "category_purchases": categories
        }

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Unable to load category purchase data."
        )


# =========================================================
# CUSTOMER ACTIVITY
# =========================================================

@app.get("/dashboard/customer-activity")
def get_customer_activity():

    query = """
    SELECT
        c.customer_id,
        c.name,
        COUNT(pu.purchase_id) AS total_purchases
    FROM customers c
    LEFT JOIN purchases pu
        ON c.customer_id = pu.customer_id
    GROUP BY
        c.customer_id,
        c.name
    ORDER BY
        total_purchases DESC;
    """

    try:

        with engine.connect() as connection:

            result = connection.execute(
                text(query)
            )

            rows = result.mappings().all()

        customers = []

        for row in rows:

            customers.append({
                "customer_id": int(
                    row["customer_id"]
                ),
                "name": str(
                    row["name"]
                ),
                "total_purchases": int(
                    row["total_purchases"]
                )
            })

        return {
            "customer_activity": customers
        }

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Unable to load customer activity."
        )


# =========================================================
# TOP RECOMMENDED PRODUCTS
# =========================================================

@app.get("/dashboard/top-recommendations")
def get_top_recommendations():

    try:

        matrix = create_customer_product_matrix()

        similarity_df = calculate_customer_similarity(
            matrix
        )

        recommendation_scores = {}

        for customer_id in matrix.index:

            recommendations = recommend_products(
                customer_id,
                matrix,
                similarity_df,
                top_n=5
            )

            for product_id, score in recommendations.items():

                if product_id not in recommendation_scores:
                    recommendation_scores[
                        product_id
                    ] = 0.0

                recommendation_scores[
                    product_id
                ] += float(score)

        sorted_products = sorted(
            recommendation_scores.items(),
            key=lambda x: x[1],
            reverse=True
        )[:5]

        product_ids = [
            product_id
            for product_id, score in sorted_products
        ]

        product_details = get_product_details(
            product_ids
        )

        result = []

        for product_id, score in sorted_products:

            if product_id not in product_details.index:
                continue

            product = product_details.loc[
                product_id
            ]

            result.append({
                "product_id": int(
                    product_id
                ),
                "product_name": str(
                    product["product_name"]
                ),
                "category": str(
                    product["category"]
                ),
                "total_recommendation_score": round(
                    score,
                    4
                )
            })

        return {
            "top_recommended_products": result
        }

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Unable to load top recommended products."
        )