import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AsyncPipe, CurrencyPipe, DatePipe } from '@angular/common';
import { CardService } from '../../services/card/card-service';

@Component({
  selector: 'app-credit-card-details',
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe, DatePipe],
  templateUrl: './credit-card-details.html',
  styleUrl: './credit-card-details.css',
})
export class CreditCardDetails {
  private service = inject(CardService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  card$ = this.service.getCardDetails(
    this.route.snapshot.paramMap.get('card_number') || ''
  );

  removeCard(cardNumber: number) {
    this.service.deleteCard(cardNumber).subscribe(() => {
      this.service.loadCardData();
      this.router.navigate(['/home']);
    });
  }
}
