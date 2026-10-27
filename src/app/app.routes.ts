import { Routes } from '@angular/router';

import { Inscricoes } from './pages/inscricoes/inscricoes';
import { NovaInscricao } from './pages/nova-inscricao/nova-inscricao';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'inscricoes',
    pathMatch: 'full'
  },
  {
    path: 'inscricoes',
    component: Inscricoes,
    children: [
      {
        path: 'nova',
        component: NovaInscricao
      }
    ]
  }
];