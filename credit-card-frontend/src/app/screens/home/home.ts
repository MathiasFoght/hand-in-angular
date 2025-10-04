import { Component, computed, inject } from '@angular/core';
import { CardService } from '../../services/card/card-service';
import { RouterLink } from '@angular/router';
import { CreditCard } from '../../interfaces/models';
import { MaskCardNumberPipe } from '../../customs/pipe/mask-card-number-pipe';

@Component({
  selector: 'app-home',
  imports: [RouterLink, MaskCardNumberPipe],
  templateUrl: './home.html',
  standalone: true,
  styleUrls: ['./home.css']
})
export class Home {
  service = inject(CardService);

  groupedCards = computed(() => {
    const map = new Map<string, CreditCard[]>();

    for (const c of this.service.cards()) {
      const key = c.issuer?.trim() || 'Unknown issuer';
      if (!map.has(key)) map.set(key, []);

      const exists = map.get(key)!.some(card => card.cardNumber === c.cardNumber);
      if (!exists) {
        map.get(key)!.push(c);
      }
    }

    const groups = Array.from(map, ([issuer, cards]) => ({ issuer, cards }));
    groups.sort((a, b) => (a.issuer || '').localeCompare(b.issuer || '', 'da'));

    for (const g of groups) {
      g.cards.sort((a, b) =>
        (a.cardHolderName || '').localeCompare(b.cardHolderName || '', 'da')
      );
    }

    return groups;
  });

  ngOnInit() {
    this.service.loadCardData();
  }
}
