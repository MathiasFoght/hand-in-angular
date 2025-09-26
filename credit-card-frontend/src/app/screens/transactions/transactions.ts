import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Transaction, CreditCard } from '../../interfaces/models';
import { TransactionService } from '../../services/transaction-service';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transactions.html',
  styleUrls: ['./transactions.css']
})
export class Transactions implements OnInit {
  private transactionService = inject(TransactionService);

  filterCardNumber: string = '';
  addingTransaction: boolean = false;

  ngOnInit() {
    this.transactionService.getTransactions();
  }

  get filteredTransactions(): Transaction[] {
    const filter = this.filterCardNumber.trim().replace(/-/g, '');
    return this.transactionService.transactions().filter((t: Transaction) => {
      const cardNum = String(t.credit_card.card_number).replace(/-/g, '');
      return !filter || cardNum.includes(filter);
    });
  }

  startAddTransaction() {
    this.addingTransaction = true;
  }

  cancelAddTransaction() {
    this.addingTransaction = false;
  }

  addTransaction(formValue: any) {
    const newTransaction: Transaction = {
      credit_card: {
        card_number: formValue.card_number,
        cardholder_name: formValue.cardholder_name,
        issuer: 'Unknown'
      },
      amount: formValue.amount,
      comment: formValue.comment || '',
      currency: formValue.currency,
      date: Date.now()
    };

    this.transactionService.createTransaction(newTransaction).subscribe({
      next: (created: Transaction) => {
        this.transactionService.transactions.update((trans: Transaction[]) => [...trans, created]);
        this.addingTransaction = false;
      },
      error: (err: any) => console.error('Error creating transaction:', err)
    });
  }

  deleteTransaction(uid: string) {
    this.transactionService.deleteTransaction(uid).subscribe({
      next: () => {
        this.transactionService.transactions.update((trans: Transaction[]) =>
          trans.filter(t => t.uid !== uid)
        );
      },
      error: (err: any) => console.error('Error deleting transaction:', err)
    });
  }
}
