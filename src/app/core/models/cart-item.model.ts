import { Product } from './product.model';

/**
 * CartItem DTO - Item del carrito de compras
 * 
 * Mapeado para compatibilidad con Spring Boot Backend.
 * Representa la relación entre un Producto y el Carrito.
 * 
 * Backend Java:
 * - id: Long
 * - product: Product (ManyToOne)
 * - quantity: Integer
 * - addedAt: LocalDateTime
 */
export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  addedAt: string;
}

/**
 * CartItem DTO para envío al backend
 */
export interface CartItemDTO {
  productId: number;
  quantity: number;
}

/**
 * Cart Summary para cálculos en el frontend
 */
export interface CartSummary {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  tax: number;
  total: number;
}