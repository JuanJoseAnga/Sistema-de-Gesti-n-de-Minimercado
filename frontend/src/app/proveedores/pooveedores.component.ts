import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProveedorService } from './proveedor.service';
import { HttpClientModule } from '@angular/common/http'; // Importa HttpClientModule


@Component({
  selector: 'app-prooverdores',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,HttpClientModule],
  templateUrl: './proveedores.component.html',
  styleUrl: './proveedores.component.css'
})
export class ProveedoresComponent implements OnInit {
  showRegisterForm = false;
  showUpdateForm = false;
  showListForm = true; // Inicialmente mostramos la lista de proveedors
  showConsultForm = false; // Estado para mostrar el formulario de consulta
  showClearButton = false; // Estado para mostrar el botón de limpieza

  registerForm: FormGroup;
  consultForm: FormGroup;
  deleteForm: FormGroup;
  updateForm: FormGroup;

  proveedores: any[] = [];
  proveedorConsultado: any; // Variable para almacenar el Proveedor consultado

  constructor(private fb: FormBuilder, private proveedorService: ProveedorService) {
    this.registerForm = this.fb.group({
      registerName: ['', Validators.required],
      registerContact: ['', Validators.required],
      registerProducts: ['', Validators.required],
      registerCond: ['', Validators.required]
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
      updateContact: [''],
      updateProducts: [''],
      updateCond: ['']
    });
  }

  toggleForm(formId: string): void {
    this.showRegisterForm = formId === 'registerForm';
    this.showUpdateForm = formId === 'updateForm';
    this.showListForm = formId === 'listForm';
    this.showConsultForm = formId === 'consultForm';

    // Oculta la lista de proveedors cuando se muestra el formulario de registro o actualización
    if (formId === 'registerForm' || formId === 'updateForm') {
      this.proveedores = [];
    }

    // Limpia el Proveedor consultado si se cambia de formulario
    if (formId !== 'consultForm') {
      this.proveedorConsultado = null;
    }
  }

  showAllProveedores(): void {
    this.listarProveedores(); // Vuelve a listar todos los proveedors
    this.toggleForm('listForm'); // Muestra la lista de proveedors
    this.showClearButton = false; // Oculta el botón de limpieza
  }

  toggleClearButton(): void {
    this.showClearButton = this.consultForm.value.consultId.length > 0;
  }

  clearInput(): void {
    this.consultForm.patchValue({ consultId: '' });
    this.showClearButton = false;
    this.listarProveedores(); // Vuelve a listar todos los proveedors
  }

  onRegisterSubmit(): void {
    const proveedor = {
      nombre: this.registerForm.get('registerName')?.value,
      contacto: this.registerForm.get('registerContact')?.value,
      productos: this.registerForm.get('registerProducts')?.value,
      condiciones_pago: this.registerForm.get('registerCond')?.value
    };
    console.log(proveedor);
    this.proveedorService.crearProveedor(proveedor).subscribe(() => {
      alert('Proveedor registrado');
      this.showAllProveedores(); // Muestra la lista de proveedors después de registrar
    });
  }

  onConsultSubmit(): void {
    const id = this.consultForm.value.consultId;
    this.proveedorService.consultarProveedor(id).subscribe(proveedor => {
      this.proveedorConsultado = proveedor;
      // Mostrar solo el proveedor consultado en la tabla
      this.proveedores = [proveedor];
      this.showConsultForm = true;
      alert('Proveedor consultado');
      this.toggleClearButton(); // Muestra el botón de limpieza si hay texto en el input
    });
  }

  onDeleteSubmit(id: number): void {
    if (confirm('¿Está seguro de que desea eliminar este proveedor?')) {
      this.proveedorService.eliminarProveedor(id).subscribe(() => {
        this.proveedores = this.proveedores.filter(proveedor => proveedor.ID !== id);
      });
    }
  }

  update(provedorId: number): void {
    this.proveedorService.consultarProveedor(provedorId).subscribe(proveedor => {
      this.updateForm.patchValue({
        updateId: proveedor.ID,
        updateName: proveedor.nombre,
        updateContact: proveedor.contacto,
        updateProducts: proveedor.productos,
        updateCond: proveedor.condiciones_pago
      });
      this.toggleForm('updateForm');
    });
  }

  onUpdateSubmit(): void {
    const id = this.updateForm.value.updateId;
    const proveedor = {
      nombre: this.updateForm.value.updateName,
      contacto: this.updateForm.value.updateContact,
      productos: this.updateForm.value.updateProducts,
      condiciones_pago: this.updateForm.value.updateCond
    };
    console.log(proveedor)
    this.proveedorService.actualizarProveedor(id, proveedor).subscribe(() => {
      alert('Proveedor actualizado');
      this.showAllProveedores(); // Muestra la lista de proveedors después de actualizar
    });
  }

  listarProveedores(): void {
    this.proveedorService.listarProveedores().subscribe(proveedores => {
      this.proveedores = proveedores;
    });
  }

  ngOnInit(): void {
    this.listarProveedores(); // Cargar proveedors al inicializar
  }
}
