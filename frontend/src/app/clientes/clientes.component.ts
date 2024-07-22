import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClienteService } from './cliente.service';
import { HttpClientModule } from '@angular/common/http'; // Importa HttpClientModule

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,HttpClientModule],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css'
})
export class ClientesComponent implements OnInit {
  showRegisterForm = false;
  showConsultForm = false;
  showListForm = false;
  showDeleteForm = false;
  showUpdateForm = false;

  registerForm: FormGroup;
  consultForm: FormGroup;
  deleteForm: FormGroup;
  updateForm: FormGroup;

  clientes: any[] = [];
  clienteConsultado: any; // Variable para almacenar el Cliente consultado

  constructor(private fb: FormBuilder, private clienteService: ClienteService) {
    this.registerForm = this.fb.group({
      registerName: ['', Validators.required],
      registerEmail: ['', Validators.required],
      registerDirection: ['', Validators.required],
      registerTelf: ['', Validators.required]
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
      updateEmail: [''],
      updateDirection: [''],
      updateTelf: ['']
    });
  }

  toggleForm(formId: string): void {
    this.showRegisterForm = formId === 'registerForm';
    this.showConsultForm = formId === 'consultForm';
    this.showListForm = formId === 'listForm';
    this.showDeleteForm = formId === 'deleteForm';
    this.showUpdateForm = formId === 'updateForm';

    // Limpia el Cliente consultado si se cambia de formulario
    if (formId !== 'consultForm') {
      this.clienteConsultado = null;
    }
  }

  onRegisterSubmit(): void {
    const Cliente = {
      nombre: this.registerForm.get('registerName')?.value,
      email: this.registerForm.get('registerEmail')?.value,
      direccion: this.registerForm.get('registerDirection')?.value,
      telefono: this.registerForm.get('registerTelf')?.value
    };
    console.log(Cliente)
    this.clienteService.crearCliente(Cliente).subscribe(response => {
      alert('Cliente registrado');
      this.listarClientes();
    });
  }

  onConsultSubmit(): void {
    const id = this.consultForm.value.consultId;
    this.clienteService.consultarCliente(id).subscribe(cliente => {
      this.clienteConsultado = cliente; // Actualiza el Cliente consultado
      alert('Cliente consultado');
    });
  }

  onDeleteSubmit(): void {
    const id = this.deleteForm.value.deleteId;
    this.clienteService.eliminarCliente(id).subscribe(response => {
      alert('Cliente eliminado');
      this.listarClientes();
    });
  }

  onUpdateSubmit(): void {
    const id = this.updateForm.value.updateId;
    const cliente = {
      nombre: this.updateForm.value.updateName,
      email: this.updateForm.value.updateEmail,
      direccion: this.updateForm.value.updateDirection,
      telefono: this.updateForm.value.updateTelf
    };
    this.clienteService.actualizarCliente(id, cliente).subscribe(response => {
      alert('Cliente actualizado');
      this.listarClientes();
    });
  }

  listarClientes(): void {
    this.clienteService.listarClientes().subscribe(clientes => {
      this.clientes = clientes;
    });
  }

  ngOnInit(): void {
    this.listarClientes(); // Cargar clientes al inicializar
  }
}
