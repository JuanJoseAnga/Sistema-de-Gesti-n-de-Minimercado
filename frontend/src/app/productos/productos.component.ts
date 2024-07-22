import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductoService } from './producto.service';
import { HttpClientModule } from '@angular/common/http'; // Importa HttpClientModule

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,HttpClientModule]
})
export class ProductosComponent implements OnInit {
  showRegisterForm = false;
  showConsultForm = false;
  showListForm = false;
  showDeleteForm = false;
  showUpdateForm = false;

  registerForm: FormGroup;
  consultForm: FormGroup;
  deleteForm: FormGroup;
  updateForm: FormGroup;

  productos: any[] = [];
  productoConsultado: any; // Variable para almacenar el producto consultado

  constructor(private fb: FormBuilder, private productoService: ProductoService) {
    this.registerForm = this.fb.group({
      registerName: ['', Validators.required],
      registerPrice: ['', Validators.required],
      registerDescription: ['', Validators.required],
      registerStock: ['', Validators.required]
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
      updatePrice: [''],
      updateDescription: [''],
      updateStock: ['']
    });
  }

  toggleForm(formId: string): void {
    this.showRegisterForm = formId === 'registerForm';
    this.showConsultForm = formId === 'consultForm';
    this.showListForm = formId === 'listForm';
    this.showDeleteForm = formId === 'deleteForm';
    this.showUpdateForm = formId === 'updateForm';

    // Limpia el producto consultado si se cambia de formulario
    if (formId !== 'consultForm') {
      this.productoConsultado = null;
    }
  }

  onRegisterSubmit(): void {
    const producto = {
      nombre: this.registerForm.get('registerName')?.value,
      precio: this.registerForm.get('registerPrice')?.value,
      descripcion: this.registerForm.get('registerDescription')?.value,
      stock: this.registerForm.get('registerStock')?.value
    };
    this.productoService.crearProducto(producto).subscribe(response => {
      alert('Producto registrado');
      this.listarProductos();
    });
  }

  onConsultSubmit(): void {
    const id = this.consultForm.value.consultId;
    this.productoService.consultarProducto(id).subscribe(producto => {
      this.productoConsultado = producto; // Actualiza el producto consultado
      alert('Producto consultado');
    });
  }

  onDeleteSubmit(): void {
    const id = this.deleteForm.value.deleteId;
    this.productoService.eliminarProducto(id).subscribe(response => {
      alert('Producto eliminado');
      this.listarProductos();
    });
  }

  onUpdateSubmit(): void {
    const id = this.updateForm.value.updateId;
    const producto = {
      nombre: this.updateForm.value.updateName,
      precio: this.updateForm.value.updatePrice,
      descripcion: this.updateForm.value.updateDescription,
      stock: this.updateForm.value.updateStock
    };
    this.productoService.actualizarProducto(id, producto).subscribe(response => {
      alert('Producto actualizado');
      this.listarProductos();
    });
  }

  listarProductos(): void {
    this.productoService.listarProductos().subscribe(productos => {
      this.productos = productos;
    });
  }

  ngOnInit(): void {
    this.listarProductos(); // Cargar productos al inicializar
  }
}
