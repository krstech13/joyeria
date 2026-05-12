import { Component, model, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-cart-offcanvas',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen()) {
      <div class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in" (click)="closeCart()"></div>
    }
    
    @if (isOpen()) {
      <aside class="fixed right-0 top-0 h-full w-full max-w-md z-50 theme-bg-secondary border-l border-[var(--border-primary)] shadow-2xl flex flex-col animate-slide-in-right">
        <div class="flex items-center justify-between p-6 border-b border-[var(--border-primary)]">
          <div>
            <h2 class="font-serif text-2xl font-bold gold-gradient-text">Tu Carrito</h2>
            <p class="theme-text-muted text-sm mt-1">{{ cartSummary().totalItems }} artículo(s)</p>
          </div>
          <button (click)="closeCart()" class="p-2 theme-text-muted hover:text-gold transition-colors duration-300 rounded-full hover:bg-[var(--glass-bg)]">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="flex-1 overflow-y-auto p-6 space-y-4">
          @if (cartSummary().items.length === 0) {
            <div class="text-center py-12">
              <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-[var(--glass-bg)] flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 theme-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p class="theme-text-secondary text-lg">Tu carrito está vacío</p>
              <p class="theme-text-muted text-sm mt-2">Explora nuestro catálogo de joyería</p>
              <button (click)="closeCart()" class="mt-6 glass-button text-sm">Ver Catálogo</button>
            </div>
          } @else {
            @for (item of cartSummary().items; track item.id) {
              <div class="glass-card p-4 flex gap-4 group">
                <div class="w-20 h-20 rounded-lg overflow-hidden theme-bg-tertiary flex-shrink-0">
                  <img [src]="item.product.imageUrl" [alt]="item.product.name" class="w-full h-full object-cover">
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="font-serif font-semibold theme-text truncate">{{ item.product.name }}</h3>
                  <p class="text-gold text-sm font-medium">&#36;{{ item.product.price.toLocaleString('es-MX') }}</p>
                  <div class="flex items-center gap-3 mt-2">
                    <button (click)="updateQuantity(item.id, item.quantity - 1)" class="w-8 h-8 rounded-full bg-[var(--glass-bg)] hover:bg-[var(--border-primary)] flex items-center justify-center theme-text-muted hover:theme-text transition-colors duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                      </svg>
                    </button>
                    <span class="theme-text font-medium w-8 text-center">{{ item.quantity }}</span>
                    <button (click)="updateQuantity(item.id, item.quantity + 1)" class="w-8 h-8 rounded-full bg-[var(--glass-bg)] hover:bg-[var(--border-primary)] flex items-center justify-center theme-text-muted hover:theme-text transition-colors duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>
                <button (click)="removeItem(item.id)" class="self-start p-2 theme-text-muted hover:text-red-400 transition-colors duration-300 opacity-0 group-hover:opacity-100">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            }
          }
        </div>

        @if (cartSummary().items.length > 0) {
          <div class="p-6 border-t border-[var(--border-primary)] space-y-4 theme-bg-secondary">
            <div class="space-y-2 text-sm">
              <div class="flex justify-between theme-text-muted">
                <span>Subtotal</span>
                <span>&#36;{{ cartSummary().subtotal.toLocaleString('es-MX') }}</span>
              </div>
              <div class="flex justify-between theme-text-muted">
                <span>IVA (16%)</span>
                <span>&#36;{{ cartSummary().tax.toLocaleString('es-MX') }}</span>
              </div>
              <div class="flex justify-between text-xl font-bold pt-2 border-t border-[var(--border-primary)]">
                <span class="gold-gradient-text">Total</span>
                <span class="gold-gradient-text">&#36;{{ cartSummary().total.toLocaleString('es-MX') }}</span>
              </div>
            </div>
            <div class="space-y-3">
              <a [href]="whatsappOrderUrl" target="_blank" (click)="closeCart()" class="block w-full text-center glass-button py-4 font-semibold">
                Completar Compra por WhatsApp
              </a>
              <button (click)="clearCart()" class="w-full py-3 theme-text-muted hover:text-red-400 text-sm transition-colors duration-300">
                Vaciar Carrito
              </button>
            </div>
          </div>
        }
      </aside>
    }
  `,
  styles: [`
    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    .animate-slide-in-right {
      animation: slideInRight 0.3s ease-out;
    }
  `]
})
export class CartOffcanvasComponent {
  readonly isOpen = model<boolean>(false);
  protected cartService = inject(CartService);
  protected cartSummary = this.cartService.summary;
  protected whatsappOrderUrl = this.cartService.getWhatsAppOrderUrl();

  closeCart(): void {
    this.isOpen.set(false);
  }

  updateQuantity(itemId: number, quantity: number): void {
    this.cartService.updateQuantity(itemId, quantity);
  }

  removeItem(itemId: number): void {
    this.cartService.removeFromCart(itemId);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }
}