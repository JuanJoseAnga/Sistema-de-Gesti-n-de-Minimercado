from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import schemas.producto as schemas
import models.producto as models
from database import SessionLocal, engine

router = APIRouter()

# Función para obtener la sesión de la base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Crear producto
@router.post("/registro_producto/", status_code=status.HTTP_201_CREATED)
async def crear_producto(producto: schemas.ProductoCreate, db: Session = Depends(get_db)):
    db_producto = models.Producto(**producto.dict())
    db.add(db_producto)
    db.commit()
    db.refresh(db_producto)
    return db_producto

# Listar todos los productos
@router.get("/listado_productos/", status_code=status.HTTP_200_OK)
async def listar_productos(db: Session = Depends(get_db)):
    return db.query(models.Producto).all()

# Consultar producto por ID
@router.get("/consultar_producto/{id_producto}", response_model=schemas.ProductoInDB, status_code=status.HTTP_200_OK)
async def consultar_producto_por_id(id_producto: int, db: Session = Depends(get_db)):
    producto = db.query(models.Producto).filter(models.Producto.id == id_producto).first()
    if not producto:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Producto no encontrado")
    return producto

# Eliminar producto por ID
@router.delete("/eliminar_producto/{id_producto}", status_code=status.HTTP_200_OK)
async def eliminar_producto_por_id(id_producto: int, db: Session = Depends(get_db)):
    producto = db.query(models.Producto).filter(models.Producto.id == id_producto).first()
    if not producto:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Producto no encontrado")
    db.delete(producto)
    db.commit()
    return {"detail": "Producto eliminado exitosamente"}

# Actualizar producto por ID
@router.put("/actualizar_producto/{id_producto}", response_model=schemas.ProductoInDB, status_code=status.HTTP_200_OK)
async def actualizar_producto_por_id(id_producto: int, producto_update: schemas.ProductoBase, db: Session = Depends(get_db)):
    producto = db.query(models.Producto).filter(models.Producto.id == id_producto).first()
    if not producto:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Producto no encontrado")
    for key, value in producto_update.dict().items():
        setattr(producto, key, value)
    db.commit()
    db.refresh(producto)
    return producto
