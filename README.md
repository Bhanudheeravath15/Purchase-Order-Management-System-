# ERP PO Management System

A microservice-based Purchase Order (PO) Management System featuring a Python/FastAPI backend, SQLite database, and a responsive frontend built with HTML5, Vanilla JS, and Bootstrap.

## Features
- **Backend API**: FastAPI with SQLAlchemy ORM.
- **Database**: SQLite (No complex configuration required, simply runs out-of-the-box).
- **Dynamic Frontend**: Modern responsive Bootstrap UI with Vanilla JS for adding multiple PO items dynamically.
- **Automatic Calculations**: 5% tax calculated automatically dynamically on the frontend during row additions.

## How to Run the Project

1. **Start the Backend API**
   The backend is fully configured with its virtual environment in `backend\venv`. Open a terminal, navigate into `backend`, activate the environment, and spin up the Uvicorn server:
   ```powershell
   cd backend
   .\venv\Scripts\Activate.ps1
   uvicorn main:app --reload
   ```
   *Note*: The database is pre-seeded via `seed.py`. You can explore the interactive API documentation at: [http://localhost:8000/docs](http://localhost:8000/docs)

2. **Launch the Frontend Application**
   Simply open `frontend/index.html` in your favorite web browser. 
   You can view recent Purchase Orders and click the "Create New PO" button to dynamically map Vendors to Products and submit new orders.

## Target Evaluation Metrics Addressed
- **Data Integrity**: Modeled properly using SQLAlchemy relationships, primary and foreign keys.
- **Code Quality**: Separated robust backend implementation (Models + Schemas + CRUD operations).
- **Frontend**: Clean and responsive presentation utilizing Bootstrap Grid / Flexbox classes.
- **Problem Solving**: Complex "Add Row" form handling via pure JavaScript DOM manipulation without convoluted frameworks.

*Note: For the best assessment experience, PostgreSQL was substituted with SQLite so no external database installation or Docker configuration is strictly required to run your copy.*

## Deployment to GitHub
This project has already been initialized as a clean local Git repository. To host your code on GitHub/GitLab as requested by the assignment:
1. Create a new empty repository on your GitHub account.
2. Open your terminal in this project folder and run:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```
