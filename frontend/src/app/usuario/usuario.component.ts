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
  showConsultForm = false;
  showListForm = false;
  showDeleteForm = false;
  showUpdateForm = false;

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
    this.showDeleteForm = formId === 'deleteForm';
    this.showUpdateForm = formId === 'updateForm';

    // Limpia el usuario consultado si se cambia de formulario
    if (formId !== 'consultForm') {
      this.usuarioConsultado = null;
    }
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
      this.listarusuarios();
    });
  }

  onConsultSubmit(): void {
    const id = this.consultForm.value.consultId;
    this.usuarioService.consultarusuario(id).subscribe(usuario => {
      this.usuarioConsultado = usuario; // Actualiza el usuario consultado
      alert('usuario consultado');
    });
  }

  onDeleteSubmit(): void {
    const id = this.deleteForm.value.deleteId;
    this.usuarioService.eliminarusuario(id).subscribe(response => {
      alert('usuario eliminado');
      this.listarusuarios();
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