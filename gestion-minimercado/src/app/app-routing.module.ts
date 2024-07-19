import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { ProveedoresComponent } from './proveedores/proveedores.component';
import { ProductosComponent } from './productos/productos.component';
import { ClientesComponent } from './clientes/clientes.component';

const routes: Routes = [
  { path: 'usuarios', component: UsuariosComponent },
  { path: 'proveedores', component: ProveedoresComponent },
  { path: 'productos', component: ProductosComponent },
  { path: 'clientes', component: ClientesComponent },
  { path: '', redirectTo: '/usuarios', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
