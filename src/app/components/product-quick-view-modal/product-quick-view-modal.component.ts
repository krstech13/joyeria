import {
  Component,
  input,
  output,
  signal,
  effect,
  OnInit,
  OnDestroy,
  HostListener
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product, getProductImages } from '../../core/models/product.model';

@Component({
  selector: 'app-product-quick-view-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen()) {
      <div 
        class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        (click)="onBackdropClick($event)"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"></div>
        
        <!-- Modal Container -->
        <div 
          class="relative w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl glass shadow-2xl animate-modal-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          (click)="$event.stopPropagation()"
        >
          <!-- Close Button -->
          <button
            (click)="close()"
            class="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-all duration-300 hover:rotate-90"
            aria-label="Cerrar modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div class="flex flex-col lg:flex-row h-full max-h-[90vh]">
            <!-- Image Gallery Section -->
            <div class="lg:w-3/5 bg-black/5 relative">
              <!-- Main Image -->
              <div class="relative aspect-square lg:aspect-auto lg:h-full overflow-hidden">
                <img
                  [src]="currentImage()"
                  [alt]="product().name"
                  class="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  [class.scale-110]="isZoomed()"
                  (click)="toggleZoom()"
                />
                
                <!-- Zoom Hint -->
                <div class="absolute bottom-4 left-4 px-3 py-1.5 rounded-full bg-black/50 text-white text-xs backdrop-blur-sm opacity-0 hover:opacity-100 transition-opacity">
                  {{ isZoomed() ? 'Click para salir' : 'Click para zoom' }}
                </div>

                <!-- Navigation Arrows -->
                @if (images().length > 1) {
                  <button
                    (click)="previousImage(); $event.stopPropagation()"
                    class="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm transition-all duration-300 hover:scale-110"
                    aria-label="Imagen anterior"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  <button
                    (click)="nextImage(); $event.stopPropagation()"
                    class="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm transition-all duration-300 hover:scale-110"
                    aria-label="Siguiente imagen"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                }

                <!-- Image Counter -->
                @if (images().length > 1) {
                  <div class="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/50 text-white text-sm backdrop-blur-sm">
                    {{ currentImageIndex() + 1 }} / {{ images().length }}
                  </div>
                }
              </div>

              <!-- Thumbnails -->
              @if (images().length > 1) {
                <div class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                  <div class="flex justify-center gap-2 overflow-x-auto pb-2">
                    @for (image of images(); track $index) {
                      <button
                        (click)="setImage($index)"
                        class="relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300"
                        [class.border-gold]="$index === currentImageIndex()"
                        [class.border-transparent]="$index !== currentImageIndex()"
                        [class.opacity-100]="$index === currentImageIndex()"
                        [class.opacity-70]="$index !== currentImageIndex()"
                        [class.hover:opacity-100]="$index !== currentImageIndex()"
                        aria-label="Ver imagen {{ $index + 1 }}"
                      >
                        <img
                          [src]="image"
                          [alt]="product().name + ' - vista ' + ($index + 1)"
                          class="w-full h-full object-cover"
                        />
                      </button>
                    }
                  </div>
                </div>
              }
            </div>

            <!-- Product Info Section -->
            <div class="lg:w-2/5 p-6 lg:p-8 overflow-y-auto custom-scrollbar">
              <!-- Category & Featured Badge -->
              <div class="flex items-center gap-3 mb-3">
                <span class="text-gold text-xs font-medium uppercase tracking-wider">
                  {{ getCategoryLabel(product().category) }}
                </span>
                @if (product().featured) {
                  <span class="bg-gold/20 text-gold text-xs font-bold px-2 py-1 rounded-full">
                    Destacado
                  </span>
                }
              </div>

              <!-- Product Name -->
              <h2 
                id="modal-title"
                class="font-serif text-2xl lg:text-3xl font-bold theme-text mb-3"
              >
                {{ product().name }}
              </h2>

              <!-- Price -->
              <div class="flex items-baseline gap-2 mb-4">
                <span class="text-3xl font-bold gold-gradient-text">
                  &#36;{{ product().price.toLocaleString('es-MX') }}
                </span>
                @if (product().stock <= 2 && product().stock > 0) {
                  <span class="text-red-500 text-sm font-medium">
                    ¡Últimas {{ product().stock }} unidades!
                  </span>
                }
              </div>

              <!-- Stock Status -->
              <div class="flex items-center gap-2 mb-6">
                <span 
                  class="w-2.5 h-2.5 rounded-full"
                  [class.bg-green-500]="product().stock > 5"
                  [class.bg-yellow-500]="product().stock > 0 && product().stock <= 5"
                  [class.bg-red-500]="product().stock === 0"
                ></span>
                <span class="theme-text-muted text-sm">
                  @if (product().stock === 0) {
                    Agotado
                  } @else if (product().stock <= 5) {
                    Solo {{ product().stock }} disponibles
                  } @else {
                    En stock ({{ product().stock }} disponibles)
                  }
                </span>
              </div>

              <!-- Description -->
              <div class="mb-6">
                <h3 class="font-semibold theme-text mb-2">Descripción</h3>
                <p class="theme-text-muted text-sm leading-relaxed">
                  {{ product().description }}
                </p>
              </div>

              <!-- Quantity Selector -->
              <div class="mb-6">
                <h3 class="font-semibold theme-text mb-3">Cantidad</h3>
                <div class="flex items-center gap-3">
                  <button
                    (click)="decrementQuantity()"
                    [disabled]="quantity() <= 1"
                    class="w-10 h-10 rounded-lg border border-[var(--border-primary)] theme-text hover:bg-[var(--bg-secondary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                    </svg>
                  </button>
                  <span class="w-12 text-center font-semibold theme-text text-lg">{{ quantity() }}</span>
                  <button
                    (click)="incrementQuantity()"
                    [disabled]="quantity() >= product().stock"
                    class="w-10 h-10 rounded-lg border border-[var(--border-primary)] theme-text hover:bg-[var(--bg-secondary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="space-y-3">
                <button
                  (click)="addToCart()"
                  [disabled]="product().stock === 0"
                  class="w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2"
                  [class.bg-gold]="product().stock > 0"
                  [class.text-dark]="product().stock > 0"
                  [class.hover:bg-gold-light]="product().stock > 0"
                  [class.hover:shadow-lg]="product().stock > 0"
                  [class.hover:-translate-y-0.5]="product().stock > 0"
                  [class.bg-gray-300]="product().stock === 0"
                  [class.text-gray-500]="product().stock === 0"
                  [class.cursor-not-allowed]="product().stock === 0"
                >
                  @if (product().stock === 0) {
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Agotado
                  } @else {
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Agregar al Carrito - &#36;{{ (product().price * quantity()).toLocaleString('es-MX') }}
                  }
                </button>

                <!-- Secondary Actions -->
                <div class="flex gap-3">
                  <button
                    (click)="shareOnWhatsApp()"
                    class="flex-1 py-3 rounded-xl border border-[var(--border-primary)] theme-text hover:bg-[var(--bg-secondary)] transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    Compartir
                  </button>
                  
                  <button
                    (click)="viewDetails()"
                    class="flex-1 py-3 rounded-xl border border-gold text-gold hover:bg-gold hover:text-dark transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Ver Más
                  </button>
                </div>
              </div>

              <!-- Additional Info -->
              <div class="mt-6 pt-6 border-t border-[var(--border-primary)]">
                <div class="flex items-center justify-between text-sm theme-text-muted">
                  <span>SKU: KRS-{{ product().id.toString().padStart(4, '0') }}</span>
                  <span>ID: #{{ product().id }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    :host {
      display: contents;
    }

    .animate-fade-in {
      animation: fadeIn 0.3s ease-out;
    }

    .animate-modal-in {
      animation: modalIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes modalIn {
      from {
        opacity: 0;
        transform: scale(0.95) translateY(20px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }

    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
    }

    .custom-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }

    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: var(--border-primary);
      border-radius: 3px;
    }

    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: var(--gold);
    }
  `]
})
export class ProductQuickViewModalComponent implements OnInit, OnDestroy {
  readonly product = input.required<Product>();
  readonly isOpen = input<boolean>(false);
  
  readonly closeModal = output<void>();
  readonly addToCartEvent = output<{ product: Product; quantity: number }>();
  readonly viewDetailsEvent = output<Product>();
  readonly shareEvent = output<Product>();

  // Gallery state
  protected images = signal<string[]>([]);
  protected currentImageIndex = signal(0);
  protected currentImage = signal('');
  protected isZoomed = signal(false);

  // Quantity state
  protected quantity = signal(1);

  private categoryLabels: Record<string, string> = {
    rings: 'Anillos',
    necklaces: 'Collares',
    bracelets: 'Pulseras',
    earrings: 'Aretes',
    watches: 'Relojes'
  };

  constructor() {
    effect(() => {
      const product = this.product();
      const productImages = getProductImages(product);
      this.images.set(productImages);
      this.currentImageIndex.set(0);
      this.currentImage.set(productImages[0] || product.imageUrl);
      this.quantity.set(1);
      this.isZoomed.set(false);
    });

    effect(() => {
      if (this.isOpen()) {
        document.body.style.overflow = 'hidden';
        this.currentImage.set(this.images()[this.currentImageIndex()]);
      } else {
        document.body.style.overflow = '';
      }
    });
  }

  ngOnInit(): void {
    // Preload images
    this.images().forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }

  ngOnDestroy(): void {
    document.body.style.overflow = '';
  }

  @HostListener('document:keydown.escape')
  onEscapePress(): void {
    if (this.isOpen()) {
      this.close();
    }
  }

  @HostListener('document:keydown.arrowleft')
  onArrowLeft(): void {
    if (this.isOpen() && this.images().length > 1) {
      this.previousImage();
    }
  }

  @HostListener('document:keydown.arrowright')
  onArrowRight(): void {
    if (this.isOpen() && this.images().length > 1) {
      this.nextImage();
    }
  }

  close(): void {
    this.closeModal.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    this.close();
  }

  setImage(index: number): void {
    this.currentImageIndex.set(index);
    this.currentImage.set(this.images()[index]);
    this.isZoomed.set(false);
  }

  nextImage(): void {
    const nextIndex = (this.currentImageIndex() + 1) % this.images().length;
    this.setImage(nextIndex);
  }

  previousImage(): void {
    const prevIndex = (this.currentImageIndex() - 1 + this.images().length) % this.images().length;
    this.setImage(prevIndex);
  }

  toggleZoom(): void {
    this.isZoomed.update(z => !z);
  }

  incrementQuantity(): void {
    if (this.quantity() < this.product().stock) {
      this.quantity.update(q => q + 1);
    }
  }

  decrementQuantity(): void {
    if (this.quantity() > 1) {
      this.quantity.update(q => q - 1);
    }
  }

  addToCart(): void {
    if (this.product().stock > 0) {
      this.addToCartEvent.emit({ 
        product: this.product(), 
        quantity: this.quantity() 
      });
      this.close();
    }
  }

  shareOnWhatsApp(): void {
    this.shareEvent.emit(this.product());
  }

  viewDetails(): void {
    this.viewDetailsEvent.emit(this.product());
  }

  getCategoryLabel(category: string): string {
    return this.categoryLabels[category] || category;
  }
}