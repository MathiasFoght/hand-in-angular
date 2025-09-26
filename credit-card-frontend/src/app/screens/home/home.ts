import { Component, computed, inject } from '@angular/core';
import { CardService } from '../../services/card-service';
import { RouterLink } from '@angular/router';
import { CreditCard } from '../../interfaces/models';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  standalone: true,
  styleUrl: './home.css'
})
export class Home {
  service = inject(CardService);

  groupedCards = computed(() => {
    const map = new Map<string, CreditCard[]>();

    for (const c of this.service.cards()) {
      const key = c.issuer?.trim() || 'Unknown issuer';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(c);
    }

    const groups = Array.from(map, ([issuer, cards]) => ({ issuer, cards }));
    groups.sort((a, b) => a.issuer.localeCompare(b.issuer, 'da'));

    for (const g of groups) {
      g.cards.sort((a, b) => a.cardholder_name.localeCompare(b.cardholder_name, 'da'));
    }

    return groups;
  });

  ngOnInit() {
    this.service.loadCardData();
  }
}
