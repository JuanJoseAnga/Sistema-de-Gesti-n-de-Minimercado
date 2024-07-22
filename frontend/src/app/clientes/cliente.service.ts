import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private baseUrl = 'http://localhost:8000/clientes'; // Cambia esta URL según sea necesario

  constructor(private http: HttpClient) { }

  // Crear cliente
  crearCliente(producto: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/crear_cliente/`, producto);
  }

  // Listar clientes
  listarClientes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/listado_clientes/`);
  }

  // Consultar cliente por ID
  consultarCliente(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/consultar_cliente/${id}`);
  }

  // Eliminar cliente por ID
  eliminarCliente(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/eliminar_cliente/${id}`);
  }

  // Actualizar cliente por ID
  actualizarCliente(id: number, producto: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/actualizar_cliente/${id}`, producto);
  }
}
