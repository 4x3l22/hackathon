import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-carshop',
  imports: [CommonModule],
  templateUrl: './carshop.html',
  styles: ``,
})
export class Carshop implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  subtotal: number = 0;
  shippingCost: number = 0;
  total: number = 0;
  
  private cartSubscription?: Subscription;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Suscribirse a los cambios del carrito
    this.cartSubscription = this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.updateTotals();
    });
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  // Actualizar totales
  private updateTotals(): void {
    this.subtotal = this.cartService.getSubtotal();
    this.shippingCost = this.cartService.getShippingCost();
    this.total = this.cartService.getTotal();
  }

  // Incrementar cantidad
  increaseQuantity(productId: number): void {
    this.cartService.increaseQuantity(productId);
  }

  // Decrementar cantidad
  decreaseQuantity(productId: number): void {
    this.cartService.decreaseQuantity(productId);
  }

  // Eliminar producto
  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  // Formatear precio
  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  }

  // Volver atrás
  goBack(): void {
    this.router.navigate(['/profile']);
  }

  // Proceder al pago
  proceedToCheckout(): void {
    if (this.cartItems.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Carrito Vacío',
        text: 'Agrega productos al carrito antes de proceder al pago',
        confirmButtonColor: '#a07034'
      });
      return;
    }

    Swal.fire({
      icon: 'success',
      title: 'Procesando Pedido',
      html: `
        <div class="text-left">
          <p class="mb-2"><strong>Resumen del pedido:</strong></p>
          <p>Items: ${this.cartService.getTotalItems()}</p>
          <p>Total: ${this.formatPrice(this.total)}</p>
          <p class="mt-4 text-sm text-gray-600">Serás redirigido al proceso de pago...</p>
        </div>
      `,
      confirmButtonColor: '#a07034',
      confirmButtonText: 'Continuar'
    }).then(() => {
      // Aquí redirigiría a la vista de checkout/pago
      // this.router.navigate(['/checkout']);
    });
  }

  // Continuar comprando
  continueShopping(): void {
    this.router.navigate(['/profile']);
  }

  // Vaciar carrito
  clearCart(): void {
    if (this.cartItems.length === 0) return;

    Swal.fire({
      title: '¿Vaciar carrito?',
      text: '¿Estás seguro de que deseas eliminar todos los productos del carrito?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, vaciar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cartService.clearCart();
        Swal.fire({
          icon: 'success',
          title: 'Carrito Vaciado',
          text: 'Se han eliminado todos los productos',
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  }

  // Verificar si hay envío gratis
  get hasFreeShipping(): boolean {
    return this.shippingCost === 0 && this.subtotal > 0;
  }

  // Calcular cuánto falta para envío gratis
  get amountForFreeShipping(): number {
    const threshold = 80000;
    return threshold - this.subtotal;
  }

  // TrackBy para optimizar el renderizado
  trackByProductId(index: number, item: CartItem): number {
    return item.id;
  }
}
