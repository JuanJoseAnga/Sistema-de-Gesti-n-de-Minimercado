from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import schemas.proveedor as schemas
import models.proveedor as models
from database import SessionLocal, engine

router = APIRouter()

# Función para obtener la sesión de la base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Crear proveedor
@router.post("/registro_proveedor/", status_code=status.HTTP_201_CREATED)
async def crear_proveedor(proveedor: schemas.ProveedorBase, db: Session = Depends(get_db)):
    db_proveedor = models.Ingreso_proveedor(**proveedor.dict())
    db.add(db_proveedor)
    db.commit()
    return {"detail": "El proveedor se registró exitosamente"}

# Listar todos los proveedores
@router.get("/listado_proveedores/", status_code=status.HTTP_200_OK)
async def listar_proveedores(db: Session = Depends(get_db)):
    return db.query(models.Ingreso_proveedor).all()

# Consultar proveedor por ID
@router.get("/consultar_proveedor/{id_proveedor}", status_code=status.HTTP_200_OK)
async def consultar_proveedor_por_id(id_proveedor: int, db: Session = Depends(get_db)):
    proveedor = db.query(models.Ingreso_proveedor).filter(models.Ingreso_proveedor.ID == id_proveedor).first()
    if not proveedor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Proveedor no encontrado")
    return proveedor

# Eliminar proveedor por ID
@router.delete("/eliminar_proveedor/{id_proveedor}", status_code=status.HTTP_200_OK)
async def eliminar_proveedor_por_id(id_proveedor: int, db: Session = Depends(get_db)):
    proveedor = db.query(models.Ingreso_proveedor).filter(models.Ingreso_proveedor.ID == id_proveedor).first()
    if not proveedor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Proveedor no encontrado")
    db.delete(proveedor)
    db.commit()
    return {"detail": "Proveedor eliminado exitosamente"}

# Actualizar proveedor por ID
@router.put("/actualizar_proveedor/{id_proveedor}", status_code=status.HTTP_200_OK)
async def actualizar_proveedor_por_id(id_proveedor: int, proveedor_update: schemas.ProveedorUpdate, db: Session = Depends(get_db)):
    proveedor = db.query(models.Ingreso_proveedor).filter(models.Ingreso_proveedor.ID == id_proveedor).first()
    if not proveedor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Proveedor no encontrado")
    for key, value in proveedor_update.dict().items():
        setattr(proveedor, key, value)
    db.commit()
    db.refresh(proveedor)
    return proveedor
