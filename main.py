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
    cargo:str

#ACTUALIZACION
class IngresoBase2(BaseModel):
    id:int
    nombre:str
    mail:str
    password:str
    cargo:str

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
    cargo:str

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


#PROVEEDORES 


# NUEVO REGISTRO
class ProveedorBase(BaseModel):
    nombre: str
    contacto: str
    productos: str
    condiciones_pago: str

# ACTUALIZACION
class ProveedorUpdate(BaseModel):
    nombre: str
    contacto: str
    productos: str
    condiciones_pago: str

# Crear nuevo proveedor
@app.post("/Registro proveedor/", status_code=status.HTTP_201_CREATED)
async def crear_proveedor(proveedor: ProveedorBase, db: db_dependency):
    db_proveedor = models.Ingreso_proveedor(**proveedor.dict())
    db.add(db_proveedor)
    db.commit()
    return {"detail": "El proveedor se registró exitosamente"}

# Listar todos los proveedores
@app.get("/Listado de proveedores/", status_code=status.HTTP_200_OK)
async def listar_proveedores(db: db_dependency):
    proveedores = db.query(models.Ingreso_proveedor).all()
    return proveedores

# Consultar proveedor por ID
@app.get("/Consultar proveedor/{id_proveedor}", status_code=status.HTTP_200_OK)
async def consultar_proveedor_por_id(id_proveedor: int, db: db_dependency):
    proveedor = db.query(models.Ingreso_proveedor).filter(models.Ingreso_proveedor.ID == id_proveedor).first()
    if proveedor is None:
        raise HTTPException(status_code=404, detail="Proveedor no encontrado")
    return proveedor

# Eliminar proveedor por ID
@app.delete("/Eliminar proveedor/{id_proveedor}", status_code=status.HTTP_200_OK)
async def eliminar_proveedor_por_id(id_proveedor: int, db: db_dependency):
    proveedor_borrar = db.query(models.Ingreso_proveedor).filter(models.Ingreso_proveedor.ID == id_proveedor).first()
    if proveedor_borrar is None:
        raise HTTPException(status_code=404, detail="Proveedor no encontrado")
    db.delete(proveedor_borrar)
    db.commit()
    return {"detail": "Proveedor eliminado exitosamente"}

# Actualizar proveedor por ID
@app.put("/Actualizar proveedor/{id_proveedor}", status_code=status.HTTP_200_OK)
async def actualizar_proveedor_por_id(id_proveedor: int, proveedor_update: ProveedorUpdate, db: db_dependency):
    proveedor = db.query(models.Ingreso_proveedor).filter(models.Ingreso_proveedor.ID == id_proveedor).first()
    if proveedor is None:
        raise HTTPException(status_code=404, detail="Proveedor no encontrado")

    for key, value in proveedor_update.dict().items():
        setattr(proveedor, key, value)

    db.commit()
    db.refresh(proveedor)
    return proveedor


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

# NUEVO REGISTRO
class Producto(BaseModel):
    nombre: str
    contacto: str
    productos: str
    condiciones_pago: str

# ACTUALIZACION
class ProductoUpdate(BaseModel):
    nombre: str
    contacto: str
    productos: str
    condiciones_pago: str

# Crear producto
@app.post("/registro_producto/", status_code=status.HTTP_201_CREATED)
async def crear_producto(producto: ProductoCreate, db: Session = Depends(get_db)):
    db_producto = Producto(**producto.dict())
    db.add(db_producto)
    db.commit()
    db.refresh(db_producto)
    return {"detail": "El producto se registró exitosamente", "producto": db_producto}

# Listar todos los productos
@app.get("/listado_productos/", response_model=List[ProductoInDB], status_code=status.HTTP_200_OK)
async def listar_productos(db: Session = Depends(get_db)):
    productos = db.query(Producto).all()
    return productos

# Consultar producto por ID
@app.get("/consultar_producto/{id_producto}", response_model=ProductoInDB, status_code=status.HTTP_200_OK)
async def consultar_producto_por_id(id_producto: int, db: Session = Depends(get_db)):
    producto = db.query(Producto).filter(Producto.id == id_producto).first()
    if producto is None:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return producto

# Eliminar producto por ID
@app.delete("/eliminar_producto/{id_producto}", status_code=status.HTTP_200_OK)
async def eliminar_producto_por_id(id_producto: int, db: Session = Depends(get_db)):
    producto_borrar = db.query(Producto).filter(Producto.id == id_producto).first()
    if producto_borrar is None:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    db.delete(producto_borrar)
    db.commit()
    return {"detail": "Producto eliminado exitosamente"}

# Actualizar producto por ID
@app.put("/actualizar_producto/{id_producto}", response_model=ProductoInDB, status_code=status.HTTP_200_OK)
async def actualizar_producto_por_id(id_producto: int, producto_update: ProductoUpdate, db: Session = Depends(get_db)):
    producto = db.query(Producto).filter(Producto.id == id_producto).first()
    if producto is None:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    for key, value in producto_update.dict().items():
        setattr(producto, key, value)

    db.commit()
    db.refresh(producto)
    return producto

