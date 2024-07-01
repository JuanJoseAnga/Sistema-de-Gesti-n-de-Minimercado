from sqlalchemy import Column, Integer, String
from database import Base

class Cliente(Base):
    __tablename__ = "cliente"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(50))
    direccion = Column(String(50))
    telefono = Column(String(10))
    email = Column(String(50))

