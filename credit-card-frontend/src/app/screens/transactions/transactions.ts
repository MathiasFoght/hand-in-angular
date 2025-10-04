import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Transaction, CreditCard } from '../../interfaces/models';
import { TransactionService } from '../../services/transaction/transaction-service';

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
    return this.transactionService.transactions()
      .filter((t: Transaction | undefined) => !!t && t.cardNumber != null)
      .filter((t: Transaction) => {
        const cardNum = String(t.cardNumber).replace(/-/g, '');
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
    // Valider input først
    const cardNumber = Number(formValue.card_number);
    const amount = Number(formValue.amount);
    const currencyCode = formValue.currency?.trim();

    if (isNaN(cardNumber) || cardNumber <= 0) {
      alert('Please enter a valid card number');
      return;
    }

    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (!currencyCode) {
      alert('Please enter a currency code');
      return;
    }

    const newTransaction = {
      cardNumber: cardNumber,
      amount: amount,
      currencyCode: currencyCode,
      transactionDate: new Date().toISOString(),
      comment: formValue.comment || ''
    };

    console.log('Sending transaction to backend:', newTransaction);

    this.transactionService.createTransaction(newTransaction).subscribe({
      next: (created) => {
        this.transactionService.transactions.update((trans) => [...trans, created]);
        this.addingTransaction = false;
        console.log('Transaction created:', created);
      },
      error: (err) => {
        console.error('Error creating transaction:', err);
        if (err.error?.errors) {
          console.error('Validation details:', err.error.errors);
        }
      }
    });
  }

  deleteTransaction(uid: string) {
    if (!confirm('Are you sure you want to delete this transaction?')) return;

    this.transactionService.deleteTransaction(uid).subscribe({
      next: () => {
        this.transactionService.transactions.update((trans: Transaction[]) =>
          trans.filter(t => t.uid !== uid)
        );
        alert('Transaction deleted successfully.');
      },
      error: (err: any) => console.error('Error deleting transaction:', err)
    });
  }
}
