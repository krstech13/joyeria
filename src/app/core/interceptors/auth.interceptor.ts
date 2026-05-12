import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { catchError, throwError } from 'rxjs';

/**
 * JWT Auth Interceptor - Prepared for Spring Boot Backend
 * 
 * This interceptor:
 * 1. Attaches Bearer token to outgoing requests
 * 2. Handles 401/403 errors
 * 3. Currently allows navigation (non-blocking) for static UI phase
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Skip interceptor for non-API requests during static phase
  if (!req.url.includes('/api/')) {
    return next(req);
  }

  // Check if we're in browser environment (SSR compatibility)
  const platformId = inject(PLATFORM_ID);
  const isBrowser = isPlatformBrowser(platformId);

  // Get token from localStorage only if in browser
  let token: string | null = null;
  if (isBrowser) {
    try {
      token = localStorage.getItem('krs_token');
    } catch (e) {
      console.warn('Could not access localStorage:', e);
    }
  }
  
  // Clone request and add Authorization header if token exists
  const authReq = token 
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle authentication errors
      if (error.status === 401) {
        // Token expired or invalid - clear and redirect to login
        if (isBrowser) {
          try {
            localStorage.removeItem('krs_token');
          } catch (e) {
            console.warn('Could not remove token from localStorage:', e);
          }
        }
        console.warn('Session expired. Redirecting to login...');
        // TODO: Implement router navigation to login page when auth is ready
        // inject(Router).navigate(['/login']);
      } else if (error.status === 403) {
        console.error('Forbidden: Insufficient permissions');
      }
      
      return throwError(() => error);
    })
  );
};
