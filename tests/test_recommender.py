from models.recommender import (
    create_customer_product_matrix,
    calculate_customer_similarity,
    recommend_products
)


def test_customer_product_matrix():
    matrix = create_customer_product_matrix()

    assert matrix is not None
    assert len(matrix) == 5


def test_customer_similarity():
    matrix = create_customer_product_matrix()
    similarity = calculate_customer_similarity(matrix)

    assert similarity.shape == (5, 5)


def test_recommendations():
    matrix = create_customer_product_matrix()
    similarity = calculate_customer_similarity(matrix)

    recommendations = recommend_products(
        customer_id=101,
        matrix=matrix,
        similarity_df=similarity,
        top_n=5
    )

    assert recommendations is not None
    assert len(recommendations) <= 5
    assert len(recommendations) > 0