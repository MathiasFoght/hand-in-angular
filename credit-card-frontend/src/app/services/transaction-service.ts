import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../enviroments/enviroment.development';
import {Transaction} from '../interfaces/models';
import {tap} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private client = inject(HttpClient)
  private url = `${environment.baseUrl}/transactions`;

  transactions = signal<Transaction[]>([])

  getTransactions() {
    this.client.get<Transaction[]>(this.url).pipe(
      tap((data: any) => console.log('Loaded transactions:', data))
    ).subscribe((data: any) => this.transactions.set(data));
  }

  createTransaction(transaction: Transaction) {
    return this.client.post(`${this.url}`, transaction).pipe(
      tap((data: any) => console.log(`Created transaction ${transaction.uid}:`, data))
    );
  }

  deleteTransaction(transaction_uid: string) {
    return this.client.delete(`${this.url}/${transaction_uid}`).pipe(
      tap((data: any) => console.log(`Deleted transaction ${transaction_uid}:`, data))
    );
  }
}
