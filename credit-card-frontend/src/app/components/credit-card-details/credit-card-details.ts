import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { CardService } from '../../services/card-service';


//TODO: Mangler at tilføje en liste af transactions for det specifikke card


@Component({
  selector: 'app-credit-card-details',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './credit-card-details.html',
  styleUrl: './credit-card-details.css',
})
export class CreditCardDetails {
  private service = inject(CardService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  card$ = this.service.getCardDetails(
    this.route.snapshot.paramMap.get('card_number')!
  );

  removeCard(card_number: string) {
    this.service.deleteCard(card_number).subscribe(() => {
      this.service.loadCardData();
      this.router.navigate(['/home']);
    });
  }
}
