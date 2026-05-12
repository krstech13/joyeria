import { Component, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { ThemeService } from '../../core/services/theme.service';

/**
 * Navbar Component - Signal APIs
 * 
 * Features:
 * - input() for external data
 * - output() for events
 * - Glassmorphism design
 * - Cart badge with Signal
 */
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav class="glass-nav w-full px-6 py-4">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <!-- Logo -->
        <a routerLink="/" class="flex items-center gap-3 group">
          <div class="w-10 h-10 rounded-full gold-border flex items-center justify-center
                      group-hover:scale-105 transition-transform duration-300">
            <span class="text-gold font-serif text-xl font-bold">KRS</span>
          </div>
          <span class="text-xl font-serif font-semibold gold-gradient-text hidden sm:block">
            Tech
          </span>
        </a>

        <!-- Navigation Links -->
        <div class="hidden md:flex items-center gap-8">
          @for (link of navLinks(); track link.path) {
            <a [routerLink]="link.path"
               class="text-gray-300 hover:text-gold transition-colors duration-300
                      text-sm font-medium tracking-wide">
              {{ link.label }}
            </a>
          }
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-4">
          <!-- Theme Toggle Button -->
          <button (click)="toggleTheme()"
                  class="p-2 theme-text-secondary hover:text-gold transition-colors duration-300"
                  [attr.aria-label]="themeService.isDark() ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'">
            @if (themeService.isDark()) {
              <!-- Sun icon for dark mode -->
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" 
                   viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            } @else {
              <!-- Moon icon for light mode -->
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" 
                   viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            }
          </button>

          <!-- Search Button -->
          <button (click)="onSearchClick()"
                  class="p-2 text-gray-300 hover:text-gold transition-colors duration-300"
                  aria-label="Buscar">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" 
                 viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          <!-- Cart Button -->
          <button (click)="onCartClick()"
                  class="relative p-2 text-gray-300 hover:text-gold transition-colors duration-300"
                  aria-label="Carrito">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" 
                 viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            
            <!-- Cart Badge -->
            @if (cartItemCount() > 0) {
              <span class="absolute -top-1 -right-1 bg-gold text-dark text-xs font-bold 
                         rounded-full h-5 w-5 flex items-center justify-center animate-fade-in">
                {{ cartItemCount() }}
              </span>
            }
          </button>

          <!-- Mobile Menu Button -->
          <button (click)="onMenuToggle()"
                  class="md:hidden p-2 text-gray-300 hover:text-gold transition-colors duration-300"
                  aria-label="Menú">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" 
                 viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      @if (isMenuOpen()) {
        <div class="md:hidden mt-4 pb-4 border-t border-white/10 pt-4 animate-slide-up">
          @for (link of navLinks(); track link.path) {
            <a [routerLink]="link.path"
               (click)="onMenuToggle()"
               class="block py-2 text-gray-300 hover:text-gold transition-colors duration-300
                      text-sm font-medium">
              {{ link.label }}
            </a>
          }
        </div>
      }
    </nav>
  `
})
export class NavbarComponent {
  // Signal inputs
  readonly navLinks = input<{ label: string; path: string }[]>([
    { label: 'Inicio', path: '/' },
    { label: 'Catálogo', path: '/catalogo' },
    { label: 'Colecciones', path: '/colecciones' },
    { label: 'Nosotros', path: '/nosotros' }
  ]);

  // Signal outputs
  readonly searchClick = output<void>();
  readonly cartClick = output<void>();
  readonly menuToggle = output<boolean>();

  // Private signals
  private _isMenuOpen = false;

  // Inject services
  private cartService = inject(CartService);
  protected themeService = inject(ThemeService);

  // Computed from service
  protected cartItemCount = this.cartService.totalItems;

  // Getters
  get isMenuOpen(): () => boolean {
    return () => this._isMenuOpen;
  }

  // Event handlers
  onSearchClick(): void {
    this.searchClick.emit();
  }

  onCartClick(): void {
    this.cartClick.emit();
  }

  onMenuToggle(): void {
    this._isMenuOpen = !this._isMenuOpen;
    this.menuToggle.emit(this._isMenuOpen);
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
