from sqlalchemy import String, Integer, Column, Float, Text
from database import Base 


class Ingreso(Base):
    __tablename__="registrodeingreso"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(30))
    mail = Column(String(30))
    password = Column(String(30))
    cargo = Column(String(30))

#PROVEEDORES 
class Ingreso_proveedor(Base):
    _tablename_="proveedor"
    nombre = Column(String(30))
    contacto = Column(String(30))
    productos = Column(String(30))
    condiciones_pago = Column(String(30))
    ID = Column(Integer, primary_key=True, index=True)
                
#PRODUCTOS               
class Producto(Base):
    __tablename__ ="productos"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(50))
    precio = Column(Float)
    descripcion = Column(Text)
    stock = Column(Integer, nullable=False)