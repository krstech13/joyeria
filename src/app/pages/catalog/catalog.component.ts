import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductQuickViewModalComponent } from '../../components/product-quick-view-modal/product-quick-view-modal.component';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, ProductQuickViewModalComponent],
  template: `
    <div class="min-h-screen pb-20">
      <!-- Hero Section -->
      <section class="relative py-20 px-6 text-center">
        <div class="max-w-4xl mx-auto">
          <span class="text-gold text-sm font-medium uppercase tracking-widest mb-4 block">
            Colección Exclusiva
          </span>
          <h1 class="font-serif text-5xl md:text-6xl font-bold gold-gradient-text mb-6">
            Joyería de Lujo KRS Tech
          </h1>
          <p class="theme-text-secondary text-lg max-w-2xl mx-auto">
            Descubre nuestra exquisita colección de piezas únicas, elaboradas con los materiales más finos 
            y diseñadas para perdurar por generaciones.
          </p>
        </div>
      </section>

      <!-- Filters -->
      <section class="px-6 mb-12">
        <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-4">
          @for (category of categories; track category.value) {
            <button 
              (click)="setCategory(category.value)"
              [class]="selectedCategory() === category.value 
                ? 'bg-gold text-dark' 
                : 'bg-[var(--glass-bg)] theme-text-secondary hover:bg-[var(--border-primary)] hover:text-gold'"
              class="px-6 py-2 rounded-full text-sm font-medium transition-all duration-300"
            >
              {{ category.label }}
            </button>
          }
        </div>
      </section>

      <!-- Products Grid -->
      <section class="px-6">
        <div class="max-w-7xl mx-auto">
          @if (productService.isLoading()) {
            <div class="flex items-center justify-center py-20">
              <div class="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
            </div>
          } @else {
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              @for (product of filteredProducts(); track product.id) {
                <app-product-card 
                  [product]="product"
                  (addToCart)="onAddToCart($event)"
                  (dropHint)="onDropHint($event)"
                  (quickView)="onQuickView($event)"
                />
              }
            </div>
          }

          <!-- Quick View Modal -->
          @if (selectedProduct()) {
            <app-product-quick-view-modal
              [product]="selectedProduct()!"
              [isOpen]="isQuickViewOpen()"
              (closeModal)="closeQuickView()"
              (addToCartEvent)="onAddToCartFromModal($event)"
              (shareEvent)="onShareFromModal($event)"
              (viewDetailsEvent)="onViewDetails($event)"
            />
          }

          @if (filteredProducts().length === 0 && !productService.isLoading()) {
            <div class="text-center py-20">
              <p class="theme-text-secondary text-lg">No se encontraron productos en esta categoría</p>
            </div>
          }
        </div>
      </section>

      <!-- Featured Section -->
      <section class="px-6 mt-20">
        <div class="max-w-7xl mx-auto">
          <div class="glass-card p-8 md:p-12 text-center">
            <h2 class="font-serif text-3xl md:text-4xl font-bold gold-gradient-text mb-4">
              ¿Buscas algo único?
            </h2>
            <p class="theme-text-secondary max-w-2xl mx-auto mb-6">
              Contáctanos para piezas personalizadas o consulta sobre disponibilidad de artículos exclusivos.
            </p>
            <a 
              href="https://wa.me/5210000000000?text=Hola,%20me%20interesa%20una%20pieza%20personalizada"
              target="_blank"
              class="glass-button inline-block"
            >
              Solicitar Pieza Personalizada
            </a>
          </div>
        </div>
      </section>
    </div>
  `
})
export class CatalogComponent {
  protected productService = inject(ProductService);
  private cartService = inject(CartService);

  // Quick View Modal State
  protected selectedProduct = signal<Product | null>(null);
  protected isQuickViewOpen = signal(false);

  categories = [
    { label: 'Todos', value: 'all' },
    { label: 'Anillos', value: 'rings' },
    { label: 'Collares', value: 'necklaces' },
    { label: 'Pulseras', value: 'bracelets' },
    { label: 'Aretes', value: 'earrings' },
    { label: 'Relojes', value: 'watches' }
  ];

  selectedCategory = this.productService.selectedCategory;

  filteredProducts = this.productService.filteredProducts;

  setCategory(category: string): void {
    this.productService.setCategory(category);
  }

  onAddToCart(product: Product): void {
    this.cartService.addToCart(product);
    this.cartService.openCart();
  }

  onDropHint(product: Product): void {
    const url = this.cartService.getWhatsAppHintUrl(product);
    window.open(url, '_blank');
  }

  // Quick View Modal Handlers
  onQuickView(product: Product): void {
    this.selectedProduct.set(product);
    this.isQuickViewOpen.set(true);
  }

  closeQuickView(): void {
    this.isQuickViewOpen.set(false);
    // Delay clearing the product to allow exit animation
    setTimeout(() => {
      this.selectedProduct.set(null);
    }, 300);
  }

  onAddToCartFromModal(event: { product: Product; quantity: number }): void {
    this.cartService.addToCart(event.product, event.quantity);
    this.cartService.openCart();
  }

  onShareFromModal(product: Product): void {
    const url = this.cartService.getWhatsAppHintUrl(product);
    window.open(url, '_blank');
  }

  onViewDetails(product: Product): void {
    // For now, just close the modal. In the future, this could navigate to a product detail page
    this.closeQuickView();
    console.log('Navigate to product details:', product.id);
  }
}
