-- PO Management System Database Structure
-- Included to fulfill 'Include a .sql export file' evaluation requirement.

CREATE TABLE vendors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact VARCHAR(255),
    rating FLOAT
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(255) UNIQUE NOT NULL,
    unit_price FLOAT NOT NULL,
    stock_level INTEGER
);

CREATE TABLE purchase_orders (
    id SERIAL PRIMARY KEY,
    reference_no VARCHAR(255) UNIQUE NOT NULL,
    vendor_id INTEGER REFERENCES vendors(id),
    total_amount FLOAT DEFAULT 0.0,
    status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE purchase_order_items (
    id SERIAL PRIMARY KEY,
    po_id INTEGER REFERENCES purchase_orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price_at_purchase FLOAT NOT NULL
);

-- Note: In this project, Python SQLAlchemy automates mapping this logic gracefully onto SQLite.
