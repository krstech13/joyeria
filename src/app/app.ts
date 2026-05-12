import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CartOffcanvasComponent } from './components/cart-offcanvas/cart-offcanvas.component';
import { CartService } from './core/services/cart.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, CartOffcanvasComponent],
  template: `
    <div class="min-h-screen">
      <app-navbar (cartClick)="openCart()" />
      
      <main>
        <router-outlet />
      </main>
      
      <app-cart-offcanvas [(isOpen)]="cartIsOpen" />
    </div>
  `
})
export class App {
  private cartService = inject(CartService);
  
  get cartIsOpen() {
    return this.cartService.isOpen;
  }
  
  openCart(): void {
    this.cartService.openCart();
  }
}