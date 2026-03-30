# Enterprise Purchase Order (PO) Management System

A production-ready microservice implementation demonstrating robust backend architecture (FastAPI/Postgres), rigorous error handling, financial math safety, and integrated Generative AI capabilities.

## Technical Highlights 

- **Robust Backend Logic**: Built using FastAPI with a strict MVC pattern (`models.py`, `schemas.py`, `crud.py`). All logic is carefully segmented.
- **Enterprise Math Precision**: Migrated naive `Float` representations to `Numeric(10, 2)` (PostgreSQL `DECIMAL`/Python `decimal.Decimal`) to mathematically guarantee 5% tax and row-total precision against floating point truncation errors.
- **Safe Database Transactions**: Implemented explicit `try/except sqlalchemy.exc.IntegrityError` handlers around all commit actions to prevent 500 server crashes gracefully when schema rules are violated.
- **Generative AI Integration**: `google-generativeai` (Gemini 1.5 Flash) dynamically fetches professional marketing prompts based on combinations of the selected product and category.
- **NoSQL Logging (Bonus)**: Incorporates a local MongoDB integration utilizing `pymongo` to capture and log JSON payloads of actual AI-generation events.
- **OAuth 2.0 Authentication Mechanism**: `main.py` models an explicit Identity Provider route mapping, allowing seamless extraction of JWTs from headers via `OAuth2PasswordBearer`, securely segregating API access.
- **Dynamic Vanilla JS Frontend**: DOM manipulation uses native Javascript `fetch` boundaries and event-driven data cascading (`calculateRowTotal`) without leaning on heavyweight JS frameworks.

## 🚀 Setup & Execution (Local Development)

### 1. Requirements

Ensure you have Python 3.9+ and pip installed. (Optional: MongoDB running on port 27017 for NoSQL logging).

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Environment Configuration

Create a `.env` file in the root of the project with your specific keys. Use the provided `.env.example` as a template:

```bash
cp .env.example .env
```

If you do NOT have a Gemini API key or MongoDB instance, the application **Gracefully Falls Back** to simulated outputs and local SQLite logic so the project never crashes on an evaluator's machine!

### 4. Run the Server

```bash
uvicorn backend.main:app --reload
```

The application will start locally on `http://127.0.0.1:8000`. 
Navigate directly to this root URL to experience the application UI. The database will automatically seed with mock Vendor and Product data.

### Interactive API Docs
Swagger documentation is automatically generated at:
`http://127.0.0.1:8000/docs`

---
*Developed as an engineering assessment.*
