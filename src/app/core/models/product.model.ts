/**
 * Product DTO - Mapeado para compatibilidad con Spring Boot Backend
 * 
 * Representa la entidad Product del backend Java:
 * - id: Long (PostgreSQL bigint)
 * - name: String
 * - description: String
 * - price: BigDecimal (number en TypeScript)
 * - imageUrl: String
 * - category: String
 * - stock: Integer
 * - featured: Boolean
 * - createdAt: LocalDateTime (ISO string)
 */
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: 'rings' | 'necklaces' | 'bracelets' | 'earrings' | 'watches';
  stock: number;
  featured: boolean;
  createdAt: string;
}

/**
 * Product DTO para envío al backend (creación/actualización)
 * Omite campos autogenerados como id y createdAt
 */
export interface ProductDTO {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: 'rings' | 'necklaces' | 'bracelets' | 'earrings' | 'watches';
  stock: number;
  featured: boolean;
}