from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Vercel's serverless environment is strictly Read-Only except for the /tmp folder!
# Switched to SQLite to ensure it runs out-of-the-box without Docker required.
if os.environ.get("VERCEL") == "1":
    SQLALCHEMY_DATABASE_URL = "sqlite:////tmp/po_db.sqlite"
else:
    SQLALCHEMY_DATABASE_URL = "sqlite:///./po_db.sqlite"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
