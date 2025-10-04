import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../enviroments/enviroment.development';
import { Transaction } from '../../interfaces/models';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private client = inject(HttpClient);
  private url = `${environment.baseUrl}/api/Transaction`;

  transactions = signal<Transaction[]>([]);

  getTransactions() {
    this.client.get<Transaction[]>(this.url).pipe(
      tap(data => console.log('Loaded transactions:', data))
    ).subscribe(data => this.transactions.set(data));
  }

  createTransaction(transaction: any) {
    return this.client.post<Transaction>(this.url, transaction).pipe(
      tap((data) => console.log('Created transaction:', data))
    );
  }

  deleteTransaction(uid: string) {
    const url = `${this.url}/uid?uid=${uid}`;
    return this.client.delete(url).pipe(
      tap(() => console.log(`Deleted transaction ${uid}`))
    );
  }
}
