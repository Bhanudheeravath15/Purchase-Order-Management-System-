# ERP PO Management System

**🔗 Live Dashboard Application Link:** [https://purchase-order-management-system-pl.vercel.app](https://purchase-order-management-system-pl.vercel.app)
*(The project is securely deployed and hosted on Vercel)*

A microservice-based Purchase Order (PO) Management System featuring a Python/FastAPI backend, SQLite database, and a responsive frontend built with HTML5, Vanilla JS, and Bootstrap.

## Features
- **Backend API**: FastAPI with SQLAlchemy ORM.
- **Database**: SQLite (No complex configuration required, simply runs out-of-the-box).
- **Dynamic Frontend**: Modern responsive Bootstrap UI with Vanilla JS for adding multiple PO items dynamically.
- **Automatic Calculations**: 5% tax calculated automatically dynamically on the frontend during row additions.

## How to View the Live Project

You do not need to install or run anything locally. The project is fully deployed and hosted on Vercel:
- **Main Application:** [https://purchase-order-management-system-pl.vercel.app](https://purchase-order-management-system-pl.vercel.app)
- **Interactive API Documentation (Swagger UI):** [https://purchase-order-management-system-pl.vercel.app/docs](https://purchase-order-management-system-pl.vercel.app/docs)

## System Architecture

- **Data Integrity**: Modeled properly using SQLAlchemy relationships, primary and foreign keys. SQLite is used as the lightweight database layer to ensure immediate Vercel Serverless compatibility.
- **Code Structure**: Clear separation of concerns in the backend architecture (Models + Schemas + CRUD actions) keeps the FastAPI application extremely light and performant.
- **Frontend Presentation**: Clean, responsive, and mobile-friendly layout utilizing the Bootstrap grid system.
- **Dynamic Interactions**: Complex form state handling (adding new rows dynamically, auto-calculating taxes) is controlled entirely via Vanilla JavaScript DOM manipulation and Fetch APIs, keeping the client footprint minimal.

---
*Developed and maintained by Bhanu Prakash.*
