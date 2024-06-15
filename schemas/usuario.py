from pydantic import BaseModel

class IngresoBase(BaseModel):
    nombre: str
    mail: str
    password: str
    cargo: str

class IngresoBase2(BaseModel):
    id: int
    nombre: str
    mail: str
    password: str
    cargo: str

class IngresoUpdate(BaseModel):
    nombre: str
    mail: str
    password: str
    cargo: str
