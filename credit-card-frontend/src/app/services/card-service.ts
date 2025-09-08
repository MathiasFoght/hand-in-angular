import {inject, Injectable, signal} from '@angular/core';
import { CreditCard } from '../interfaces/models';
import {HttpClient} from '@angular/common/http';
import {environment} from '../enviroments/enviroment.development';
import {tap} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private client = inject(HttpClient)
  private url = `${environment.baseUrl}/cards`;

  cards = signal<CreditCard[]>([])

  loadCardData() {
    this.client.get<CreditCard[]>(this.url).pipe(
      tap((data: any) => console.log('Loaded cards:', data))
    ).subscribe((data: any) => this.cards.set(data));
    }

    getCardDetails(card_number: string) {
      return this.client.get<CreditCard>(`${this.url}/${card_number}`).pipe(
        tap((data: any) => console.log(`Loaded card ${card_number}:`, data))
      );
    }

  deleteCard(card_number: string) {
    return this.client.delete(`${this.url}/${card_number}`).pipe(
      tap((data: any) => console.log(`Deleted card ${card_number}:`, data))
    );
  }

  createCard(card: CreditCard) {
    return this.client.post(`${this.url}`, card).pipe(
      tap((data: any) => console.log(`Created card ${card.card_number}:`, data))
    );
  }
}
