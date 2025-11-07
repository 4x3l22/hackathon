import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import Swal from 'sweetalert2';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  maxQuantity?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  private shippingCost = new BehaviorSubject<number>(5000); // Costo fijo de envío

  // Observables públicos
  cartItems$ = this.cartItems.asObservable();
  shippingCost$ = this.shippingCost.asObservable();

  constructor() {
    // Cargar carrito del localStorage al iniciar
    this.loadCartFromStorage();
  }

  // Obtener items actuales del carrito
  getCartItems(): CartItem[] {
    return this.cartItems.value;
  }

  // Agregar producto al carrito
  addToCart(product: CartItem): void {
    const currentItems = this.cartItems.value;
    const existingItemIndex = currentItems.findIndex(item => item.id === product.id);

    if (existingItemIndex > -1) {
      // Si el producto ya existe, incrementar cantidad
      currentItems[existingItemIndex].quantity += product.quantity;
    } else {
      // Si es nuevo, agregarlo
      currentItems.push(product);
    }

    this.cartItems.next(currentItems);
    this.saveCartToStorage();

    // Mostrar notificación snackbar
    this.showSnackbar('Producto agregado al carrito', 'success');
  }

  // Actualizar cantidad de un producto
  updateQuantity(productId: number, quantity: number): void {
    const currentItems = this.cartItems.value;
    const itemIndex = currentItems.findIndex(item => item.id === productId);

    if (itemIndex > -1) {
      if (quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        currentItems[itemIndex].quantity = quantity;
        this.cartItems.next(currentItems);
        this.saveCartToStorage();
      }
    }
  }

  // Incrementar cantidad
  increaseQuantity(productId: number): void {
    const currentItems = this.cartItems.value;
    const item = currentItems.find(item => item.id === productId);
    
    if (item) {
      item.quantity++;
      this.cartItems.next(currentItems);
      this.saveCartToStorage();
    }
  }

  // Decrementar cantidad
  decreaseQuantity(productId: number): void {
    const currentItems = this.cartItems.value;
    const item = currentItems.find(item => item.id === productId);
    
    if (item) {
      if (item.quantity > 1) {
        item.quantity--;
        this.cartItems.next(currentItems);
        this.saveCartToStorage();
      } else {
        this.removeFromCart(productId);
      }
    }
  }

  // Eliminar producto del carrito
  removeFromCart(productId: number): void {
    Swal.fire({
      title: '¿Eliminar producto?',
      text: '¿Estás seguro de que deseas eliminar este producto del carrito?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#a07034',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const currentItems = this.cartItems.value.filter(item => item.id !== productId);
        this.cartItems.next(currentItems);
        this.saveCartToStorage();

        this.showSnackbar('Producto eliminado del carrito', 'info');
      }
    });
  }

  // Vaciar carrito
  clearCart(): void {
    this.cartItems.next([]);
    this.saveCartToStorage();
  }

  // Calcular subtotal
  getSubtotal(): number {
    return this.cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  // Obtener costo de envío
  getShippingCost(): number {
    const subtotal = this.getSubtotal();
    // Envío gratis en compras mayores a $80,000
    return subtotal >= 80000 ? 0 : this.shippingCost.value;
  }

  // Calcular total
  getTotal(): number {
    return this.getSubtotal() + this.getShippingCost();
  }

  // Obtener cantidad total de items
  getTotalItems(): number {
    return this.cartItems.value.reduce((total, item) => total + item.quantity, 0);
  }

  // Guardar carrito en localStorage
  private saveCartToStorage(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItems.value));
  }

  // Cargar carrito desde localStorage
  private loadCartFromStorage(): void {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const items = JSON.parse(savedCart);
        this.cartItems.next(items);
      } catch (error) {
        console.error('Error al cargar el carrito:', error);
      }
    }
  }

  // Mostrar notificación snackbar
  private showSnackbar(message: string, icon: 'success' | 'error' | 'info'): void {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      }
    });

    Toast.fire({
      icon: icon,
      title: message
    });
  }
}
