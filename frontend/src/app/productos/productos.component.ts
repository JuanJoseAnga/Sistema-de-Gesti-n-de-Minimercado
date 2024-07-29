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
  showUpdateForm = false;
  showListForm = true; // Inicialmente mostramos la lista de clientes
  showConsultForm = false; // Estado para mostrar el formulario de consulta
  showClearButton = false; // Estado para mostrar el botón de limpieza

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
    this.showUpdateForm = formId === 'updateForm';

    // Oculta la lista de clientes cuando se muestra el formulario de registro o actualización
    if (formId === 'registerForm' || formId === 'updateForm') {
      this.productos = [];
    }

    // Limpia el Cliente consultado si se cambia de formulario
    if (formId !== 'consultForm') {
      this.productoConsultado = null;
    }
  }
  showAllProducts(): void {
    this.listarProductos(); // Vuelve a listar todos los clientes
    this.toggleForm('listForm'); // Muestra la lista de clientes
    this.showClearButton = false; // Oculta el botón de limpieza
  }

  toggleClearButton(): void {
    this.showClearButton = this.consultForm.value.consultId.length > 0;
  }

  clearInput(): void {
    this.consultForm.patchValue({ consultId: '' });
    this.showClearButton = false;
    this.listarProductos(); // Vuelve a listar todos los clientes
  }
  onRegisterSubmit(): void {
    const producto = {
      nombre: this.registerForm.get('registerName')?.value,
      precio: this.registerForm.get('registerPrice')?.value,
      descripcion: this.registerForm.get('registerDescription')?.value,
      stock: this.registerForm.get('registerStock')?.value
    };
    this.productoService.crearProducto(producto).subscribe(() => {
      alert('Producto registrado');
      this.showAllProducts();
    });
  }

  onConsultSubmit(): void {
    const id = this.consultForm.value.consultId;
    this.productoService.consultarProducto(id).subscribe(producto => {
      this.productoConsultado = producto; // Actualiza el producto consultado
      // Mostrar solo el cliente consultado en la tabla
      this.productos = [producto];
      this.showConsultForm = true;
      alert('Producto consultado');
      this.toggleClearButton(); // Muestra el botón de limpieza si hay texto en el input
    });
  }

  onDeleteSubmit(id: number): void {
    if (confirm('¿Está seguro de que desea eliminar este cliente?')) {
      this.productoService.eliminarProducto(id).subscribe(() => {
        this.productos = this.productos.filter(producto => producto.id !== id);
      });
    }
  }
  update(productoId: number): void {
    this.productoService.consultarProducto(productoId).subscribe(producto => {
      this.updateForm.patchValue({
        updateId: producto.id,
        updateName: producto.nombre,
        updatePrice: producto.precio,
        updateDescription: producto.descripcion,
        updateStock: producto.stock
      });
      this.toggleForm('updateForm');
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
    this.productoService.actualizarProducto(id, producto).subscribe(() => {
      alert('Producto actualizado');
      this.showAllProducts(); // Muestra la lista de clientes después de actualizar
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
