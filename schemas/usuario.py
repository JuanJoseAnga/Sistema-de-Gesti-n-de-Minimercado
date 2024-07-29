from pydantic import BaseModel

class UsuarioBase(BaseModel):
    nombre: str
    mail: str
    password: str
    cargo: str
class UsuarioInDB(UsuarioBase):
    id: int
    class Config:
        orm_mode = True


