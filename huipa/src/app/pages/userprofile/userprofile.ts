import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-userprofile',
  imports: [CommonModule],
  templateUrl: './userprofile.html',
  styles: ``,
})
export class Userprofile {
  // Datos del usuario (serán dinámicos desde el backend)
  user = {
    name: 'María González',
    location: 'Bogotá, Colombia',
    phone: '573001234567', // Formato internacional sin +
    coverImage: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=400&fit=crop',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    bio: 'Artesana apasionada por crear productos únicos y sostenibles. Cada pieza cuenta una historia.',
    socialMedia: {
      instagram: '@mariaartesana',
      facebook: 'Maria Artesana',
      email: 'maria@example.com'
    },
    stats: {
      products: 24,
      sales: 156,
      rating: 4.8
    }
  };

  // Sección activa
  activeSection: 'story' | 'products' | 'info' = 'story';

  // Productos del usuario (simulados)
  products = [
    {
      id: 1,
      name: 'Bolso artesanal tejido',
      price: 45000,
      image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=300&h=300&fit=crop',
      available: true
    },
    {
      id: 2,
      name: 'Collar de piedras naturales',
      price: 32000,
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&h=300&fit=crop',
      available: true
    },
    {
      id: 3,
      name: 'Macramé decorativo',
      price: 55000,
      image: 'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=300&h=300&fit=crop',
      available: false
    },
    {
      id: 4,
      name: 'Aretes de plata artesanales',
      price: 28000,
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300&h=300&fit=crop',
      available: true
    },
    {
      id: 5,
      name: 'Canasta de mimbre',
      price: 38000,
      image: 'https://images.unsplash.com/photo-1617096200347-cb04ae810b1d?w=300&h=300&fit=crop',
      available: true
    },
    {
      id: 6,
      name: 'Cojín bordado a mano',
      price: 42000,
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&h=300&fit=crop',
      available: true
    }
  ];

  constructor(private router: Router) {}

  // Cambiar sección activa
  setActiveSection(section: 'story' | 'products' | 'info'): void {
    this.activeSection = section;
  }

  // Ver detalle del producto
  viewProduct(productId: number): void {
    this.router.navigate(['/product', productId]);
  }

  // Abrir WhatsApp
  openWhatsApp(): void {
    const message = encodeURIComponent(`Hola ${this.user.name}, me interesa conocer más sobre tus productos.`);
    const whatsappUrl = `https://wa.me/${this.user.phone}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  }

  // Formatear precio
  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  }
}
