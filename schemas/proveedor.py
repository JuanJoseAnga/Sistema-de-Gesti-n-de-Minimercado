from pydantic import BaseModel

class ProveedorBase(BaseModel):
    nombre: str
    contacto: str
    productos: str
    condiciones_pago: str

class ProveedorUpdate(BaseModel):
    nombre: str
    contacto: str
    productos: str
    condiciones_pago: str
