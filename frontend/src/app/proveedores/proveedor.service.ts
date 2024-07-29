import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {
  private baseUrl = 'http://localhost:8000/proveedores'; // Cambia esta URL según sea necesario

  constructor(private http: HttpClient) { }

  // Crear proveedor
  crearProveedor(producto: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/registro_proveedor/`, producto);
  }

  // Listar proveedores
  listarProveedores(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/listado_proveedores/`);
  }

  // Consultar proveedor por ID
  consultarProveedor(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/consultar_proveedor/${id}`);
  }

  // Eliminar proveedor por ID
  eliminarProveedor(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/eliminar_proveedor/${id}`);
  }

  // Actualizar proveedor por ID
  actualizarProveedor(id: number, producto: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/actualizar_proveedor/${id}`, producto);
  }
}
