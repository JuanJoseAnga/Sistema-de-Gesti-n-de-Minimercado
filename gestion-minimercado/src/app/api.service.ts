import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseURL = 'http://localhost:8000';

  constructor() { }

  getUsuarios() {
    return axios.get(`${this.baseURL}/usuarios`);
  }

  getProveedores() {
    return axios.get(`${this.baseURL}/proveedores`);
  }

  getProductos() {
    return axios.get(`${this.baseURL}/productos`);
  }

  getClientes() {
    return axios.get(`${this.baseURL}/clientes`);
  }
}
