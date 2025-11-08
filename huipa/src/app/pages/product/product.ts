import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { productosMock, Producto } from '../../../utils/productosMock';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product',
  imports: [CommonModule],
  templateUrl: './product.html',
  styles: ``,
})
export class Product implements OnInit {
  // Índice actual del slider
  currentImageIndex: number = 0;

  // Estado de acordeones
  accordionStates = {
    story: false,
    artisan: false,
    payment: false
  };

  // Producto actual cargado desde el mock
  producto: Producto | null = null;
  cantidad: number = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    // Obtener el ID del producto desde la ruta
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const productoId = parseInt(id, 10);
      // Buscar el producto en el mock
      this.producto = productosMock.find(p => p.id === productoId) || null;
      
      if (!this.producto) {
        Swal.fire({
          icon: 'error',
          title: 'Producto no encontrado',
          text: 'El producto que buscas no existe',
          confirmButtonColor: '#3C8D40'
        }).then(() => {
          this.router.navigate(['/home']);
        });
      }
    }
  }

  // Navegación del slider
  nextImage(): void {
    if (this.producto && this.producto.imagenes) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.producto.imagenes.length;
    }
  }

  previousImage(): void {
    if (this.producto && this.producto.imagenes) {
      this.currentImageIndex = this.currentImageIndex === 0 
        ? this.producto.imagenes.length - 1 
        : this.currentImageIndex - 1;
    }
  }

  goToImage(index: number): void {
    this.currentImageIndex = index;
  }

  // Toggle acordeón
  toggleAccordion(section: 'story' | 'artisan' | 'payment'): void {
    this.accordionStates[section] = !this.accordionStates[section];
  }

  // Compartir producto
  async shareProduct(): Promise<void> {
    if (!this.producto) return;
    
    const productUrl = `${window.location.origin}/product/${this.producto.id}`;
    
    // Usar la API nativa de compartir si está disponible (móviles)
    if (navigator.share) {
      try {
        await navigator.share({
          title: this.producto.nombre,
          text: this.producto.descripcion,
          url: productUrl
        });
        
        Swal.fire({
          icon: 'success',
          title: 'Compartido',
          text: 'Producto compartido exitosamente',
          timer: 2000,
          showConfirmButton: false
        });
      } catch (error) {
        // Usuario canceló o error
        console.log('Error al compartir:', error);
      }
    } else {
      // Fallback: copiar al portapapeles
      try {
        await navigator.clipboard.writeText(productUrl);
        
        Swal.fire({
          icon: 'success',
          title: 'Enlace Copiado',
          text: 'El enlace del producto ha sido copiado al portapapeles',
          confirmButtonColor: '#a07034'
        });
      } catch (error) {
        // Fallback manual si clipboard API no está disponible
        this.copyToClipboardFallback(productUrl);
      }
    }
  }

  // Método fallback para copiar al portapapeles
  private copyToClipboardFallback(text: string): void {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
      document.execCommand('copy');
      Swal.fire({
        icon: 'success',
        title: 'Enlace Copiado',
        text: 'El enlace del producto ha sido copiado',
        confirmButtonColor: '#a07034'
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo copiar el enlace',
        confirmButtonColor: '#a07034'
      });
    }
    
    document.body.removeChild(textArea);
  }

  // Agregar al carrito
  addToCart(): void {
    if (!this.producto || this.producto.stock === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Producto no disponible',
        text: 'Este producto no está disponible en este momento',
        confirmButtonColor: '#3C8D40'
      });
      return;
    }

    // Agregar al carrito usando el servicio
    this.productService.agregarAlCarrito(this.producto, this.cantidad);

    // Mostrar confirmación
    Swal.fire({
      icon: 'success',
      title: '¡Agregado al Carrito!',
      html: `
        <p><strong>${this.producto.nombre}</strong></p>
        <p>Cantidad: ${this.cantidad}</p>
        <p>Total: ${this.formatPrice(this.producto.precio * this.cantidad)}</p>
      `,
      showCancelButton: true,
      confirmButtonText: 'Ir al carrito',
      cancelButtonText: 'Seguir comprando',
      confirmButtonColor: '#3C8D40',
      cancelButtonColor: '#6c757d'
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/carshop']);
      }
    });
  }

  // Cambiar cantidad
  increaseQuantity(): void {
    this.cantidad++;
  }

  decreaseQuantity(): void {
    if (this.cantidad > 1) {
      this.cantidad--;
    }
  }

  // Formatear precio
  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  }

  // Volver a la página anterior
  goBack(): void {
    this.router.navigate(['/home']);
  }

  // Ir al perfil del artesano
  goToArtisanProfile(): void {
    if (this.producto) {
      this.router.navigate(['/userprofile', this.producto.artesano.id]);
    }
  }

  // Contactar por WhatsApp
  contactWhatsApp(): void {
    if (this.producto) {
      const message = encodeURIComponent(`Hola, estoy interesado en el producto: ${this.producto.nombre}`);
      const whatsappUrl = `https://wa.me/573001234567?text=${message}`;
      window.open(whatsappUrl, '_blank');
    }
  }
}
