import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { Producto, productosMock, buscarProductoPorId } from '../../utils/productosMock';

export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private isBrowser: boolean;
  private carritoSubject = new BehaviorSubject<ItemCarrito[]>([]);
  public carrito$ = this.carritoSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    
    // Cargar carrito desde localStorage si estamos en el navegador
    if (this.isBrowser) {
      const carritoGuardado = localStorage.getItem('carrito');
      if (carritoGuardado) {
        this.carritoSubject.next(JSON.parse(carritoGuardado));
      }
    }
  }

  /**
   * Obtener todos los productos
   */
  getProductos(): Producto[] {
    return productosMock;
  }

  /**
   * Obtener producto por ID
   */
  getProductoPorId(id: number): Producto | undefined {
    return buscarProductoPorId(id);
  }

  /**
   * Agregar producto al carrito
   */
  agregarAlCarrito(producto: Producto, cantidad: number = 1): void {
    const carritoActual = this.carritoSubject.value;
    const itemExistente = carritoActual.find(item => item.producto.id === producto.id);

    let nuevoCarrito: ItemCarrito[];

    if (itemExistente) {
      // Si el producto ya existe, actualizar cantidad
      nuevoCarrito = carritoActual.map(item =>
        item.producto.id === producto.id
          ? { ...item, cantidad: item.cantidad + cantidad }
          : item
      );
    } else {
      // Si es nuevo, agregarlo
      nuevoCarrito = [...carritoActual, { producto, cantidad }];
    }

    this.carritoSubject.next(nuevoCarrito);
    this.guardarCarrito(nuevoCarrito);
  }

  /**
   * Eliminar producto del carrito
   */
  eliminarDelCarrito(productoId: number): void {
    const nuevoCarrito = this.carritoSubject.value.filter(
      item => item.producto.id !== productoId
    );
    this.carritoSubject.next(nuevoCarrito);
    this.guardarCarrito(nuevoCarrito);
  }

  /**
   * Actualizar cantidad de un producto en el carrito
   */
  actualizarCantidad(productoId: number, cantidad: number): void {
    if (cantidad <= 0) {
      this.eliminarDelCarrito(productoId);
      return;
    }

    const nuevoCarrito = this.carritoSubject.value.map(item =>
      item.producto.id === productoId
        ? { ...item, cantidad }
        : item
    );
    this.carritoSubject.next(nuevoCarrito);
    this.guardarCarrito(nuevoCarrito);
  }

  /**
   * Limpiar todo el carrito
   */
  limpiarCarrito(): void {
    this.carritoSubject.next([]);
    if (this.isBrowser) {
      localStorage.removeItem('carrito');
    }
  }

  /**
   * Obtener el carrito actual
   */
  getCarrito(): ItemCarrito[] {
    return this.carritoSubject.value;
  }

  /**
   * Obtener cantidad total de items en el carrito
   */
  getCantidadTotal(): number {
    return this.carritoSubject.value.reduce((total, item) => total + item.cantidad, 0);
  }

  /**
   * Obtener precio total del carrito
   */
  getPrecioTotal(): number {
    return this.carritoSubject.value.reduce(
      (total, item) => total + (item.producto.precio * item.cantidad),
      0
    );
  }

  /**
   * Verificar si un producto está en el carrito
   */
  estaEnCarrito(productoId: number): boolean {
    return this.carritoSubject.value.some(item => item.producto.id === productoId);
  }

  /**
   * Guardar carrito en localStorage
   */
  private guardarCarrito(carrito: ItemCarrito[]): void {
    if (this.isBrowser) {
      localStorage.setItem('carrito', JSON.stringify(carrito));
    }
  }
}
