from pydantic import BaseModel

class ProductoBase(BaseModel):
    nombre: str
    precio: float
    descripcion: str
    stock: int

class ProductoCreate(ProductoBase):
    pass

class ProductoUpdate(ProductoBase):
    pass

class ProductoInDB(ProductoBase):
    id: int

    class Config:
        orm_mode = True
