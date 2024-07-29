from sqlalchemy import Column, Integer, String, Float, Text
from database import Base

class Producto(Base):
    __tablename__ = "productos"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(50))
    precio = Column(Float)
    descripcion = Column(Text)
    stock = Column(Integer, nullable=False)