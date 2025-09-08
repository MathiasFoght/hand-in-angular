import {Component, inject} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {CardService} from '../../services/card-service';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-add-credit-card',
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './add-credit-card.html',
  standalone: true,
  styleUrl: './add-credit-card.css'
})
export class AddCreditCard {
  private fb = inject(FormBuilder);
  private service = inject(CardService);
  private router = inject(Router);

  form = this.fb.group({
    card_number: ['', [
      Validators.required,
      Validators.pattern(/^\d+$/),      // kun tal er tilladt
      Validators.minLength(7),
      Validators.maxLength(16)
    ]],
    cardholder_name: ['', [Validators.required]],
    csc_code: ['', [
      Validators.required,
      Validators.pattern(/^\d{3}$/)     // præcis 3 cifre er tilladt
    ]],
    expiration_date_month: [null, [
      Validators.required,
      Validators.min(1),
      Validators.max(12)
    ]],
    expiration_date_year: [null, [
      Validators.required
    ]],
    issuer: ['', [Validators.required]]
  });

  c(name: string) { return this.form.get(name)!; }
  touchedInvalid(name: string) { const c = this.c(name); return c.touched && c.invalid; }

  digitsOnly(e: Event, control: string) {
    const el = e.target as HTMLInputElement;
    el.value = el.value.replace(/\D+/g, '');
    this.c(control).setValue(el.value);
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const cardNumber = String(this.form.get('card_number')!.value || '').trim();

    this.service.createCard(this.form.value as any).subscribe({
      next: () => {
        if (cardNumber) {
          this.service.loadCardData();
          this.form.reset();
          alert('Card created successfully!');
        } else {
          this.router.navigate(['/home']);
        }
      },
      error: (err: any) => {
        console.error('POST /cards failed', err);
        this.form.reset();
        alert('Could not create card. Please try again.');
      }
    });
  }
}
