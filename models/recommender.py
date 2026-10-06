import pandas as pd

from sklearn.metrics.pairwise import cosine_similarity

from models.data_loader import load_purchase_data


def create_customer_product_matrix():

    # Load purchase data from PostgreSQL
    df = load_purchase_data()

    # Create Customer × Product matrix
    matrix = df.pivot_table(
        index="customer_id",
        columns="product_id",
        values="quantity",
        aggfunc="sum",
        fill_value=0
    )

    return matrix


def calculate_customer_similarity(matrix):

    # Calculate similarity between customers
    similarity = cosine_similarity(matrix)

    # Convert result into DataFrame
    similarity_df = pd.DataFrame(
        similarity,
        index=matrix.index,
        columns=matrix.index
    )

    return similarity_df


def recommend_products(customer_id, matrix, similarity_df, top_n=5):

    # Check whether customer exists
    if customer_id not in matrix.index:
        return pd.Series(dtype=float)

    # Get similarity scores for selected customer
    similarity_scores = similarity_df.loc[customer_id].copy()

    # Remove the customer themselves
    similarity_scores = similarity_scores.drop(customer_id)

    # Sort customers from most similar to least similar
    similarity_scores = similarity_scores.sort_values(
        ascending=False
    )

    # Products already purchased by target customer
    purchased_products = matrix.loc[customer_id]

    purchased_products = purchased_products[
        purchased_products > 0
    ].index

    # Calculate recommendation score
    recommendation_scores = pd.Series(
        0.0,
        index=matrix.columns
    )

    # Go through similar customers
    for similar_customer_id, similarity_score in similarity_scores.items():

        # Get products purchased by similar customer
        similar_customer_products = matrix.loc[similar_customer_id]

        # Add weighted score
        recommendation_scores += (
            similar_customer_products * similarity_score
        )

    # Remove products already purchased
    recommendation_scores = recommendation_scores.drop(
        purchased_products,
        errors="ignore"
    )

    # Remove products with zero score
    recommendation_scores = recommendation_scores[
        recommendation_scores > 0
    ]

    # Sort recommendations
    recommendation_scores = recommendation_scores.sort_values(
        ascending=False
    )

    # Return Top N recommendations
    return recommendation_scores.head(top_n)


def get_product_details(product_ids):

    # Load purchase data from PostgreSQL
    df = load_purchase_data()

    # Get unique product details
    product_details = (
        df[
            ["product_id", "product_name", "category", "price"]
        ]
        .drop_duplicates("product_id")
        .set_index("product_id")
    )

    # Return only recommended products
    return product_details.loc[
        product_details.index.intersection(product_ids)
    ]


if __name__ == "__main__":

    # Step 1: Create Customer × Product Matrix
    matrix = create_customer_product_matrix()

    print("\nCustomer × Product Matrix:")
    print(matrix)

    # Step 2: Calculate Customer Similarity
    similarity_df = calculate_customer_similarity(matrix)

    print("\nCustomer Similarity:")
    print(similarity_df.round(2))

    # Step 3: Generate Recommendations
    customer_id = 101

    recommendations = recommend_products(
        customer_id,
        matrix,
        similarity_df,
        top_n=5
    )

    print(f"\nRecommendations for Customer {customer_id}:")
    print(recommendations)

    # Step 4: Get Product Details
    product_details = get_product_details(
        recommendations.index
    )

    # Add recommendation score
    product_details = product_details.copy()

    product_details["recommendation_score"] = (
        recommendations
    )

    # Sort by recommendation score
    product_details = product_details.sort_values(
        by="recommendation_score",
        ascending=False
    )

    print("\nRecommended Product Details:")
    print(product_details)