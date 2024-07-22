import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private baseUrl = 'http://localhost:8000/productos'; // Cambia esta URL según sea necesario

  constructor(private http: HttpClient) { }

  // Crear producto
  crearProducto(producto: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/registro_producto/`, producto);
  }

  // Listar productos
  listarProductos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/listado_productos/`);
  }

  // Consultar producto por ID
  consultarProducto(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/consultar_producto/${id}`);
  }

  // Eliminar producto por ID
  eliminarProducto(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/eliminar_producto/${id}`);
  }

  // Actualizar producto por ID
  actualizarProducto(id: number, producto: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/actualizar_producto/${id}`, producto);
  }
}
