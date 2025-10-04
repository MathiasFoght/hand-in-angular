import {Component, inject} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {CardService} from '../../services/card/card-service';
import {Router, RouterLink} from '@angular/router';
import {CreditCard} from '../../interfaces/models';

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
    cardNumber: ['', [
      Validators.required,
      Validators.pattern(/^\d+$/),
      Validators.minLength(7),
      Validators.maxLength(16)
    ]],
    cardHolderName: ['', [Validators.required]],
    cscCode: ['', [
      Validators.required,
      Validators.pattern(/^\d{3}$/)
    ]],
    expirationMonth: [null, [
      Validators.required,
      Validators.min(1),
      Validators.max(12)
    ]],
    expirationYear: [null, [Validators.required]],
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

    const payload: CreditCard = {
      cardNumber: Number(this.form.value.cardNumber),
      cscCode: Number(this.form.value.cscCode),
      cardHolderName: this.form.value.cardHolderName!,
      expirationMonth: Number(this.form.value.expirationMonth),
      expirationYear: Number(this.form.value.expirationYear),
      issuer: this.form.value.issuer!,
      transactions: []
    };

    console.log('Sending card data to backend:', payload);

    this.service.createCard(payload).subscribe({
      next: () => {
        alert('Card created successfully!');
        this.service.loadCardData();
        this.router.navigate(['/home']);
      },
      error: (err: any) => {
        console.error('POST /api/CreditCard failed', err);
        console.error('Full error object:', JSON.stringify(err, null, 2));

        if (err.error?.errors) {
          console.error('Validation details:', err.error.errors);
          alert(`Failed to create card: ${JSON.stringify(err.error.errors)}`);
        } else if (err.error) {
          console.error('Error response:', err.error);

          const errorText = JSON.stringify(err.error).toLowerCase();
          if (errorText.includes('already exists') ||
              errorText.includes('duplicate') ||
              errorText.includes('card number') && errorText.includes('exist')) {
            alert('This card number already exists. Please use a different card number.');
          } else {
            alert(`Failed to create card: ${JSON.stringify(err.error)}`);
          }
        } else {
          alert('Failed to create card. Please try again.');
        }
      }
    });
  }

}
