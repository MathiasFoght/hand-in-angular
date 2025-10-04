import { Routes } from '@angular/router';
import { Home } from './screens/home/home';
import { AddCreditCard } from './screens/add-credit-card/add-credit-card';
import { CreditCardDetails } from './screens/credit-card-details/credit-card-details';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },

  {
    path: 'login',
    loadComponent: () => import('./screens/login/login').then(m => m.Login)
  },

  {
    path: 'home',
    component: Home,
    canActivate: [authGuard]
  },
  {
    path: 'add-credit-card',
    component: AddCreditCard,
    canActivate: [authGuard]
  },

  {
    path: 'transactions',
    loadComponent: () => import('./screens/transactions/transactions')
      .then(m => m.Transactions),
    canActivate: [authGuard]
  },

  {
    path: 'card/:card_number',
    component: CreditCardDetails,
    canActivate: [authGuard]
  },

  {
    path: '**',
    redirectTo: 'home'
  }
];
