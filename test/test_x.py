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
    assert response.status_code == 201  # Corregido aquí, elimina el espacio en blanco
