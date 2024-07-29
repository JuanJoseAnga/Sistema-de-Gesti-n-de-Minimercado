import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private baseUrl = 'http://localhost:8000/usuarios'; // Cambia esta URL según sea necesario

  constructor(private http: HttpClient) { }

  // Crear usuario
  crearusuario(usuario: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/crear_usuario/`, usuario);
  }

  // Listar usuarios
  listarusuarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/listado_usuarios/`);
  }

  // Consultar usuario por ID
  consultarusuario(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/consultar_usuario/${id}`);
  }

  // Eliminar usuario por ID
  eliminarusuario(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/eliminar_usuario/${id}`);
  }

  // Actualizar usuario por ID
  actualizarusuario(id: number, usuario: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/actualizar_usuario/${id}`, usuario);
  }
}
