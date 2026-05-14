import { Component, input, output } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  template: `
    <article class="glass-card group overflow-hidden">
      <div class="relative aspect-square overflow-hidden rounded-xl mb-4">
        <img 
          [ngSrc]="product().imageUrl" 
          [alt]="product().name"
          fill
          class="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
        
        @if (product().featured) {
          <span class="absolute top-3 left-3 bg-gold text-dark text-xs font-bold px-3 py-1 rounded-full">
            Destacado
          </span>
        }

        @if (product().stock <= 2) {
          <span class="absolute top-3 right-3 bg-red-500/80 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">
            ¡Últimas {{ product().stock }}!
          </span>
        }

        <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3">
          <!-- Quick View Button -->
          <button 
            (click)="onQuickView(); $event.stopPropagation()"
            class="p-3 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm transform -translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:scale-110"
            title="Vista Rápida"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>

          <button 
            (click)="onAddToCart()"
            [disabled]="product().stock === 0"
            class="glass-button disabled:opacity-50 disabled:cursor-not-allowed transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75"
          >
            {{ product().stock === 0 ? 'Agotado' : 'Agregar' }}
          </button>
        </div>
      </div>

      <div class="space-y-2">
        <span class="text-gold text-xs font-medium uppercase tracking-wider">
          {{ getCategoryLabel(product().category) }}
        </span>

        <h3 class="font-serif text-lg font-semibold theme-text line-clamp-1 group-hover:text-gold transition-colors">
          {{ product().name }}
        </h3>

        <p class="theme-text-muted text-sm line-clamp-2 h-10">
          {{ product().description }}
        </p>

        <div class="flex items-center justify-between pt-3 border-t border-[var(--border-primary)]">
          <span class="text-xl font-bold gold-gradient-text">
            &#36;{{ product().price.toLocaleString('es-MX') }}
          </span>

          <button 
            (click)="onDropHint()"
            class="p-2 theme-text-muted hover:text-gold transition-colors duration-300"
            title="Compartir por WhatsApp"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  `
})
export class ProductCardComponent {
  readonly product = input.required<Product>();
  readonly addToCart = output<Product>();
  readonly dropHint = output<Product>();
  readonly quickView = output<Product>();

  private categoryLabels: Record<string, string> = {
    rings: 'Anillos',
    necklaces: 'Collares',
    bracelets: 'Pulseras',
    earrings: 'Aretes',
    watches: 'Relojes'
  };

  getCategoryLabel(category: string): string {
    return this.categoryLabels[category] || category;
  }

  onAddToCart(): void {
    if (this.product().stock > 0) {
      this.addToCart.emit(this.product());
    }
  }

  onDropHint(): void {
    this.dropHint.emit(this.product());
  }

  onQuickView(): void {
    this.quickView.emit(this.product());
  }
}
