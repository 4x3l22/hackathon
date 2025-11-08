import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { historiasDestacadas, HistoriaDestacada } from '../../../utils/historiasDestacadas';

@Component({
  selector: 'app-userprofile',
  imports: [CommonModule],
  templateUrl: './userprofile.html',
  styles: ``,
})
export class Userprofile implements OnInit {
  historiaSeleccionada: HistoriaDestacada | null = null;
  
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
  products: Array<{
    id: number;
    name: string;
    price: number;
    image: string;
    available: boolean;
    descripcion?: string;
  }> = [
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

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    // Obtener el id de la ruta
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      // Buscar la historia correspondiente
      this.historiaSeleccionada = historiasDestacadas.find(h => h.id === Number(id)) || null;
      
      if (this.historiaSeleccionada) {
        // Actualizar datos del usuario con la historia seleccionada
        this.user.name = this.historiaSeleccionada.nombre;
        this.user.profileImage = this.historiaSeleccionada.imagenPerfil;
        this.user.bio = this.historiaSeleccionada.descripcionHistoria;
        
        // Mapear productos de la historia (sin precios para evitar compra)
        this.products = this.historiaSeleccionada.productos.map((prod, index) => ({
          id: index + 1,
          name: prod.nombre,
          price: 0, // Sin precio para evitar compra
          image: prod.imagen,
          available: true,
          descripcion: prod.descripcionBreve
        }));
      }
    }
  }

  // Volver a la página anterior
  goBack(): void {
    this.location.back();
  }

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
