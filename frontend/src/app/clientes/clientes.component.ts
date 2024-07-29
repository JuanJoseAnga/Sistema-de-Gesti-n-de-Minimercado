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
  styleUrls: ['./clientes.component.css']
})

export class ClientesComponent implements OnInit {
  showRegisterForm = false;
  showUpdateForm = false;
  showListForm = true; // Inicialmente mostramos la lista de clientes
  showConsultForm = false; // Estado para mostrar el formulario de consulta
  showClearButton = false; // Estado para mostrar el botón de limpieza

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
    this.showUpdateForm = formId === 'updateForm';
    this.showListForm = formId === 'listForm';
    this.showConsultForm = formId === 'consultForm';

    // Oculta la lista de clientes cuando se muestra el formulario de registro o actualización
    if (formId === 'registerForm' || formId === 'updateForm') {
      this.clientes = [];
    }

    // Limpia el Cliente consultado si se cambia de formulario
    if (formId !== 'consultForm') {
      this.clienteConsultado = null;
    }
  }

  showAllClients(): void {
    this.listarClientes(); // Vuelve a listar todos los clientes
    this.toggleForm('listForm'); // Muestra la lista de clientes
    this.showClearButton = false; // Oculta el botón de limpieza
  }

  toggleClearButton(): void {
    this.showClearButton = this.consultForm.value.consultId.length > 0;
  }

  clearInput(): void {
    this.consultForm.patchValue({ consultId: '' });
    this.showClearButton = false;
    this.listarClientes(); // Vuelve a listar todos los clientes
  }

  onRegisterSubmit(): void {
    const cliente = {
      nombre: this.registerForm.get('registerName')?.value,
      email: this.registerForm.get('registerEmail')?.value,
      direccion: this.registerForm.get('registerDirection')?.value,
      telefono: this.registerForm.get('registerTelf')?.value
    };
    this.clienteService.crearCliente(cliente).subscribe(() => {
      alert('Cliente registrado');
      this.showAllClients(); // Muestra la lista de clientes después de registrar
    });
  }

  onConsultSubmit(): void {
    const id = this.consultForm.value.consultId;
    this.clienteService.consultarCliente(id).subscribe(cliente => {
      this.clienteConsultado = cliente;
      // Mostrar solo el cliente consultado en la tabla
      this.clientes = [cliente];
      this.showConsultForm = true;
      alert('Cliente consultado');
      this.toggleClearButton(); // Muestra el botón de limpieza si hay texto en el input
    });
  }

  onDeleteSubmit(id: number): void {
    if (confirm('¿Está seguro de que desea eliminar este cliente?')) {
      this.clienteService.eliminarCliente(id).subscribe(() => {
        this.clientes = this.clientes.filter(cliente => cliente.id !== id);
      });
    }
  }

  update(clientId: number): void {
    this.clienteService.consultarCliente(clientId).subscribe(cliente => {
      this.updateForm.patchValue({
        updateId: cliente.id,
        updateName: cliente.nombre,
        updateEmail: cliente.email,
        updateDirection: cliente.direccion,
        updateTelf: cliente.telefono
      });
      this.toggleForm('updateForm');
    });
  }

  onUpdateSubmit(id: number): void {
    const cliente = {
      nombre: this.updateForm.value.updateName,
      email: this.updateForm.value.updateEmail,
      direccion: this.updateForm.value.updateDirection,
      telefono: this.updateForm.value.updateTelf
    };
    this.clienteService.actualizarCliente(id, cliente).subscribe(() => {
      alert('Cliente actualizado');
      this.showAllClients(); // Muestra la lista de clientes después de actualizar
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
