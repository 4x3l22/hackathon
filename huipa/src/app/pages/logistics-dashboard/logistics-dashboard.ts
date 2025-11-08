import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { IndexedDBService, DatosNegocio, ProductoDB, UsuarioDB, PedidoDB } from '../../services/indexeddb.service';
import Swal from 'sweetalert2';

interface NegocioConProductos {
  datosNegocio: DatosNegocio;
  usuario: UsuarioDB;
  productos: ProductoDB[];
  expanded: boolean;
}

interface ProductoSeleccionado {
  producto: ProductoDB;
  negocio: DatosNegocio;
  artesano: UsuarioDB;
}

@Component({
  selector: 'app-logistics-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './logistics-dashboard.html',
  styleUrls: ['./logistics-dashboard.css']
})
export class LogisticsDashboard implements OnInit {
  negocios: NegocioConProductos[] = [];
  usuarioActual: any;
  cargando = true;

  // Control de selección de productos
  productosSeleccionados: Map<number, ProductoSeleccionado> = new Map();

  // Modal de pedido
  mostrarModalPedido = false;
  clientes: UsuarioDB[] = [];
  transportistas: UsuarioDB[] = [];

  // Formulario de pedido
  formularioPedido = {
    clienteId: 0,
    transportistaId: 0,
    lugarOrigen: '',
    lugarDestino: ''
  };

  constructor(
    private authService: AuthService,
    private indexedDBService: IndexedDBService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    // Obtener usuario actual
    this.authService.currentUser$.subscribe(async (usuario) => {
      if (!usuario) {
        this.router.navigate(['/login']);
        return;
      }

      // Verificar que sea logística
      if (usuario.rol !== 'logistica') {
        this.router.navigate(['/home']);
        return;
      }

      this.usuarioActual = usuario;
      await this.cargarNegocios();
    });
  }

  async cargarNegocios(): Promise<void> {
    try {
      this.cargando = true;

      // Obtener todos los datos de negocios
      const todosLosDatosNegocio = await this.indexedDBService.obtenerTodosLosDatosNegocio();
      
      // Obtener todos los productos
      const todosLosProductos = await this.indexedDBService.obtenerTodosLosProductos();

      // Obtener todos los usuarios
      const todosLosUsuarios = await this.indexedDBService.obtenerTodosLosUsuarios();

      // Combinar la información
      this.negocios = todosLosDatosNegocio.map(datosNegocio => {
        // Buscar el usuario dueño del negocio
        const usuario = todosLosUsuarios.find(u => u.id === datosNegocio.usuarioId);
        
        // Buscar los productos de este negocio
        const productos = todosLosProductos.filter(p => p.usuarioId === datosNegocio.usuarioId);

        return {
          datosNegocio,
          usuario: usuario!,
          productos,
          expanded: false
        };
      });

      console.log('Negocios cargados:', this.negocios.length);
      this.cargando = false;

    } catch (error: any) {
      console.error('Error al cargar negocios:', error);
      this.cargando = false;
      
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar los negocios',
        confirmButtonColor: '#d33'
      });
    }
  }

  toggleNegocio(index: number): void {
    this.negocios[index].expanded = !this.negocios[index].expanded;
  }

  getImagenProducto(producto: ProductoDB): string {
    if (producto.imagenes && producto.imagenes.length > 0) {
      return `data:image/jpeg;base64,${producto.imagenes[0]}`;
    }
    return 'https://via.placeholder.com/150?text=Sin+Imagen';
  }

  // =====================================================
  // MÉTODOS PARA SELECCIÓN DE PRODUCTOS
  // =====================================================

  toggleProductoSeleccionado(producto: ProductoDB, negocio: NegocioConProductos): void {
    const productoId = producto.id!;
    
    if (this.productosSeleccionados.has(productoId)) {
      this.productosSeleccionados.delete(productoId);
    } else {
      this.productosSeleccionados.set(productoId, {
        producto,
        negocio: negocio.datosNegocio,
        artesano: negocio.usuario
      });
    }
  }

  isProductoSeleccionado(productoId: number): boolean {
    return this.productosSeleccionados.has(productoId);
  }

  get hayProductosSeleccionados(): boolean {
    return this.productosSeleccionados.size > 0;
  }

  get totalProductosSeleccionados(): number {
    return this.productosSeleccionados.size;
  }

  get totalPedido(): number {
    let total = 0;
    this.productosSeleccionados.forEach(item => {
      total += item.producto.precio;
    });
    return total;
  }

  // =====================================================
  // MÉTODOS PARA MODAL DE PEDIDO
  // =====================================================

  async abrirModalPedido(): Promise<void> {
    if (!this.hayProductosSeleccionados) {
      Swal.fire({
        icon: 'warning',
        title: 'No hay productos seleccionados',
        text: 'Por favor selecciona al menos un producto antes de crear un pedido',
        confirmButtonColor: '#8B5A2B'
      });
      return;
    }

    try {
      // Cargar clientes y transportistas
      const clientesRol = await this.indexedDBService.obtenerUsuariosPorRol('cliente');
      const usuariosRol = await this.indexedDBService.obtenerUsuariosPorRol('usuario');
      this.clientes = [...clientesRol, ...usuariosRol];
      
      this.transportistas = await this.indexedDBService.obtenerUsuariosPorRol('transportista');

      if (this.clientes.length === 0) {
        Swal.fire({
          icon: 'warning',
          title: 'No hay clientes registrados',
          text: 'No se encontraron usuarios con rol cliente en el sistema',
          confirmButtonColor: '#8B5A2B'
        });
        return;
      }

      if (this.transportistas.length === 0) {
        Swal.fire({
          icon: 'warning',
          title: 'No hay transportistas registrados',
          text: 'No se encontraron usuarios con rol transportista en el sistema',
          confirmButtonColor: '#8B5A2B'
        });
        return;
      }

      this.mostrarModalPedido = true;
    } catch (error) {
      console.error('Error al cargar datos para pedido:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar los datos necesarios',
        confirmButtonColor: '#d33'
      });
    }
  }

  cerrarModalPedido(): void {
    this.mostrarModalPedido = false;
    this.formularioPedido = {
      clienteId: 0,
      transportistaId: 0,
      lugarOrigen: '',
      lugarDestino: ''
    };
  }

  async crearPedido(): Promise<void> {
    // Validar formulario
    if (!this.formularioPedido.clienteId || this.formularioPedido.clienteId === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Cliente requerido',
        text: 'Por favor selecciona un cliente',
        confirmButtonColor: '#8B5A2B'
      });
      return;
    }

    if (!this.formularioPedido.transportistaId || this.formularioPedido.transportistaId === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Transportista requerido',
        text: 'Por favor selecciona un transportista',
        confirmButtonColor: '#8B5A2B'
      });
      return;
    }

    if (!this.formularioPedido.lugarOrigen.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Lugar de origen requerido',
        text: 'Por favor ingresa el lugar de origen',
        confirmButtonColor: '#8B5A2B'
      });
      return;
    }

    if (!this.formularioPedido.lugarDestino.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Lugar de destino requerido',
        text: 'Por favor ingresa el lugar de destino',
        confirmButtonColor: '#8B5A2B'
      });
      return;
    }

    try {
      // Crear un pedido por cada producto seleccionado
      const promesasPedidos: Promise<number>[] = [];

      this.productosSeleccionados.forEach(({ producto }) => {
        const pedido: Omit<PedidoDB, 'id' | 'createdAt'> = {
          productoId: producto.id!,
          clienteId: this.formularioPedido.clienteId,
          transportistaId: this.formularioPedido.transportistaId,
          logisticaId: this.usuarioActual.id,
          lugarOrigen: this.formularioPedido.lugarOrigen,
          lugarDestino: this.formularioPedido.lugarDestino,
          total: producto.precio,
          estado: 'pendiente'
        };

        promesasPedidos.push(this.indexedDBService.crearPedido(pedido));
      });

      await Promise.all(promesasPedidos);

      Swal.fire({
        icon: 'success',
        title: '¡Pedidos creados!',
        text: `Se crearon ${this.productosSeleccionados.size} pedido(s) exitosamente`,
        confirmButtonColor: '#3C8D40',
        timer: 2000
      });

      // Limpiar selección y cerrar modal
      this.productosSeleccionados.clear();
      this.cerrarModalPedido();

    } catch (error) {
      console.error('Error al crear pedidos:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron crear los pedidos',
        confirmButtonColor: '#d33'
      });
    }
  }

  getProductosSeleccionadosArray(): ProductoSeleccionado[] {
    return Array.from(this.productosSeleccionados.values());
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
