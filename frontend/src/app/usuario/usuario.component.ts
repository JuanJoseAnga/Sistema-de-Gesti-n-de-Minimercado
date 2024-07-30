import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuarioService } from './usuario.service';
import { HttpClientModule } from '@angular/common/http'; // Importa HttpClientModule

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,HttpClientModule],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css'
})
export class UsuariosComponent implements OnInit {
  showRegisterForm = false;
  showUpdateForm = false;
  showListForm = true; // Inicialmente mostramos la lista de clientes
  showConsultForm = false; // Estado para mostrar el formulario de consulta
  showClearButton = false; // Estado para mostrar el botón de limpieza

  registerForm: FormGroup;
  consultForm: FormGroup;
  deleteForm: FormGroup;
  updateForm: FormGroup;

  usuarios: any[] = [];
  usuarioConsultado: any; // Variable para almacenar el usuario consultado

  constructor(private fb: FormBuilder, private usuarioService: UsuarioService) {
    this.registerForm = this.fb.group({
      registerName: ['', Validators.required],
      registerMail: ['', Validators.required],
      registerPassword: ['', Validators.required],
      registerCargo: ['', Validators.required]
    });

    this.consultForm = this.fb.group({
      consultId: ['', Validators.required]
    });

    this.deleteForm = this.fb.group({
      deleteId: ['', Validators.required]
    });

    this.updateForm = this.fb.group({
      updateId: ['', Validators.required],
      updateName: [''],
      updateMail: [''],
      updatePassword: [''],
      updateCargo: ['']
    });
  }

  toggleForm(formId: string): void {
    this.showRegisterForm = formId === 'registerForm';
    this.showConsultForm = formId === 'consultForm';
    this.showListForm = formId === 'listForm';
    this.showUpdateForm = formId === 'updateForm';

    // Oculta la lista de clientes cuando se muestra el formulario de registro o actualización
    if (formId === 'registerForm' || formId === 'updateForm') {
      this.usuarios = [];
    }

    // Limpia el Cliente consultado si se cambia de formulario
    if (formId !== 'consultForm') {
      this.usuarioConsultado = null;
    }
  }
  showAllUsers(): void {
    this.listarusuarios(); // Vuelve a listar todos los clientes
    this.toggleForm('listForm'); // Muestra la lista de clientes
    this.showClearButton = false; // Oculta el botón de limpieza
  }
  toggleClearButton(): void {
    this.showClearButton = this.consultForm.value.consultId.length > 0;
  }

  clearInput(): void {
    this.consultForm.patchValue({ consultId: '' });
    this.showClearButton = false;
    this.listarusuarios(); // Vuelve a listar todos los clientes
  }
  onRegisterSubmit(): void {
    const usuario = {
      nombre: this.registerForm.get('registerName')?.value,
      mail: this.registerForm.get('registerMail')?.value,
      password: this.registerForm.get('registerPassword')?.value,
      cargo: this.registerForm.get('registerCargo')?.value
    };
    this.usuarioService.crearusuario(usuario).subscribe(response => {
      alert('usuario registrado');
      this.showAllUsers();
    });
  }

  onConsultSubmit(): void {
    const id = this.consultForm.value.consultId;
    this.usuarioService.consultarusuario(id).subscribe(usuario => {
      this.usuarioConsultado = usuario; // Actualiza el producto consultado
      // Mostrar solo el cliente consultado en la tabla
      this.usuarios = [usuario];
      this.showConsultForm = true;
      alert('Usuario consultado');
      this.toggleClearButton(); // Muestra el botón de limpieza si hay texto en el input
    });
  }

  onDeleteSubmit(id: number): void {
    if (confirm('¿Está seguro de que desea eliminar este usuario?')) {
      this.usuarioService.eliminarusuario(id).subscribe(() => {
        this.usuarios = this.usuarios.filter(usuario => usuario.id !== id);
      });
    }
  }
  update(productoId: number): void {
    this.usuarioService.consultarusuario(productoId).subscribe(usuario => {
      this.updateForm.patchValue({
        updateId: usuario.id,
        updateName: usuario.nombre,
        updateMail: usuario.mail,
        updatePassword: usuario.passsword,
        updateCargo: usuario.cargo
      });
      this.toggleForm('updateForm');
    });
  }
  onUpdateSubmit(): void {
    const id = this.updateForm.value.updateId;
    const usuario = {
      nombre: this.updateForm.value.updateName,
      mail: this.updateForm.value.updateMail,
      password: this.updateForm.value.updatePassword,
      cargo: this.updateForm.value.updateCargo
    };
    this.usuarioService.actualizarusuario(id, usuario).subscribe(response => {
      alert('usuario actualizado');
      this.listarusuarios();
    });
  }

  listarusuarios(): void {
    this.usuarioService.listarusuarios().subscribe(usuarios => {
      this.usuarios = usuarios;
    });
  }

  ngOnInit(): void {
    this.listarusuarios(); // Cargar usuarios al inicializar
  }
}