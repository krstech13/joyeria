import { Injectable, signal, computed, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CartItem, CartSummary } from '../models/cart-item.model';
import { Product } from '../models/product.model';

/**
 * Cart Service - Gestión del carrito con Angular Signals
 * 
 * Features:
 * - Signal-based reactive state
 * - localStorage persistence with effect()
 * - WhatsApp integration for order completion
 */

const CART_STORAGE_KEY = 'krs_cart_items';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // Inject platform ID to check if we're in browser
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  // Private writable signals
  private _items = signal<CartItem[]>([]);
  private _isOpen = signal<boolean>(false); // For offcanvas visibility

  // Public readonly computed signals
  readonly items = computed(() => this._items());
  // Public writable signal for two-way binding compatibility
  readonly isOpen = this._isOpen;
  
  // Cart summary calculations
  readonly summary = computed<CartSummary>(() => {
    const items = this._items();
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => 
      sum + (item.product.price * item.quantity), 0
    );
    const tax = subtotal * 0.16; // 16% IVA México
    const total = subtotal + tax;

    return {
      items,
      totalItems,
      subtotal,
      tax,
      total
    };
  });

  // Quick access computed values
  readonly totalItems = computed(() => this.summary().totalItems);
  readonly totalPrice = computed(() => this.summary().total);

  constructor() {
    // Load cart from localStorage on initialization (browser only)
    this.loadFromStorage();
    
    // Sync cart to localStorage whenever items change (browser only)
    if (this.isBrowser) {
      effect(() => {
        const items = this._items();
        try {
          localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
        } catch (e) {
          console.warn('Could not save cart to storage:', e);
        }
      });
    }
  }

  /**
   * Load cart items from localStorage
   */
  private loadFromStorage(): void {
    if (!this.isBrowser) return; // SSR compatibility
    
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const items: CartItem[] = JSON.parse(stored);
        this._items.set(items);
      }
    } catch (e) {
      console.error('Error loading cart from storage:', e);
      this._items.set([]);
    }
  }

  /**
   * Add product to cart
   */
  addToCart(product: Product, quantity: number = 1): void {
    const currentItems = this._items();
    const existingIndex = currentItems.findIndex(item => 
      item.product.id === product.id
    );

    if (existingIndex >= 0) {
      // Update quantity if product already in cart
      const updatedItems = [...currentItems];
      updatedItems[existingIndex] = {
        ...updatedItems[existingIndex],
        quantity: updatedItems[existingIndex].quantity + quantity
      };
      this._items.set(updatedItems);
    } else {
      // Add new item
      const newItem: CartItem = {
        id: Date.now(), // Temporary ID for frontend
        product,
        quantity,
        addedAt: new Date().toISOString()
      };
      this._items.set([...currentItems, newItem]);
    }
  }

  /**
   * Remove item from cart
   */
  removeFromCart(itemId: number): void {
    this._items.set(
      this._items().filter(item => item.id !== itemId)
    );
  }

  /**
   * Update item quantity
   */
  updateQuantity(itemId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(itemId);
      return;
    }

    this._items.set(
      this._items().map(item => 
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  }

  /**
   * Clear entire cart
   */
  clearCart(): void {
    this._items.set([]);
  }

  /**
   * Toggle cart offcanvas visibility
   */
  toggleCart(): void {
    this._isOpen.update(open => !open);
  }

  /**
   * Open cart offcanvas
   */
  openCart(): void {
    this._isOpen.set(true);
  }

  /**
   * Close cart offcanvas
   */
  closeCart(): void {
    this._isOpen.set(false);
  }

  /**
   * Check if product is in cart
   */
  isInCart(productId: number): boolean {
    return this._items().some(item => item.product.id === productId);
  }

  /**
   * Get quantity of specific product in cart
   */
  getQuantity(productId: number): number {
    const item = this._items().find(item => item.product.id === productId);
    return item?.quantity || 0;
  }

  /**
   * Generate WhatsApp message for order
   */
  generateWhatsAppMessage(): string {
    const { items, subtotal, tax, total } = this.summary();
    
    if (items.length === 0) {
      return '';
    }

    const itemsList = items.map(item => 
      `• ${item.product.name} x${item.quantity} - $${(item.product.price * item.quantity).toLocaleString('es-MX')}`
    ).join('\n');

    const message = `¡Hola! Me gustaría completar mi compra en KRS Tech:\n\n` +
      `${itemsList}\n\n` +
      `Subtotal: $${subtotal.toLocaleString('es-MX')}\n` +
      `IVA (16%): $${tax.toLocaleString('es-MX')}\n` +
      `*Total: $${total.toLocaleString('es-MX')}*\n\n` +
      `Por favor, indícame los pasos para finalizar mi pedido. ¡Gracias!`;

    return encodeURIComponent(message);
  }

  /**
   * Generate "Drop a Hint" WhatsApp message for a product
   */
  generateHintMessage(product: Product): string {
    const message = `¡Mira esta belleza que encontré!\n\n` +
      `💎 *${product.name}*\n` +
      `💰 $${product.price.toLocaleString('es-MX')}\n\n` +
      `${product.description.substring(0, 100)}...\n\n` +
      `¿Qué te parece? 😍`;
    
    return encodeURIComponent(message);
  }

  /**
   * Get WhatsApp URL for completing order
   */
  getWhatsAppOrderUrl(phoneNumber: string = '5210000000000'): string {
    const message = this.generateWhatsAppMessage();
    return `https://wa.me/${phoneNumber}?text=${message}`;
  }

  /**
   * Get WhatsApp URL for "Drop a Hint"
   */
  getWhatsAppHintUrl(product: Product, phoneNumber: string = ''): string {
    const message = this.generateHintMessage(product);
    const recipient = phoneNumber || '';
    return `https://wa.me/${recipient}?text=${message}`;
  }
}