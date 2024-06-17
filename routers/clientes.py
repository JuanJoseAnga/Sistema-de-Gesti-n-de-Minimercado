from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import schemas.cliente as schemas
import models.cliente as models
from database import SessionLocal, engine

router = APIRouter()

# Función para obtener la sesión de la base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Crear cliente
@router.post("/crear_cliente/", status_code=status.HTTP_201_CREATED)
async def crear_cliente(cliente: schemas.ClienteBase, db: Session = Depends(get_db)):
    db_cliente = models.Cliente(**cliente.dict())
    db.add(db_cliente)
    db.commit()
    db.refresh(db_cliente)
    return db_cliente

# Listar todos los clientes
@router.get("/listado_clientes/", status_code=status.HTTP_200_OK)
async def listar_clientes(db: Session = Depends(get_db)):
    return db.query(models.Cliente).all()



# Consultar cliente por ID
@router.get("/consultar_cliente/{id_cliente}", status_code=status.HTTP_200_OK)
async def consultar_cliente_por_id(id_cliente: int, db: Session = Depends(get_db)):
    cliente = db.query(models.Cliente).filter(models.Cliente.id == id_cliente).first()
    if not cliente:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cliente no encontrado")
    return cliente

# Eliminar cliente por ID
@router.delete("/eliminar_cliente/{id_cliente}", status_code=status.HTTP_200_OK)
async def eliminar_cliente_por_id(id_cliente: int, db: Session = Depends(get_db)):
    cliente = db.query(models.Cliente).filter(models.Cliente.id == id_cliente).first()
    if not cliente:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cliente no encontrado")
    db.delete(cliente)
    db.commit()
    return {"detail": "Cliente eliminado exitosamente"}

# Actualizar cliente por ID
@router.put("/actualizar_cliente/{id_cliente}", status_code=status.HTTP_200_OK)
async def actualizar_cliente_por_id(id_cliente: int, cliente_update: schemas.ClienteBase, db: Session = Depends(get_db)):
    cliente = db.query(models.Cliente).filter(models.Cliente.id == id_cliente).first()
    if not cliente:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cliente no encontrado")
    for key, value in cliente_update.dict().items():
        setattr(cliente, key, value)
    db.commit()
    db.refresh(cliente)
    return cliente
