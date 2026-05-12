import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // Zoneless change detection for maximum performance (Angular 21+)
    provideZonelessChangeDetection(),
    
    // Router configuration
    provideRouter(routes),
    
    // SSR Hydration with event replay
    provideClientHydration(withEventReplay()),
    
    // HTTP Client with JWT interceptor (prepared for Spring Boot backend)
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
  ]
};