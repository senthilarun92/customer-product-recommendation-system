# Customer Product Recommendation System

A customer-based product recommendation system built using Python, PostgreSQL, Pandas, Scikit-learn, and FastAPI.

The system analyzes customer purchase history, finds customers with similar purchasing behavior, and recommends products that a customer has not purchased yet.

---

## 🚀 Project Overview

This project implements a **User-Based Collaborative Filtering** recommendation system.

The system follows this workflow:

Customer Purchase Data
        ↓
PostgreSQL Database
        ↓
SQL JOIN
        ↓
Pandas DataFrame
        ↓
Customer × Product Matrix
        ↓
Cosine Similarity
        ↓
Similar Customers
        ↓
Recommended Products
        ↓
Top 5 Recommendations
        ↓
FastAPI
        ↓
Web Frontend

---

## ✨ Features

- Customer profile lookup
- Customer purchase history
- Product recommendations
- User-based collaborative filtering
- Cosine similarity
- Top 5 product recommendations
- Purchase analytics dashboard
- Most purchased products
- Category-wise purchase analysis
- Customer activity analysis
- Top recommended products
- REST API using FastAPI
- PostgreSQL database
- Interactive web dashboard
- Automated API and recommender tests

---

## 🛠️ Technologies Used

### Backend
- Python
- FastAPI
- Uvicorn

### Data Processing
- Pandas
- NumPy

### Machine Learning
- Scikit-learn
- Cosine Similarity
- User-Based Collaborative Filtering

### Database
- PostgreSQL
- SQLAlchemy
- Psycopg

### Frontend
- HTML
- CSS
- JavaScript
- Chart.js

### Testing
- Pytest

---

## 📁 Project Structure

```text
recommendation-system/
│
├── api/
│   ├── __init__.py
│   └── main.py
│
├── database/
│   ├── __init__.py
│   └── db_connection.py
│
├── models/
│   ├── __init__.py
│   ├── data_loader.py
│   └── recommender.py
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
│   ├── conftest.py
│   ├── test_api.py
│   └── test_recommender.py
│
├── .gitignore
├── .env
├── requirements.txt
└── README.md
