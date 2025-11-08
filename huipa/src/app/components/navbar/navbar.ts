import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit, OnDestroy {
  cantidadCarrito: number = 0;
  private carritoSubscription?: Subscription;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    // Suscribirse a los cambios del carrito
    this.carritoSubscription = this.productService.carrito$.subscribe(items => {
      this.cantidadCarrito = this.productService.getCantidadTotal();
    });
  }

  ngOnDestroy(): void {
    if (this.carritoSubscription) {
      this.carritoSubscription.unsubscribe();
    }
  }
}
