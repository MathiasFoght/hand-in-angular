import {Component, inject, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {AsyncPipe, CurrencyPipe, DatePipe} from '@angular/common';
import { CardService } from '../../services/card-service';
import {TransactionService} from '../../services/transaction-service';
import {Transaction} from '../../interfaces/models';

@Component({
  selector: 'app-credit-card-details',
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe, DatePipe, DatePipe],
  templateUrl: './credit-card-details.html',
  styleUrl: './credit-card-details.css',
})
export class CreditCardDetails implements OnInit {
  private service = inject(CardService);
  protected transactionService = inject(TransactionService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  card$ = this.service.getCardDetails(
    this.route.snapshot.paramMap.get('card_number')!
  );

  ngOnInit() {
    this.transactionService.getTransactions();
  }

  get transactionsForCard(): Transaction[] {
    const cardNumber = this.route.snapshot.paramMap.get('card_number')!;
    return this.transactionService.transactions().filter((t: Transaction) => {
      const tNumber = String(t.credit_card.card_number).replace(/\s+/g, '');
      const routeNumber = cardNumber.replace(/\s+/g, '');
      return tNumber === routeNumber;
    });
  }


  removeCard(card_number: string) {
    this.service.deleteCard(card_number).subscribe(() => {
      this.service.loadCardData();
      this.router.navigate(['/home']);
    });
  }
}
