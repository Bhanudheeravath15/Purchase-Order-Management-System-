import os
import sys

# Ensure backend directory is in the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal, engine
import models
from models import Vendor, Product

def seed_db():
    print("Creating tables...")
    models.Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Check if vendors exist
        if db.query(Vendor).first():
            print("Database already seeded.")
            return
            
        vendors = [
            Vendor(name="Acme Corp", contact="contact@acme.com", rating=4.5),
            Vendor(name="Globex Corporation", contact="sales@globex.com", rating=4.8),
            Vendor(name="Soylent Corp", contact="info@soylent.com", rating=3.9)
        ]
        
        products = [
            Product(name="Widget A", sku="WID-A-100", unit_price=25.50, stock_level=150),
            Product(name="Widget B", sku="WID-B-200", unit_price=45.00, stock_level=80),
            Product(name="Gadget Pro", sku="GAD-P-300", unit_price=120.00, stock_level=30),
            Product(name="Super Gizmo", sku="GIZ-S-400", unit_price=85.75, stock_level=55)
        ]
        
        for v in vendors:
            db.add(v)
        for p in products:
            db.add(p)
            
        db.commit()
        print("Database seeded with sample Vendors and Products successfully!")
    except Exception as e:
        print(f"Error seeding DB: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
