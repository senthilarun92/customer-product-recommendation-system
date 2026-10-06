import pandas as pd
from database.db_connection import engine


def load_purchase_data():

    query = """
    SELECT
        c.customer_id,
        c.name,
        c.city,
        p.product_id,
        p.product_name,
        p.category,
        p.price,
        pu.rating,
        pu.purchase_date,
        pu.quantity
    FROM purchases pu
    JOIN customers c
        ON pu.customer_id = c.customer_id
    JOIN products p
        ON pu.product_id = p.product_id
    ORDER BY c.customer_id, pu.purchase_date;
    """

    df = pd.read_sql(query, engine)

    return df


if __name__ == "__main__":

    df = load_purchase_data()

    print("\nPurchase Data:")
    print(df)

    print("\nTotal records:", len(df))