import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import Swal from 'sweetalert2';

interface ProductImage {
  url: string;
  alt: string;
}

interface ProductData {
  id: number;
  name: string;
  price: number;
  description: string;
  images: ProductImage[];
  available: boolean;
  category: string;
  artisan: {
    name: string;
    bio: string;
    experience: string;
  };
  story: string;
  paymentMethods: string[];
  shipping: {
    time: string;
    cost: string;
    areas: string;
  };
}

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

  // Producto actual (simulado, vendrá del backend/route params)
  product: ProductData = {
    id: 1,
    name: 'Bolso Artesanal Tejido a Mano',
    price: 45000,
    description: 'Hermoso bolso artesanal tejido completamente a mano con técnicas tradicionales. Perfecto para uso diario, combina elegancia y funcionalidad. Hecho con fibras naturales sostenibles.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&h=800&fit=crop',
        alt: 'Bolso artesanal vista frontal'
      },
      {
        url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&h=800&fit=crop',
        alt: 'Bolso artesanal vista lateral'
      },
      {
        url: 'https://images.unsplash.com/photo-1564422170194-896b89110ef8?w=800&h=800&fit=crop',
        alt: 'Bolso artesanal detalle del tejido'
      },
      {
        url: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800&h=800&fit=crop',
        alt: 'Bolso artesanal en uso'
      }
    ],
    available: true,
    category: 'Accesorios',
    artisan: {
      name: 'María González',
      bio: 'Artesana con más de 15 años de experiencia en tejido tradicional colombiano. Especializada en técnicas ancestrales transmitidas de generación en generación.',
      experience: 'Ha participado en ferias nacionales e internacionales, llevando el arte colombiano a diferentes países. Cada pieza es única y refleja la riqueza cultural de nuestra tierra.'
    },
    story: 'Este bolso nace de la inspiración en los paisajes cafeteros de Colombia. Cada puntada representa las montañas, los caminos y la calidez de nuestra gente. El proceso de creación toma aproximadamente 3 días de trabajo continuo, utilizando técnicas que han sido preservadas por siglos en las comunidades artesanales.',
    paymentMethods: ['Efectivo', 'Transferencia bancaria', 'Nequi', 'Daviplata', 'Tarjeta de crédito'],
    shipping: {
      time: '3-5 días hábiles',
      cost: 'Gratis en compras mayores a $80.000',
      areas: 'Envíos a todo Colombia'
    }
  };

  // Cantidad en el carrito
  quantity: number = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    // Aquí obtendrías el ID del producto de los parámetros de la ruta
    // y cargarías los datos desde el backend
    this.route.params.subscribe(params => {
      const productId = params['id'];
      if (productId) {
        // Cargar producto desde el servicio
        // this.loadProduct(productId);
      }
    });
  }

  // Navegación del slider
  nextImage(): void {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.product.images.length;
  }

  previousImage(): void {
    this.currentImageIndex = this.currentImageIndex === 0 
      ? this.product.images.length - 1 
      : this.currentImageIndex - 1;
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
    const productUrl = `${window.location.origin}/product/${this.product.id}`;
    
    // Usar la API nativa de compartir si está disponible (móviles)
    if (navigator.share) {
      try {
        await navigator.share({
          title: this.product.name,
          text: this.product.description,
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
    if (!this.product.available) {
      Swal.fire({
        icon: 'warning',
        title: 'Producto no disponible',
        text: 'Este producto no está disponible en este momento',
        confirmButtonColor: '#a07034'
      });
      return;
    }

    // Agregar al carrito usando el servicio
    this.cartService.addToCart({
      id: this.product.id,
      name: this.product.name,
      price: this.product.price,
      quantity: this.quantity,
      image: this.product.images[0].url
    });

    // Mostrar confirmación
    Swal.fire({
      icon: 'success',
      title: '¡Agregado al Carrito!',
      html: `
        <p><strong>${this.product.name}</strong></p>
        <p>Cantidad: ${this.quantity}</p>
        <p>Total: ${this.formatPrice(this.product.price * this.quantity)}</p>
      `,
      showCancelButton: true,
      confirmButtonText: 'Ir al carrito',
      cancelButtonText: 'Seguir comprando',
      confirmButtonColor: '#a07034',
      cancelButtonColor: '#6c757d'
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/cart']);
      }
    });
  }

  // Cambiar cantidad
  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
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
    // this.router.navigate(['/profile', artisanId]);
    this.router.navigate(['/profile']);
  }

  // Contactar por WhatsApp
  contactWhatsApp(): void {
    const message = encodeURIComponent(`Hola, estoy interesado en el producto: ${this.product.name}`);
    const whatsappUrl = `https://wa.me/573001234567?text=${message}`;
    window.open(whatsappUrl, '_blank');
  }
}
