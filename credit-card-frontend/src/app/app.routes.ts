import { Routes } from '@angular/router';
import {Home} from './screens/home/home';
import {AddCreditCard} from './screens/add-credit-card/add-credit-card';
import {Transactions} from './screens/transactions/transactions';
import {CreditCardDetails} from './components/credit-card-details/credit-card-details';

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
  },
  {
    path: 'card/:card_number',
    component: CreditCardDetails
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
