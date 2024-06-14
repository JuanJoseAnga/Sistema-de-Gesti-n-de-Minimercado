from fastapi import FastAPI, HTTPException, Depends, status
from pydantic import BaseModel
from typing import Annotated
import models
from database import engine, SessionLocal
from sqlalchemy.orm import Session

app = FastAPI()

#NUEVO REGISTRO
class IngresoBase(BaseModel):
    nombre:str
    mail:str
    password:str

#ACTUALIZACION
class IngresoBase2(BaseModel):
    id:int
    nombre:str
    mail:str
    password:str

def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

@app.post("/registro/", status_code=status.HTTP_201_CREATED)
async def crear_registro(registro:IngresoBase, db:db_dependency):
    db_registro = models.Ingreso(**registro.dict())
    db.add(db_registro)
    db.commit()
    return " El registro se realizo exitosamente"

@app.get("/listarregistros/", status_code=status.HTTP_200_OK)
async def consultar_registro(db:db_dependency):
    registros = db.query(models.Ingreso).all()
    return registros

@app.get("/consultaregistro/{id_ingreso}", status_code=status.HTTP_200_OK)
async def consultar_registro_por_id(id_ingreso, db:db_dependency):
    registro = db.query(models.Ingreso).filter(models.Ingreso.id==id_ingreso).first()
    if registro is None:
        HTTPException(status_code=404, detail="Registro no encontrado")
    return registro

@app.delete("/eliminarregistro/{id_ingreso}", status_code=status.HTTP_200_OK)
async def eliminar_registro_por_id(id_ingreso, db:db_dependency):
    registroborrar = db.query(models.Ingreso).filter(models.Ingreso.id == id_ingreso).first()
    if registroborrar is None:
        raise HTTPException(status_code=404, detail="Registro no encontrado")
    db.delete(registroborrar)
    db.commit()
    return {"detail": "Registro eliminado exitosamente"}


class IngresoUpdate(BaseModel):
    # Define aquí los campos que deseas actualizar
    nombre: str
    mail:str
    password:str

@app.put("/actualizarregistro/{id_ingreso}", status_code=status.HTTP_200_OK)
async def actualizar_registro_por_id(id_ingreso, ingreso_update: IngresoUpdate, db:db_dependency):
    registro = db.query(models.Ingreso).filter(models.Ingreso.id == id_ingreso).first()
    if registro is None:
        raise HTTPException(status_code=404, detail="Registro no encontrado")
    
    # Actualiza los campos del registro
    for key, value in ingreso_update.dict().items():
        setattr(registro, key, value)
    
    db.commit()
    db.refresh(registro)
    return registro




