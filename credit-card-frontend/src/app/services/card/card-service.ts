import { inject, Injectable, signal } from '@angular/core';
import { CreditCard } from '../../interfaces/models';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../enviroments/enviroment.development';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private client = inject(HttpClient);
  private url = `${environment.baseUrl}/api/CreditCard`;

  cards = signal<CreditCard[]>([]);

  loadCardData() {
    this.client.get<CreditCard[]>(this.url).pipe(
      tap(data => console.log('Loaded cards:', data))
    ).subscribe(data => this.cards.set(data));
  }

  getCardDetails(cardNumber: string) {
    if (!cardNumber || cardNumber.trim() === '') {
      throw new Error('Card number is required');
    }

    return this.client.get<CreditCard>(`${this.url}/cardnumber`, {
      params: { cardnumber: cardNumber }
    }).pipe(
      tap(data => console.log(`Loaded card ${cardNumber}:`, data))
    );
  }


  deleteCard(cardNumber: number) {
    return this.client.delete(`${this.url}/cardnumber`, {
      params: { cardnumber: cardNumber }
    }).pipe(
      tap(() => console.log(`Deleted card ${cardNumber}`))
    );
  }

  createCard(card: CreditCard) {
    const payload = {
      cardNumber: card.cardNumber,
      cscCode: card.cscCode,
      cardHolderName: card.cardHolderName,
      expirationMonth: card.expirationMonth,
      expirationYear: card.expirationYear,
      issuer: card.issuer
    };

    console.log('CardService sending payload:', payload);
    console.log('Request URL:', this.url);

    return this.client.post<CreditCard>(this.url, payload).pipe(
      tap((data: CreditCard) => console.log(`Created card ${card.cardNumber}:`, data)),
      tap({
        error: (error) => {
          console.error('CardService error details:', error);
          console.error('Error status:', error.status);
          console.error('Error message:', error.message);
          if (error.error) {
            console.error('Error body:', error.error);
          }
        }
      })
    );
  }
}
