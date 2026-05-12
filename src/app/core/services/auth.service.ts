import { Injectable, signal, computed, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';

/**
 * Auth Service - Gestión de autenticación JWT
 * 
 * Preparado para integración con Spring Boot + Spring Security
 * Endpoints esperados del backend:
 * - POST /api/auth/login
 * - POST /api/auth/register
 * - POST /api/auth/refresh
 */

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'krs_token';
  private readonly REFRESH_TOKEN_KEY = 'krs_refresh_token';
  private readonly USER_KEY = 'krs_user';

  // Inject platform ID to check if we're in browser
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  // Signals for reactive state management
  private _isAuthenticated = signal<boolean>(false);
  private _currentUser = signal<AuthResponse['user'] | null>(null);
  private _isLoading = signal<boolean>(false);

  // Public readonly signals
  readonly isAuthenticated = computed(() => this._isAuthenticated());
  readonly currentUser = computed(() => this._currentUser());
  readonly isLoading = computed(() => this._isLoading());

  constructor(private http: HttpClient) {
    // Check for existing session on initialization (browser only)
    this.checkAuthStatus();
  }

  /**
   * Check if user has valid token in localStorage
   */
  private checkAuthStatus(): void {
    if (!this.isBrowser) return; // SSR compatibility
    
    try {
      const token = localStorage.getItem(this.TOKEN_KEY);
      const user = localStorage.getItem(this.USER_KEY);
      
      if (token && user) {
        this._isAuthenticated.set(true);
        this._currentUser.set(JSON.parse(user));
      }
    } catch (e) {
      console.warn('Could not check auth status:', e);
    }
  }

  /**
   * Login with credentials
   * TODO: Uncomment when backend is ready
   */
  login(credentials: LoginRequest): Observable<AuthResponse | null> {
    this._isLoading.set(true);
    
    // MOCK: Simulate successful login for UI development
    // Remove this when backend is ready
    const mockResponse: AuthResponse = {
      token: 'mock-jwt-token-' + Date.now(),
      refreshToken: 'mock-refresh-token-' + Date.now(),
      expiresIn: 3600,
      user: {
        id: 1,
        name: 'Cliente KRS',
        email: credentials.email,
        role: 'CUSTOMER'
      }
    };
    
    this.storeAuthData(mockResponse);
    this._isLoading.set(false);
    return of(mockResponse);

    /*
    // REAL IMPLEMENTATION - Uncomment when Spring Boot backend is ready:
    return this.http.post<AuthResponse>('/api/auth/login', credentials).pipe(
      tap(response => this.storeAuthData(response)),
      catchError(error => {
        this._isLoading.set(false);
        console.error('Login failed:', error);
        return of(null);
      }),
      tap(() => this._isLoading.set(false))
    );
    */
  }

  /**
   * Register new user
   * TODO: Uncomment when backend is ready
   */
  register(data: RegisterRequest): Observable<AuthResponse | null> {
    this._isLoading.set(true);

    // MOCK: Simulate successful registration
    const mockResponse: AuthResponse = {
      token: 'mock-jwt-token-' + Date.now(),
      refreshToken: 'mock-refresh-token-' + Date.now(),
      expiresIn: 3600,
      user: {
        id: Date.now(),
        name: data.name,
        email: data.email,
        role: 'CUSTOMER'
      }
    };

    this.storeAuthData(mockResponse);
    this._isLoading.set(false);
    return of(mockResponse);

    /*
    // REAL IMPLEMENTATION - Uncomment when Spring Boot backend is ready:
    return this.http.post<AuthResponse>('/api/auth/register', data).pipe(
      tap(response => this.storeAuthData(response)),
      catchError(error => {
        this._isLoading.set(false);
        console.error('Registration failed:', error);
        return of(null);
      }),
      tap(() => this._isLoading.set(false))
    );
    */
  }

  /**
   * Logout user and clear storage
   */
  logout(): void {
    if (this.isBrowser) {
      try {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.REFRESH_TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
      } catch (e) {
        console.warn('Could not clear auth data:', e);
      }
    }
    
    this._isAuthenticated.set(false);
    this._currentUser.set(null);
  }

  /**
   * Get current JWT token
   */
  getToken(): string | null {
    if (!this.isBrowser) return null;
    
    try {
      return localStorage.getItem(this.TOKEN_KEY);
    } catch (e) {
      console.warn('Could not get token:', e);
      return null;
    }
  }

  /**
   * Store authentication data
   */
  private storeAuthData(response: AuthResponse): void {
    if (!this.isBrowser) return;
    
    try {
      localStorage.setItem(this.TOKEN_KEY, response.token);
      localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refreshToken);
      localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
    } catch (e) {
      console.warn('Could not store auth data:', e);
    }
    
    this._isAuthenticated.set(true);
    this._currentUser.set(response.user);
  }

  /**
   * Refresh token before expiration
   * TODO: Implement when backend is ready
   */
  refreshToken(): Observable<AuthResponse | null> {
    if (!this.isBrowser) {
      return of(null);
    }
    
    let refreshToken: string | null = null;
    try {
      refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);
    } catch (e) {
      console.warn('Could not get refresh token:', e);
    }
    
    if (!refreshToken) {
      this.logout();
      return of(null);
    }

    // MOCK: Return null for now
    return of(null);

    /*
    // REAL IMPLEMENTATION:
    return this.http.post<AuthResponse>('/api/auth/refresh', { refreshToken }).pipe(
      tap(response => this.storeAuthData(response)),
      catchError(error => {
        console.error('Token refresh failed:', error);
        this.logout();
        return of(null);
      })
    );
    */
  }
}
