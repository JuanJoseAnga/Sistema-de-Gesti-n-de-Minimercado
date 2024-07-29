from pydantic import BaseModel

class ProveedorBase(BaseModel):
    nombre: str
    contacto: str
    productos: str
    condiciones_pago: str

class ProveedorInDB(ProveedorBase):
    ID:int
    class Config:
        orm_mode = True
