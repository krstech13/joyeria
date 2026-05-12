import { Routes } from '@angular/router';
import { CatalogComponent } from './pages/catalog/catalog.component';

export const routes: Routes = [
  {
    path: '',
    component: CatalogComponent,
    title: 'KRS Tech - Joyería de Lujo'
  },
  {
    path: 'catalogo',
    component: CatalogComponent,
    title: 'Catálogo - KRS Tech'
  },
  {
    path: '**',
    redirectTo: ''
  }
];