export interface CreditCard {
  card_number: string;
  cardholder_name: string;
  issuer: string;
  csc_code?: string;
  expiration_date_month?: number;
  expiration_date_year?: number;
}

export interface Transaction {
  credit_card: CreditCard;
  amount: number;
  comment: string;
  date: number;
  currency: string;
  uid?: string;
}
