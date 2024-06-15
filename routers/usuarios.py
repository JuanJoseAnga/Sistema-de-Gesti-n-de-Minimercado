from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import schemas.usuario as schemas
import models.usuario as models
from database import SessionLocal, engine
from utils import get_password_hash

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/registro/", status_code=status.HTTP_201_CREATED)
async def crear_registro(registro: schemas.IngresoBase, db: Session = Depends(get_db)):
    hashed_password = get_password_hash(registro.password)
    db_registro = models.Ingreso(
        nombre=registro.nombre,
        mail=registro.mail,
        password=hashed_password,
        cargo=registro.cargo
    )
    db.add(db_registro)
    db.commit()
    db.refresh(db_registro)
    return {"message": "El registro se realizó exitosamente"}

# Función para obtener un registro por su ID
@router.get("/registro/{registro_id}", response_model=schemas.IngresoBase)
async def consultar_registro(registro_id: int, db: Session = Depends(get_db)):
    registro = db.query(models.Ingreso).filter(models.Ingreso.id == registro_id).first()
    if registro is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Registro no encontrado")
    return registro

# Función para listar todos los registros
@router.get("/registro/", response_model=list[schemas.IngresoBase])
async def listar_registros(db: Session = Depends(get_db)):
    return db.query(models.Ingreso).all()

# Función para eliminar un registro por su ID
@router.delete("/registro/{registro_id}", status_code=status.HTTP_204_NO_CONTENT)
async def eliminar_registro(registro_id: int, db: Session = Depends(get_db)):
    registro = db.query(models.Ingreso).filter(models.Ingreso.id == registro_id).first()
    if registro is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Registro no encontrado")
    db.delete(registro)
    db.commit()
    return None

# Función para actualizar un registro por su ID
@router.put("/registro/{registro_id}", response_model=schemas.IngresoBase)
async def actualizar_registro(registro_id: int, registro: schemas.IngresoBase, db: Session = Depends(get_db)):
    db_registro = db.query(models.Ingreso).filter(models.Ingreso.id == registro_id).first()
    if db_registro is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Registro no encontrado")
    
    db_registro.nombre = registro.nombre
    db_registro.mail = registro.mail
    db_registro.cargo = registro.cargo
    
    # Si se proporciona una nueva contraseña, se debe hashear
    if registro.password:
        hashed_password = get_password_hash(registro.password)
        db_registro.password = hashed_password
    
    db.commit()
    db.refresh(db_registro)
    return db_registro