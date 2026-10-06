import os

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.engine import URL


# Load .env file
load_dotenv()


DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = int(os.getenv("DB_PORT", 5432))
DB_NAME = os.getenv("DB_NAME")


DATABASE_URL = URL.create(
    drivername="postgresql+psycopg",
    username=DB_USER,
    password=DB_PASSWORD,
    host=DB_HOST,
    port=DB_PORT,
    database=DB_NAME
)


engine = create_engine(DATABASE_URL)


def test_connection():
    try:
        with engine.connect():
            print("PostgreSQL connection successful!")
            print("Database:", DB_NAME)

    except Exception as e:
        print("Database connection failed!")
        print("Error:", e)


if __name__ == "__main__":
    test_connection()