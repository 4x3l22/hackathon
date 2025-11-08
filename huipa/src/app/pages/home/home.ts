import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Navbar } from '../../components/navbar/navbar';
import { historiasDestacadas, HistoriaDestacada } from '../../../utils/historiasDestacadas';
import { productosMock, Producto } from '../../../utils/productosMock';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  imports: [Navbar, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  historias: HistoriaDestacada[] = historiasDestacadas;
  productos: Producto[] = productosMock;

  constructor(
    private router: Router,
    private authService: AuthService,
    private productService: ProductService
  ) {}

  verHistoria(id: number): void {
    this.router.navigate(['/userprofile', id]);
  }

  verProducto(id: number): void {
    this.router.navigate(['/product', id]);
  }

  agregarAlCarrito(producto: Producto, event: Event): void {
    event.stopPropagation(); // Evitar que se navegue al producto
    
    this.productService.agregarAlCarrito(producto, 1);
    
    Swal.fire({
      icon: 'success',
      title: '¡Agregado!',
      text: `${producto.nombre} agregado al carrito`,
      confirmButtonColor: '#3C8D40',
      timer: 1500,
      showConfirmButton: false
    });
  }

  formatearPrecio(precio: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(precio);
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
