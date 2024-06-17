from models.cliente import Cliente
#CLIENTES 
def test_listar_clientes(client):
    response = client.get("/clientes/listado_clientes/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_crear_cliente(client):
    new_user = {
        "id": 1,
        "nombre": "Jossue Simancas",
        "telefono": "096398899",
        "direccion": "Quitumbe",
        "email": "travieso@gmail.com"
    }
    response = client.post("/clientes/crear_cliente/", json=new_user)
    assert response.status_code == 201  

def test_consultar_cliente_por_id(client):
    # Primero, creamos un cliente para consultar
    new_cliente = {
        "nombre": "Erick Llano",
        "telefono": "0963984598",
        "direccion": "Quitumbe",
        "email": "ericktravieso@gmail.com"
    }
    post_response = client.post("/clientes/crear_cliente/", json=new_cliente)
    assert post_response.status_code == 201  
    created_cliente = post_response.json()
    
    # Ahora consultamos el cliente recién creado por su ID
    response = client.get(f"/clientes/consultar_cliente/{created_cliente['id']}")
    assert response.status_code == 200  # El código de estado correcto para una consulta exitosa
    assert response.json()["nombre"] == new_cliente["nombre"]


def test_actualizar_cliente_por_id(client):
    # Primero, creamos un cliente para actualizar
    new_cliente = {
        "nombre": "Erick Llano",
        "telefono": "0963984598",
        "direccion": "Quitumbe",
        "email": "ericktravieso@gmail.com"
    }
    client.post("/clientes/crear_cliente/", json=new_cliente)

    # Datos para actualizar
    updated_cliente = {
        "nombre": "Erick Actualizado",
        "telefono": "0987654321",
        "direccion": "Centro",
        "email": "erickactualizado@gmail.com"
        
    }
    response = client.put("/clientes/actualizar_cliente/1", json=updated_cliente)
    assert response.status_code == 200
    assert response.json()["nombre"] == updated_cliente["nombre"]


def test_eliminar_cliente_por_id(client):
    # Primero, creamos un cliente para eliminar
    new_cliente = {
        "nombre": "Erick Llano",
        "telefono": "0963984598",
        "direccion": "Quitumbe",
        "email": "ericktravieso@gmail.com"
    }
    client.post("/clientes/crear_cliente/", json=new_cliente)

    response = client.delete("/clientes/eliminar_cliente/1")
    assert response.status_code == 200
    assert response.json()["detail"] == "Cliente eliminado exitosamente"

    # Verificamos que el cliente ya no existe
    response = client.get("/clientes/consultar_cliente/1")
    assert response.status_code == 404
