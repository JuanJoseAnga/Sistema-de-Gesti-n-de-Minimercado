from pydantic import BaseModel

class ClienteBase(BaseModel):
    nombre: str
    email: str
    direccion: str
    telefono: str

class ClienteInDB(ClienteBase):
    id: int

    class Config:
        orm_mode = True
