import { Component } from '@angular/core';
import {ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Importa CommonModule aquí


@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent {
  showRegisterForm = false;
  showConsultForm = false;
  showListForm = false;
  showDeleteForm = false;
  showUpdateForm = false;

  registerForm: FormGroup;
  consultForm: FormGroup;
  deleteForm: FormGroup;
  updateForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      registerName: [''],
      registerPrice: [''],
      registerDescription: [''],
      registerStock: ['']
    });

    this.consultForm = this.fb.group({
      consultId: ['']
    });

    this.deleteForm = this.fb.group({
      deleteId: ['']
    });

    this.updateForm = this.fb.group({
      updateId: [''],
      updateName: [''],
      updatePrice: [''],
      updateDescription: [''],
      updateStock: ['']
    });
  }

  ngOnInit(): void {}

  toggleForm(formId: string): void {
    this.showRegisterForm = formId === 'registerForm';
    this.showConsultForm = formId === 'consultForm';
    this.showListForm = formId === 'listForm';
    this.showDeleteForm = formId === 'deleteForm';
    this.showUpdateForm = formId === 'updateForm';
  }

  onRegisterSubmit(): void {
    // Lógica para registrar producto
    alert('Producto registrado');
  }

  onConsultSubmit(): void {
    // Lógica para consultar producto por ID
    alert('Consultando producto');
  }

  onDeleteSubmit(): void {
    // Lógica para eliminar producto por ID
    alert('Producto eliminado');
  }

  onUpdateSubmit(): void {
    // Lógica para actualizar producto por ID
    alert('Producto actualizado');
  }
}
