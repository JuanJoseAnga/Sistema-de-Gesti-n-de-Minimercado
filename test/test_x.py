def test_listar_clientes(client):
    response = client.get("/clientes/listado_clientes/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_crear_usuario(client):
    new_user = {
        "nombre": "Erick Llano",
        "telefono": "0963984598",
        "direccion": "Quitumbe",
        "id": 1,
        "email": "ericktravieso@gmail.com"
    }
    response = client.post("/clientes/crear_cliente/", json=new_user)
    assert response.status_code == 201  

# def test_crear_proveedor(client):
#     new_prov ={
#         "nombre": "Proveedor de prueba",
#         "contacto": "Contacto de prueba",
#         "productos": "Productos de prueba",
#         "condiciones_pago": "Condiciones pago  de prueba"
#     }
#     response=client.post("/proveedores/registro_proveedor/", json=new_prov)
#     assert response.status_code == 201

# def test_listar_proveedores(client):
#     response = client.get("/proveedores/listado_proveedores/")
#     assert response.status_code == 200
#     assert isinstance(response.json(), list)



##################################### PRODUCTOS #####################################

def test_crear_producto(client):
    new_producto = {
        "nombre": "Producto de Prueba",
        "precio": 100.0,
        "descripcion": "Descripción del producto de prueba",
        "stock": 50
    }
    response = client.post("/productos/registro_producto/", json=new_producto)
    print(f"Crear producto respuesta JSON: {response.json()}")  # Imprimir el contenido de la respuesta para depurar
    assert response.status_code == 201
    data = response.json()
    assert data["nombre"] == new_producto["nombre"]
    assert data["precio"] == new_producto["precio"]
    assert data["descripcion"] == new_producto["descripcion"]
    assert data["stock"] == new_producto["stock"]
 
def test_listar_productos(client):
    response = client.get("productos/listado_productos/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

# def test_consultar_producto_por_id(client, db):
#     # Crear un producto de prueba
#     new_producto = Producto(nombre="Producto de Prueba", precio=100, descripcion="Descripción del producto de prueba")
#     db.add(new_producto)
#     db.commit()
#     db.refresh(new_producto)
    
#     response = client.get(f"/consultar_producto/{new_producto.id}")
#     assert response.status_code == 200
#     data = response.json()
#     assert data["nombre"] == new_producto.nombre
#     assert data["precio"] == new_producto.precio
#     assert data["descripcion"] == new_producto.descripcion

# def test_eliminar_producto_por_id(client, db):
#     # Crear un producto de prueba
#     new_producto = Producto(nombre="Producto de Prueba", precio=100, descripcion="Descripción del producto de prueba")
#     db.add(new_producto)
#     db.commit()
#     db.refresh(new_producto)
    
#     response = client.delete(f"/eliminar_producto/{new_producto.id}")
#     assert response.status_code == 200
#     data = response.json()
#     assert data["detail"] == "Producto eliminado exitosamente"

# def test_actualizar_producto_por_id(client, db):
#     # Crear un producto de prueba
#     new_producto = Producto(nombre="Producto de Prueba", precio=100, descripcion="Descripción del producto de prueba")
#     db.add(new_producto)
#     db.commit()
#     db.refresh(new_producto)
    
#     # Actualizar el producto
#     updated_producto = {
#         "nombre": "Producto Actualizado",
#         "precio": 150,
#         "descripcion": "Descripción actualizada del producto"
#     }
#     response = client.put(f"/actualizar_producto/{new_producto.id}", json=updated_producto)
#     assert response.status_code == 200
#     data = response.json()
#     assert data["nombre"] == updated_producto["nombre"]
#     assert data["precio"] == updated_producto["precio"]
#     assert data["descripcion"] == updated_producto["descripcion"]
