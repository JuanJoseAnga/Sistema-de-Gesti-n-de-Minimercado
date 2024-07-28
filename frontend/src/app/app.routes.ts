import { Routes } from '@angular/router';
import { ProductosComponent } from './productos/productos.component';
import { ClientesComponent } from './clientes/clientes.component';
import { UsuariosComponent } from './usuario/usuario.component';
export const routes: Routes = [
  { path: 'productos', component: ProductosComponent },
  { path: 'clientes', component: ClientesComponent },
  { path: 'usuarios', component: UsuariosComponent }
];