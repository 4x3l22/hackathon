import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { IndexedDBService, DatosNegocio, ProductoDB } from '../../services/indexeddb.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-artisan-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './artisan-dashboard.html',
  styleUrls: ['./artisan-dashboard.css']
})
export class ArtisanDashboard implements OnInit {
  mostrarFormulario = false;
  mostrarModalProducto = false;
  formularioNegocio: FormGroup;
  formularioProducto: FormGroup;
  usuarioActual: any;
  cargando = true;
  imagenesProducto: Array<{ previewUrl: string; base64: string }> = [];
  productos: ProductoDB[] = [];
  productoEditando: ProductoDB | null = null;
  modoEdicion = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private indexedDBService: IndexedDBService,
    private router: Router
  ) {
    this.formularioNegocio = this.fb.group({
      nombreNegocio: ['', [Validators.required, Validators.minLength(3)]],
      descripcionTaller: ['', [Validators.required, Validators.minLength(10)]],
      metodoPago: ['', [Validators.required]],
      whatsapp: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
      instagram: [''],
      facebook: ['']
    });

    this.formularioProducto = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(20)]],
      precio: ['', [Validators.required, Validators.min(0)]],
      categoria: ['', [Validators.required]]
    });
  }

  async ngOnInit(): Promise<void> {
    // Obtener usuario actual
    this.authService.currentUser$.subscribe(async (usuario) => {
      if (!usuario) {
        this.router.navigate(['/login']);
        return;
      }

      // Verificar que sea artesano
      if (usuario.rol !== 'artesano') {
        this.router.navigate(['/home']);
        return;
      }

      this.usuarioActual = usuario;

      // Buscar el usuario en IndexedDB para verificar si completó el formulario
      try {
        // Obtener ID del usuario (mock o registrado)
        let usuarioId: number | null = null;
        
        if (usuario.id) {
          // Usuario mock
          usuarioId = usuario.id;
        } else {
          // Usuario registrado, buscar en IndexedDB
          const usuarioDB = await this.indexedDBService.buscarPorEmail(usuario.email);
          if (usuarioDB && usuarioDB.id) {
            usuarioId = usuarioDB.id;
          }
        }

        // Cargar productos SIEMPRE si tenemos un ID de usuario
        if (usuarioId) {
          this.productos = await this.indexedDBService.obtenerProductosPorUsuario(usuarioId);
          console.log(`Productos cargados para usuario ${usuarioId}:`, this.productos.length);
        }

        // Verificar si necesita completar formulario de negocio (solo para usuarios registrados)
        const usuarioDB = await this.indexedDBService.buscarPorEmail(usuario.email);
        
        if (usuarioDB) {
          const completado = usuarioDB.formularioCompletado;
          
          if (!completado) {
            this.mostrarFormulario = true;
          } else {
            this.mostrarFormulario = false;
          }
        } else {
          // Si no existe en IndexedDB (usuario mock), no mostrar formulario
          this.mostrarFormulario = false;
        }
        
        this.cargando = false;
      } catch (error: any) {
        console.error('Error al verificar estado del formulario:', error);
        this.cargando = false;
        
        // Si el error es porque no existe la tabla, ofrecer reinicializar
        if (error.name === 'NotFoundError' || error.message?.includes('object stores was not found')) {
          const result = await Swal.fire({
            icon: 'warning',
            title: 'Base de datos desactualizada',
            text: 'La estructura de la base de datos necesita actualizarse. ¿Deseas reinicializarla? (Esto no borrará tus datos de usuario)',
            showCancelButton: true,
            confirmButtonColor: '#3C8D40',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, actualizar',
            cancelButtonText: 'Cancelar'
          });

          if (result.isConfirmed) {
            try {
              await this.indexedDBService.reinicializarDB();
              Swal.fire({
                icon: 'success',
                title: 'Base de datos actualizada',
                text: 'Por favor recarga la página',
                confirmButtonColor: '#3C8D40'
              }).then(() => {
                window.location.reload();
              });
            } catch (reinitError) {
              console.error('Error al reinicializar:', reinitError);
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo actualizar la base de datos. Por favor recarga la página.',
                confirmButtonColor: '#d33'
              });
            }
          } else {
            this.mostrarFormulario = false;
          }
        } else {
          this.mostrarFormulario = false;
        }
      }
    });
  }

  async onSubmit(): Promise<void> {
    if (!this.formularioNegocio.valid) {
      this.formularioNegocio.markAllAsTouched();
      Swal.fire({
        icon: 'warning',
        title: 'Formulario incompleto',
        text: 'Por favor completa todos los campos obligatorios',
        confirmButtonColor: '#8B5A2B'
      });
      return;
    }

    try {
      // Obtener el usuario de IndexedDB para tener el ID
      const usuarioDB = await this.indexedDBService.buscarPorEmail(this.usuarioActual.email);
      
      if (!usuarioDB || !usuarioDB.id) {
        throw new Error('Usuario no encontrado en la base de datos');
      }

      const datosNegocio: Omit<DatosNegocio, 'id' | 'usuarioId' | 'createdAt'> = {
        nombreNegocio: this.formularioNegocio.value.nombreNegocio,
        descripcionTaller: this.formularioNegocio.value.descripcionTaller,
        metodoPago: this.formularioNegocio.value.metodoPago,
        whatsapp: this.formularioNegocio.value.whatsapp,
        instagram: this.formularioNegocio.value.instagram || undefined,
        facebook: this.formularioNegocio.value.facebook || undefined
      };

      // Guardar los datos de negocio
      await this.indexedDBService.actualizarDatosNegocio(usuarioDB.id, datosNegocio);

      // Mostrar mensaje de éxito
      await Swal.fire({
        icon: 'success',
        title: '¡Datos guardados!',
        text: 'La información de tu negocio ha sido registrada correctamente',
        confirmButtonColor: '#3C8D40',
        timer: 2000,
        showConfirmButton: false
      });

      // Ocultar el formulario
      this.mostrarFormulario = false;

    } catch (error: any) {
      console.error('Error al guardar datos del negocio:', error);
      
      Swal.fire({
        icon: 'error',
        title: 'Error al guardar',
        text: error.message || 'No se pudieron guardar los datos del negocio',
        confirmButtonColor: '#d33'
      });
    }
  }

  // ==================== MÉTODOS PARA PRODUCTOS ====================

  abrirModalProducto(): void {
    this.modoEdicion = false;
    this.productoEditando = null;
    this.mostrarModalProducto = true;
    this.formularioProducto.reset();
    this.imagenesProducto = [];
  }

  cerrarModalProducto(): void {
    this.mostrarModalProducto = false;
    this.modoEdicion = false;
    this.productoEditando = null;
    this.formularioProducto.reset();
    this.imagenesProducto = [];
  }

  editarProducto(producto: ProductoDB): void {
    this.modoEdicion = true;
    this.productoEditando = producto;
    this.mostrarModalProducto = true;

    // Cargar datos del producto en el formulario
    this.formularioProducto.patchValue({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      categoria: producto.categoria
    });

    // Cargar imágenes existentes
    this.imagenesProducto = producto.imagenes.map((base64, index) => ({
      previewUrl: `data:image/jpeg;base64,${base64}`,
      base64: base64
    }));
  }

  async eliminarProducto(producto: ProductoDB): Promise<void> {
    const result = await Swal.fire({
      title: '¿Eliminar producto?',
      text: `¿Estás seguro de eliminar "${producto.nombre}"? Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        if (!producto.id) {
          throw new Error('ID de producto no válido');
        }

        await this.indexedDBService.eliminarProducto(producto.id);

        // Obtener ID del usuario para recargar productos
        let usuarioId: number;
        if (this.usuarioActual.id) {
          usuarioId = this.usuarioActual.id;
        } else {
          const usuarioDB = await this.indexedDBService.buscarPorEmail(this.usuarioActual.email);
          if (!usuarioDB || !usuarioDB.id) {
            throw new Error('Usuario no encontrado');
          }
          usuarioId = usuarioDB.id;
        }

        // Recargar productos
        this.productos = await this.indexedDBService.obtenerProductosPorUsuario(usuarioId);

        Swal.fire({
          icon: 'success',
          title: 'Producto eliminado',
          text: 'El producto ha sido eliminado correctamente',
          confirmButtonColor: '#3C8D40',
          timer: 2000,
          showConfirmButton: false
        });

      } catch (error: any) {
        console.error('Error al eliminar producto:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'No se pudo eliminar el producto',
          confirmButtonColor: '#d33'
        });
      }
    }
  }


  onImagenesProductoSeleccionadas(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    Array.from(input.files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const commaIndex = result.indexOf(',');
        const base64 = commaIndex !== -1 ? result.substring(commaIndex + 1) : result;
        this.imagenesProducto.push({ previewUrl: result, base64 });
      };
      reader.readAsDataURL(file);
    });

    // Reset input para permitir seleccionar los mismos archivos
    input.value = '';
  }

  eliminarImagenProducto(index: number): void {
    this.imagenesProducto.splice(index, 1);
  }

  async onSubmitProducto(): Promise<void> {
    if (!this.formularioProducto.valid) {
      this.formularioProducto.markAllAsTouched();
      Swal.fire({
        icon: 'warning',
        title: 'Formulario incompleto',
        text: 'Por favor completa todos los campos obligatorios',
        confirmButtonColor: '#8B5A2B'
      });
      return;
    }

    if (this.imagenesProducto.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Sin imágenes',
        text: 'Por favor agrega al menos una imagen del producto',
        confirmButtonColor: '#8B5A2B'
      });
      return;
    }

    try {
      // Obtener el ID del usuario desde el usuario actual (que viene de localStorage)
      let usuarioId: number;

      // Verificar si el usuario tiene ID directamente (usuarios mock)
      if (this.usuarioActual.id) {
        usuarioId = this.usuarioActual.id;
      } else {
        // Si no tiene ID directo, buscar en IndexedDB (usuarios registrados)
        const usuarioDB = await this.indexedDBService.buscarPorEmail(this.usuarioActual.email);
        
        if (!usuarioDB || !usuarioDB.id) {
          throw new Error('Usuario no encontrado en la base de datos');
        }
        
        usuarioId = usuarioDB.id;
      }

      if (this.modoEdicion && this.productoEditando) {
        // MODO EDICIÓN: Actualizar producto existente
        if (!this.productoEditando.id) {
          throw new Error('ID de producto no válido');
        }

        const cambios: Partial<ProductoDB> = {
          nombre: this.formularioProducto.value.nombre,
          descripcion: this.formularioProducto.value.descripcion,
          precio: parseFloat(this.formularioProducto.value.precio),
          categoria: this.formularioProducto.value.categoria,
          imagenes: this.imagenesProducto.map(img => img.base64)
        };

        await this.indexedDBService.actualizarProducto(this.productoEditando.id, cambios);

        // Mostrar mensaje de éxito
        await Swal.fire({
          icon: 'success',
          title: '¡Producto actualizado!',
          text: 'Los cambios se han guardado correctamente',
          confirmButtonColor: '#3C8D40',
          timer: 2000,
          showConfirmButton: false
        });

      } else {
        // MODO CREACIÓN: Crear nuevo producto
        const nuevoProducto: Omit<ProductoDB, 'id' | 'createdAt'> = {
          nombre: this.formularioProducto.value.nombre,
          descripcion: this.formularioProducto.value.descripcion,
          precio: parseFloat(this.formularioProducto.value.precio),
          categoria: this.formularioProducto.value.categoria,
          imagenes: this.imagenesProducto.map(img => img.base64),
          usuarioId: usuarioId
        };

        // Guardar el producto
        await this.indexedDBService.registrarProducto(nuevoProducto);

        // Mostrar mensaje de éxito
        await Swal.fire({
          icon: 'success',
          title: '¡Producto registrado!',
          text: 'El producto ha sido agregado a tu catálogo',
          confirmButtonColor: '#3C8D40',
          timer: 2000,
          showConfirmButton: false
        });
      }

      // Recargar productos
      this.productos = await this.indexedDBService.obtenerProductosPorUsuario(usuarioId);

      // Cerrar modal
      this.cerrarModalProducto();

    } catch (error: any) {
      console.error('Error al registrar producto:', error);
      
      Swal.fire({
        icon: 'error',
        title: 'Error al guardar',
        text: error.message || 'No se pudo registrar el producto',
        confirmButtonColor: '#d33'
      });
    }
  }

  cerrarSesion(): void {
    Swal.fire({
      title: '¿Cerrar sesión?',
      text: '¿Estás seguro de que quieres salir?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3C8D40',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout();
        Swal.fire({
          icon: 'success',
          title: '¡Hasta pronto!',
          text: 'Has cerrado sesión exitosamente',
          confirmButtonColor: '#3C8D40',
          timer: 1500,
          showConfirmButton: false
        });
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      }
    });
  }
}
