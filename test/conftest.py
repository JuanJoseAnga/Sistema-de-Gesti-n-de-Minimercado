import os
import sys
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
# Insert the project directory into sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../')))
from main import create_app
from database import Base, get_db


# Create a new database engine for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})

# Create a new SessionLocal class for testing
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Dependency override to use the testing database
def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

@pytest.fixture(scope="module")
def client():
    app = create_app()
    app.dependency_overrides[get_db] = override_get_db
    
    # Create the tables in the test database
    Base.metadata.create_all(bind=engine)
    
    client = TestClient(app)
    
    yield client
    
    # Drop the tables in the test database
    Base.metadata.drop_all(bind=engine)
