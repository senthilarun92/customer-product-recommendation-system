# 🛍️ Customer Product Recommendation System

A customer-based product recommendation system built using **Python, PostgreSQL, Pandas, Scikit-learn, FastAPI, HTML, CSS, and JavaScript**.

The system analyzes customer purchase history, identifies customers with similar purchasing behavior, and recommends products that the selected customer has not purchased yet.

This project demonstrates a practical **User-Based Collaborative Filtering Recommendation System** with a REST API and web dashboard.

---

# 📌 Table of Contents

- [Project Overview](#-project-overview)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [System Architecture](#-system-architecture)
- [Recommendation Algorithm](#-recommendation-algorithm)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Step 1 - Clone the Repository](#-step-1---clone-the-repository)
- [Step 2 - Open the Project](#-step-2---open-the-project)
- [Step 3 - Create Virtual Environment](#-step-3---create-virtual-environment)
- [Step 4 - Activate Virtual Environment](#-step-4---activate-virtual-environment)
- [Step 5 - Install Dependencies](#-step-5---install-dependencies)
- [Step 6 - Configure PostgreSQL](#-step-6---configure-postgresql)
- [Step 7 - Create Environment File](#-step-7---create-environment-file)
- [Step 8 - Test Database Connection](#-step-8---test-database-connection)
- [Step 9 - Run Recommendation Model](#-step-9---run-recommendation-model)
- [Step 10 - Run Automated Tests](#-step-10---run-automated-tests)
- [Step 11 - Start FastAPI Backend](#-step-11---start-fastapi-backend)
- [Step 12 - Open Swagger API Documentation](#-step-12---open-swagger-api-documentation)
- [Step 13 - Start Frontend](#-step-13---start-frontend)
- [Step 14 - Open the Web Application](#-step-14---open-the-web-application)
- [Step 15 - Open Dashboard](#-step-15---open-dashboard)
- [API Endpoints](#-api-endpoints)
- [Sample Recommendation](#-sample-recommendation)
- [Testing](#-testing)
- [Security](#-security)
- [Troubleshooting](#-troubleshooting)
- [Future Improvements](#-future-improvements)
- [Author](#-author)
- [License](#-license)

---

# 📌 Project Overview

The goal of this project is to build a simple but practical recommendation system that recommends products to customers based on the purchasing behavior of other similar customers.

For example:

If Customer A and Customer B have purchased similar products, and Customer B purchased another product that Customer A has not purchased, the system can consider that product as a recommendation for Customer A.

The system uses **User-Based Collaborative Filtering** and **Cosine Similarity**.

---

# ✨ Features

- 👤 Customer information
- 🛒 Customer purchase history
- 🤖 Product recommendation system
- 👥 Similar customer identification
- 📊 Customer-product matrix
- 📐 Cosine similarity
- ⭐ Top 5 product recommendations
- 🚫 Removes products already purchased by the customer
- 📈 Purchase analytics dashboard
- 🏆 Most purchased products
- 📦 Category-wise purchase analysis
- 👥 Customer activity analysis
- ⭐ Top recommended products
- 🚀 FastAPI REST API
- 📚 Swagger API documentation
- 🌐 Web frontend
- 🧪 Automated testing using Pytest
- 🐘 PostgreSQL database

---

# 🛠️ Technology Stack

## Backend

- Python
- FastAPI
- Uvicorn

## Data Processing

- Pandas
- NumPy

## Machine Learning

- Scikit-learn
- Cosine Similarity
- User-Based Collaborative Filtering

## Database

- PostgreSQL
- SQLAlchemy
- Psycopg

## Frontend

- HTML
- CSS
- JavaScript
- Chart.js

## Testing

- Pytest
- HTTPX

---

# 🏗️ System Architecture

```text

                ┌──────────────────────┐

                │      Customer        │

                │      Web UI          │

                └──────────┬───────────┘

                           │

                           ▼

                ┌──────────────────────┐

                │      FastAPI         │

                │      REST API        │

                └──────────┬───────────┘

                           │

                           ▼

                ┌──────────────────────┐

                │      Python          │

                │ Recommendation Logic │

                └──────────┬───────────┘

                           │

                 ┌─────────┴─────────┐

                 │                   │

                 ▼                   ▼

        ┌────────────────┐   ┌─────────────────┐

        │    Pandas      │   │ Scikit-learn   │

        │ Data Processing│   │ Cosine Similarity│

        └────────────────┘   └─────────────────┘

                 │

                 ▼

        ┌────────────────────┐

        │     PostgreSQL     │

        │ Customer / Product │

        │ Purchase Data      │

        └────────────────────┘

```

---

# 🧠 Recommendation Algorithm

The system uses **User-Based Collaborative Filtering**.

## Step 1 — Create Customer-Product Matrix

Each customer is represented by the products they purchased.

Example:

| Customer | Laptop | Mouse | Keyboard | Headset |

|----------|--------|-------|----------|---------|

| Customer A | 1 | 1 | 0 | 0 |

| Customer B | 1 | 0 | 1 | 1 |

| Customer C | 0 | 1 | 1 | 0 |

`1` means the customer purchased the product.

`0` means the customer did not purchase the product.

---

## Step 2 — Calculate Customer Similarity

The system uses **Cosine Similarity**.

Cosine similarity compares the purchasing patterns of customers.

Customers with more similar purchasing behavior receive higher similarity scores.

---

## Step 3 — Find Similar Customers

For a selected customer, the system calculates similarity with other customers.

The selected customer is excluded from their own similarity comparison.

---

## Step 4 — Generate Recommendation Candidates

Products purchased by similar customers become recommendation candidates.

Products that the selected customer has already purchased are removed.

---

## Step 5 — Calculate Recommendation Scores

The recommendation score is calculated using:

```text

Recommendation Score

=

Similar Customer Purchase

×

Customer Similarity

```

The scores from similar customers are combined.

---

## Step 6 — Return Top Recommendations

The products are sorted by recommendation score.

The system returns the **Top 5 recommended products**.

---

# 📁 Project Structure

```text

recommendation-system/

│

├── api/

│   ├── **init**.py

│   └── [main.py](http://main.py)

│

├── database/

│   ├── **init**.py

│   └── db_[connection.py](http://connection.py)

│

├── models/

│   ├── **init**.py

│   ├── data_[loader.py](http://loader.py)

│   └── [recommender.py](http://recommender.py)

│

├── frontend/

│   ├── index.html

│   ├── style.css

│   ├── script.js

│   ├── dashboard.html

│   ├── dashboard.css

│   └── dashboard.js

│

├── tests/

│   ├── [conftest.py](http://conftest.py)

│   ├── test_[api.py](http://api.py)

│   └── test_[recommender.py](http://recommender.py)

│

├── .gitignore

├── .env

├── requirements.txt

├── [README.md](http://README.md)

└── venv/

```

### Important

The following folders/files should **not** be uploaded to GitHub:

```text

.env

venv/

**pycache**/

.pytest_cache/

```

They are excluded using `.gitignore`.

---

# 💻 Prerequisites

Before running this project, install the following:

### 1. Python

Python 3.10 or newer is recommended.

Check Python:

```powershell

python --version

```

Example:

```text

Python 3.10.11

```

---

### 2. PostgreSQL

Install PostgreSQL.

Check PostgreSQL:

```powershell

psql --version

```

Example:

```text

psql (PostgreSQL) 18.x

```

---

### 3. Git

Check Git:

```powershell

git --version

```

---

# 🚀 Step 1 - Clone the Repository

Open PowerShell.

Run:

```powershell

git clone [https://github.com/senthilarun92/customer-product-recommendation-system.git](https://github.com/senthilarun92/customer-product-recommendation-system.git)

```

After cloning, move into the project:

```powershell

cd customer-product-recommendation-system

```

---

# 📂 Step 2 - Open the Project

If using Cursor:

```powershell

cursor .

```

If the `cursor` command is not available, open Cursor manually and select the project folder.

Project folder:

```text

customer-product-recommendation-system

```

---

# 🐍 Step 3 - Create Virtual Environment

Create a Python virtual environment:

```powershell

python -m venv venv

```

This creates:

```text

venv/

```

The virtual environment keeps project packages separate from the system Python installation.

---

# ▶️ Step 4 - Activate Virtual Environment

For Windows PowerShell:

```powershell

.\venv\Scripts\Activate.ps1

```

After activation, the terminal should look similar to:

```text

(venv) PS C:\projects\customer-product-recommendation-system>

```

The `(venv)` means the virtual environment is active.

---

## If PowerShell blocks activation

If you see an execution policy error, run:

```powershell

Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

```

Then activate again:

```powershell

.\venv\Scripts\Activate.ps1

```

---

# 📦 Step 5 - Install Dependencies

Make sure the virtual environment is active.

Run:

```powershell

pip install -r requirements.txt

```

This installs:

- FastAPI
- Uvicorn
- Pandas
- NumPy
- Scikit-learn
- SQLAlchemy
- Psycopg
- python-dotenv
- Pytest
- HTTPX

After installation, verify:

```powershell

pip list

```

---

# 🐘 Step 6 - Configure PostgreSQL

The application uses PostgreSQL as its database.

Create a database named:

```text

recommendation_db

```

You can create it using PostgreSQL/pgAdmin.

Example SQL:

```sql

CREATE DATABASE recommendation_db;

```

Connect to:

```text

recommendation_db

```

The project requires these tables:

```text

customers

products

purchases

```

---

# 🗃️ Database Tables

## Customers

```sql

CREATE TABLE customers (

    customer_id INTEGER PRIMARY KEY,

    name VARCHAR(100) NOT NULL,

    age INTEGER,

    city VARCHAR(100)

);

```

---

## Products

```sql

CREATE TABLE products (

    product_id INTEGER PRIMARY KEY,

    product_name VARCHAR(150) NOT NULL,

    category VARCHAR(100),

    price DECIMAL(10,2)

);

```

---

## Purchases

```sql

CREATE TABLE purchases (

    purchase_id SERIAL PRIMARY KEY,

    customer_id INTEGER NOT NULL,

    product_id INTEGER NOT NULL,

    rating DECIMAL(2,1),

    purchase_date DATE,

    quantity INTEGER DEFAULT 1,

    FOREIGN KEY (customer_id)

        REFERENCES customers(customer_id),

    FOREIGN KEY (product_id)

        REFERENCES products(product_id)

);

```

---

# 🔐 Step 7 - Create Environment File

Create a file named:

```text

.env

```

The file should be located in the project root:

```text

recommendation-system/

│

├── .env

├── [README.md](http://README.md)

├── requirements.txt

├── api/

├── database/

├── models/

└── frontend/

```

Add:

```env

DB_USER=postgres

DB_PASSWORD=YOUR_POSTGRES_PASSWORD

DB_HOST=[localhost](http://localhost)

DB_PORT=5432

DB_NAME=recommendation_db

```

Replace:

```text

YOUR_POSTGRES_PASSWORD

```

with your own PostgreSQL password.

### ⚠️ Security Warning

Never upload the real `.env` file to GitHub.

The `.gitignore` file should contain:

```text

.env

```

---

# 🔌 Step 8 - Test Database Connection

Make sure:

1. PostgreSQL is running.
2. The `recommendation_db` database exists.
3. `.env` contains the correct database details.
4. Virtual environment is activated.

Run:

```powershell

python database/db_[connection.py](http://connection.py)

```

Expected:

```text

PostgreSQL connection successful!

Database: recommendation_db

```

If you see this, the Python application can connect to PostgreSQL successfully.

---

# 🤖 Step 9 - Run Recommendation Model

The recommendation logic is inside:

```text

models/[recommender.py](http://recommender.py)

```

Run:

```powershell

python models/[recommender.py](http://recommender.py)

```

This performs:

```text

PostgreSQL Data

       ↓

Customer-Product Matrix

       ↓

Cosine Similarity

       ↓

Similar Customers

       ↓

Recommendation Scores

       ↓

Top 5 Products

```

The output will show:

- Customer-product matrix
- Customer similarity
- Recommendations
- Product details
- Recommendation scores

---

# 🧪 Step 10 - Run Automated Tests

Before starting the server, run the tests.

Command:

```powershell

pytest

```

Expected result:

```text

==================== 14 passed ====================

```

The tests verify:

- API endpoints
- Customer lookup
- Recommendations
- Customer history
- Dashboard statistics
- Dashboard analytics
- Invalid customer handling
- Customer-product matrix
- Customer similarity
- Recommendation generation

---

# 🚀 Step 11 - Start FastAPI Backend

Open PowerShell in the project root.

Make sure virtual environment is active:

```powershell

.\venv\Scripts\Activate.ps1

```

Then start FastAPI:

```powershell

uvicorn api.main:app --reload

```

Expected output will look similar to:

```text

Uvicorn running on [http://127.0.0.1:8000](http://127.0.0.1:8000)

```

The backend is now running.

### Backend URL

```text

[http://127.0.0.1:8000](http://127.0.0.1:8000)

```

### Important

Keep this terminal open while using the application.

---

# 📚 Step 12 - Open Swagger API Documentation

FastAPI automatically provides interactive API documentation.

Open your browser:

```text

[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

```

You can see all available API endpoints.

You can also test APIs directly from Swagger.

---

# 🌐 Step 13 - Start Frontend

The backend and frontend run separately.

Keep the FastAPI terminal running.

Open a **second PowerShell terminal**.

Go to the frontend:

```powershell

cd frontend

```

Start the frontend server:

```powershell

python -m http.server 5500

```

Expected:

```text

Serving HTTP on 0.0.0.0 port 5500

```

Keep this terminal open.

---

# 🌍 Step 14 - Open the Web Application

Open your browser:

```text

[http://127.0.0.1:5500](http://127.0.0.1:5500)

```

The customer recommendation page should open.

---

# 📊 Step 15 - Open Dashboard

Open:

```text

[http://127.0.0.1:5500/dashboard.html](http://127.0.0.1:5500/dashboard.html)

```

The dashboard displays analytics such as:

- Total customers
- Total products
- Total purchases
- Most purchased products
- Category purchases
- Customer activity
- Top recommended products

---

# 🔌 API Endpoints

## 1. Root

```http

GET /

```

Returns API status.

---

## 2. Customer Information

```http

GET /customer/{customer_id}

```

Example:

```text

[http://127.0.0.1:8000/customer/101](http://127.0.0.1:8000/customer/101)

```

Returns customer information.

---

## 3. Product Recommendations

```http

GET /recommend/{customer_id}?top_n=5

```

Example:

```text

[http://127.0.0.1:8000/recommend/101?top_n=5](http://127.0.0.1:8000/recommend/101?top_n=5)

```

Returns the top 5 recommended products.

---

## 4. Customer Purchase History

```http

GET /customer/{customer_id}/history

```

Example:

```text

[http://127.0.0.1:8000/customer/101/history](http://127.0.0.1:8000/customer/101/history)

```

Returns the customer's purchase history.

---

## 5. Dashboard Statistics

```http

GET /dashboard/stats

```

Returns:

- Total customers
- Total products
- Total purchases

Example response:

```json

{

    "total_customers": 5,

    "total_products": 10,

    "total_purchases": 22

}

```

---

## 6. Most Purchased Products

```http

GET /dashboard/most-purchased

```

Returns the most purchased products.

---

## 7. Category Purchases

```http

GET /dashboard/category-purchases

```

Returns purchase quantities grouped by category.

---

## 8. Customer Activity

```http

GET /dashboard/customer-activity

```

Returns customer purchase activity.

---

## 9. Top Recommended Products

```http

GET /dashboard/top-recommendations

```

Returns products with the highest aggregate recommendation scores.

---

# 📊 Sample Recommendation

For Customer `101`:

```text

GET /recommend/101

```

The recommendation engine analyzes similar customers and recommends products that Customer 101 has not already purchased.

Example recommendations:

```text

1. Wireless Headset

2. Laptop Stand

3. USB Hub

4. Laptop Backpack

5. Monitor

```

The actual recommendations depend on the data stored in PostgreSQL.

---

# 🧪 Testing

Run all tests:

```powershell

pytest

```

Run tests with detailed output:

```powershell

pytest -v

```

Example:

```text

tests/test_[api.py](http://api.py) ...........

tests/test_[recommender.py](http://recommender.py) ...

==================== 14 passed ====================

```

---

# 🔄 Complete Run Order

For a fresh setup, follow these commands in order.

## Terminal 1 — Project Setup

```powershell

git clone [https://github.com/senthilarun92/customer-product-recommendation-system.git](https://github.com/senthilarun92/customer-product-recommendation-system.git)

cd customer-product-recommendation-system

python -m venv venv

.\venv\Scripts\Activate.ps1

pip install -r requirements.txt

```

---

## Configure Database

Create:

```text

recommendation_db

```

Create `.env`:

```env

DB_USER=postgres

DB_PASSWORD=YOUR_POSTGRES_PASSWORD

DB_HOST=[localhost](http://localhost)

DB_PORT=5432

DB_NAME=recommendation_db

```

---

## Test Database

```powershell

python database/db_[connection.py](http://connection.py)

```

Expected:

```text

PostgreSQL connection successful!

Database: recommendation_db

```

---

## Test Recommendation System

```powershell

python models/[recommender.py](http://recommender.py)

```

---

## Run Automated Tests

```powershell

pytest

```

---

## Start Backend

```powershell

uvicorn api.main:app --reload

```

Backend:

```text

[http://127.0.0.1:8000](http://127.0.0.1:8000)

```

Swagger:

```text

[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

```

---

# 🌐 Terminal 2 — Frontend

Open a second terminal.

Go to frontend:

```powershell

cd customer-product-recommendation-system\frontend

```

Start frontend:

```powershell

python -m http.server 5500

```

Open:

```text

[http://127.0.0.1:5500](http://127.0.0.1:5500)

```

Dashboard:

```text

[http://127.0.0.1:5500/dashboard.html](http://127.0.0.1:5500/dashboard.html)

```

---

# 🛑 How to Stop the Servers

To stop FastAPI or the frontend server:

Press:

```text

CTRL + C

```

in the corresponding terminal.

---

# 🔐 Security

Database credentials are stored using environment variables.

The real `.env` file must never be committed to GitHub.

The following files/folders are ignored:

```text

.env

venv/

**pycache**/

.pytest_cache/

```

---

# ⚠️ Important Notes

### Do not open the frontend using `file://`

Do not directly double-click:

```text

frontend/index.html

```

Instead run:

```powershell

python -m http.server 5500

```

Then open:

```text

[http://127.0.0.1:5500](http://127.0.0.1:5500)

```

This avoids browser security and CORS-related issues.

---

# 🛠️ Troubleshooting

## Problem 1 — Virtual environment is not activated

If the terminal does not show:

```text

(venv)

```

run:

```powershell

.\venv\Scripts\Activate.ps1

```

---

## Problem 2 — PowerShell blocks activation

Run:

```powershell

Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

```

Then:

```powershell

.\venv\Scripts\Activate.ps1

```

---

## Problem 3 — PostgreSQL connection failed

Check:

1. PostgreSQL service is running.
2. Database `recommendation_db` exists.
3. Username is correct.
4. Password is correct.
5. `.env` exists.
6. `.env` values are correct.

Test:

```powershell

python database/db_[connection.py](http://connection.py)

```

---

## Problem 4 — `ModuleNotFoundError`

Make sure virtual environment is active:

```powershell

.\venv\Scripts\Activate.ps1

```

Then install dependencies:

```powershell

pip install -r requirements.txt

```

---

## Problem 5 — Port 8000 is already in use

Start FastAPI using another port:

```powershell

uvicorn api.main:app --reload --port 8001

```

Then use:

```text

[http://127.0.0.1:8001](http://127.0.0.1:8001)

```

---

## Problem 6 — Frontend is not loading

Make sure the frontend server is running:

```powershell

cd frontend

python -m http.server 5500

```

Then open:

```text

[http://127.0.0.1:5500](http://127.0.0.1:5500)

```

---

## Problem 7 — API is not responding

Make sure FastAPI is running:

```powershell

uvicorn api.main:app --reload

```

Check:

```text

[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

```

---

# 🎯 Future Improvements

Possible future improvements include:

- Larger real-world datasets
- Product images
- User authentication
- Admin panel
- Item-Based Collaborative Filtering
- Hybrid Recommendation System
- Better recommendation evaluation
- Precision and Recall metrics
- Cold-start handling
- Product popularity analysis
- Online PostgreSQL database
- Cloud deployment
- Personalized recommendation explanations
- Recommendation feedback system
- User ratings and reviews

---

# 📈 Current Project Scope

This project is a practical demonstration of a **User-Based Collaborative Filtering Recommendation System**.

The current dataset is relatively small and is intended for demonstration and development purposes.

For a production recommendation platform, a significantly larger dataset, stronger evaluation methodology, monitoring, and additional recommendation strategies would be required.

---

# 👨‍💻 Author

**Senthil Arun**

Customer Product Recommendation System

Built as a practical software development and machine learning project.

---

# 📄 License

This project is intended for educational and demonstration purposes.