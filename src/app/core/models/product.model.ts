/**
 * Product DTO - Mapeado para compatibilidad con Spring Boot Backend
 * 
 * Representa la entidad Product del backend Java:
 * - id: Long (PostgreSQL bigint)
 * - name: String
 * - description: String
 * - price: BigDecimal (number en TypeScript)
 * - imageUrl: String (imagen principal - mantenida para compatibilidad)
 * - images: String[] (galería de imágenes para Quick View)
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
  images?: string[]; // Galería de imágenes para Quick View
  category: 'rings' | 'necklaces' | 'bracelets' | 'earrings' | 'watches';
  stock: number;
  featured: boolean;
  createdAt: string;
}

/**
 * Helper para obtener todas las imágenes de un producto
 * Si no tiene images array, retorna array con imageUrl único
 */
export function getProductImages(product: Product): string[] {
  if (product.images && product.images.length > 0) {
    return product.images;
  }
  return [product.imageUrl];
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