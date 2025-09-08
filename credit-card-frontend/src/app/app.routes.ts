import { Routes } from '@angular/router';
import {Home} from './components/home/home';
import {AddCreditCard} from './components/add-credit-card/add-credit-card';
import {Transactions} from './components/transactions/transactions';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: Home
  },
  {
    path: 'add-credit-card',
    component: AddCreditCard
  },
  {
    path: 'transactions',
    component: Transactions
  }
];
