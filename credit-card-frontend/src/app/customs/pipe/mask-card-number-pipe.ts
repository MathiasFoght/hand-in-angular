import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maskCardNumber',
  standalone: true
})
export class MaskCardNumberPipe implements PipeTransform {
  transform(cardNumber: unknown): string {
    if (!cardNumber) return '';
    const clean = String(cardNumber).replace(/\s+/g, '');
    return clean.slice(-4).padStart(clean.length, '*').replace(/(.{4})/g, '$1 ').trim();
  }
}
