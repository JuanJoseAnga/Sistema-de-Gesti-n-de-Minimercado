from fastapi import FastAPI
from routers import usuarios, proveedores, productos, clientes
from database import engine, Base

def create_app():
    # Crea todas las tablas en la base de datos
    Base.metadata.create_all(bind=engine)

    # Inicializa la aplicación FastAPI
    app = FastAPI(
        title="API de Gestión",
        description="API para la gestión de usuarios, proveedores, productos y clientes.",
        version="1.0.0",
    )

    # Incluye los routers correspondientes
    app.include_router(usuarios.router, prefix="/usuarios", tags=["Usuarios"])
    app.include_router(proveedores.router, prefix="/proveedores", tags=["Proveedores"])
    app.include_router(productos.router, prefix="/productos", tags=["Productos"])
    app.include_router(clientes.router, prefix="/clientes", tags=["Clientes"])

    return app

# Crea la instancia de la aplicación
app = create_app()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
