from sqlalchemy import Column, Integer, String
from database import Base

class Ingreso_proveedor(Base):
    __tablename__ = "proveedor"
    ID = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(30))
    contacto = Column(String(30))
    productos = Column(String(30))
    condiciones_pago = Column(String(30))