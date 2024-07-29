from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import schemas.usuario as schemas
import models.usuario as models
from database import SessionLocal, engine
from utils import get_password_hash
from typing import List
router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/crear_usuario/", status_code=status.HTTP_201_CREATED)
async def crear_usuario(usuario: schemas.UsuarioBase, db: Session = Depends(get_db)):
    hashed_password = get_password_hash(usuario.password)
    db_usuario = models.Usuario(**usuario.dict())
    db.add(db_usuario)
    db.commit()
    db.refresh(db_usuario)
    return db_usuario

# Función para obtener un usuario por su ID
@router.get("/consultar_usuario/{id_usuario}",status_code=status.HTTP_200_OK)
async def consultar_usuario(id_usuario: int, db: Session = Depends(get_db)):
    usuario = db.query(models.Usuario).filter(models.Usuario.id == id_usuario).first()
    if usuario is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="usuario no encontrado")
    return usuario

# Función para listar todos los usuarios
@router.get("/listado_usuarios/", status_code=status.HTTP_200_OK)
async def listar_usuarios(db: Session = Depends(get_db)):
    return db.query(models.Usuario).all()

# Función para eliminar un usuario por su ID
@router.delete("/eliminar_usuario/{id_usuario}", status_code=status.HTTP_200_OK)
async def eliminar_usuario(id_usuario: int, db: Session = Depends(get_db)):
    usuario = db.query(models.Usuario).filter(models.Usuario.id == id_usuario).first()
    if not usuario:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="usuario no encontrado")
    db.delete(usuario)
    db.commit()
    return None

# Función para actualizar un usuario por su ID
@router.put("/actualizar_usuario/{id_usuario}", response_model=schemas.UsuarioInDB,status_code=status.HTTP_200_OK)
async def actualizar_usuario(id_usuario: int, usuario: schemas.UsuarioBase, db: Session = Depends(get_db)):
    db_usuario = db.query(models.Usuario).filter(models.Usuario.id == id_usuario).first()
    if db_usuario is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="usuario no encontrado")
    
    db_usuario.nombre = usuario.nombre
    db_usuario.mail = usuario.mail
    db_usuario.cargo = usuario.cargo
    
    # Si se proporciona una nueva contraseña, se debe hashear
    if usuario.password:
        hashed_password = get_password_hash(usuario.password)
        db_usuario.password = hashed_password
    
    db.commit()
    db.refresh(db_usuario)
    return db_usuario