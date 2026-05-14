import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Product } from '../models/product.model';

const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Anillo Solitario Diamante',
    description: 'Exquisito anillo de oro blanco 18k con diamante certificado de 1.5 quilates. Corte brillante, claridad VS1. Incluye certificado de autenticidad y estuche de lujo.',
    price: 125000,
    imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80',
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&q=80',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80'
    ],
    category: 'rings',
    stock: 3,
    featured: true,
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    name: 'Collar de Perlas Akoya',
    description: 'Elegante collar de perlas cultivadas Akoya de 7-8mm con broche de oro amarillo 14k. Perfecto para ocasiones especiales.',
    price: 45000,
    imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80',
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80'
    ],
    category: 'necklaces',
    stock: 5,
    featured: true,
    createdAt: '2024-01-20T10:00:00Z'
  },
  {
    id: 3,
    name: 'Pulsera Tennis de Diamantes',
    description: 'Deslumbrante pulsera tennis con 52 diamantes brillantes totales de 3.0 quilates. Montura en platino.',
    price: 185000,
    imageUrl: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80',
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&q=80',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80'
    ],
    category: 'bracelets',
    stock: 2,
    featured: true,
    createdAt: '2024-02-01T10:00:00Z'
  },
  {
    id: 4,
    name: 'Aretes Colgantes Rubí',
    description: 'Sofisticados aretes con rubíes birmanos de 2 quilates cada uno, rodeados de halo de diamantes. Gancho de seguridad.',
    price: 78000,
    imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80',
      'https://images.unsplash.com/photo-1635767798638-3e2523c0188b?w=800&q=80',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80'
    ],
    category: 'earrings',
    stock: 4,
    featured: false,
    createdAt: '2024-02-10T10:00:00Z'
  },
  {
    id: 5,
    name: 'Reloj Clásico de Lujo',
    description: 'Reloj automático suizo con caja de oro macizo, esfera de nácar y correa de cocodrilo genuino. Resistente al agua 50m.',
    price: 245000,
    imageUrl: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80',
      'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&q=80',
      'https://images.unsplash.com/photo-1619134778706-7015533a6150?w=800&q=80'
    ],
    category: 'watches',
    stock: 2,
    featured: true,
    createdAt: '2024-02-15T10:00:00Z'
  },
  {
    id: 6,
    name: 'Anillo de Zafiro Azul',
    description: 'Majestuoso anillo con zafiro azul natural de Sri Lanka de 3.5 quilates. Diseño art déco con diamantes laterales.',
    price: 165000,
    imageUrl: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&q=80',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80'
    ],
    category: 'rings',
    stock: 1,
    featured: false,
    createdAt: '2024-02-20T10:00:00Z'
  },
  {
    id: 7,
    name: 'Collar de Esmeraldas',
    description: 'Lujoso collar con 15 esmeraldas colombianas de alta calidad en oro amarillo 18k. Cierre de seguridad con diamante.',
    price: 320000,
    imageUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80'
    ],
    category: 'necklaces',
    stock: 1,
    featured: true,
    createdAt: '2024-03-01T10:00:00Z'
  },
  {
    id: 8,
    name: 'Pulsera de Oro Amarillo',
    description: 'Elegante pulsera de eslabones en oro amarillo italiano 18k. Diseño clásico atemporal.',
    price: 35000,
    imageUrl: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&q=80',
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80'
    ],
    category: 'bracelets',
    stock: 8,
    featured: false,
    createdAt: '2024-03-05T10:00:00Z'
  }
];

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private _products = signal<Product[]>([]);
  private _selectedCategory = signal<string>('all');
  private _isLoading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  readonly products = computed(() => this._products());
  readonly selectedCategory = computed(() => this._selectedCategory());
  readonly isLoading = computed(() => this._isLoading());
  readonly error = computed(() => this._error());

  readonly filteredProducts = computed(() => {
    const category = this._selectedCategory();
    const products = this._products();
    
    if (category === 'all') {
      return products;
    }
    return products.filter(p => p.category === category);
  });

  readonly featuredProducts = computed(() => 
    this._products().filter(p => p.featured)
  );

  constructor(private http: HttpClient) {
    this.loadProducts();
  }

  loadProducts(): void {
    this._isLoading.set(true);
    this._error.set(null);

    setTimeout(() => {
      this._products.set(MOCK_PRODUCTS);
      this._isLoading.set(false);
    }, 500);

    /*
    this.http.get<Product[]>('/api/products').subscribe({
      next: (products) => {
        this._products.set(products);
        this._isLoading.set(false);
      },
      error: (err) => {
        this._error.set('Error loading products');
        this._isLoading.set(false);
      }
    });
    */
  }

  setCategory(category: string): void {
    this._selectedCategory.set(category);
  }

  getProductById(id: number): Observable<Product | undefined> {
    return of(MOCK_PRODUCTS.find(p => p.id === id));
    // return this.http.get<Product>(`/api/products/${id}`);
  }

  getFeaturedProducts(): Observable<Product[]> {
    return of(MOCK_PRODUCTS.filter(p => p.featured));
    // return this.http.get<Product[]>('/api/products/featured');
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return of(MOCK_PRODUCTS.filter(p => p.category === category));
    // return this.http.get<Product[]>(`/api/products/category/${category}`);
  }

  searchProducts(query: string): Product[] {
    const lowerQuery = query.toLowerCase();
    return this._products().filter(p => 
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery)
    );
  }
}