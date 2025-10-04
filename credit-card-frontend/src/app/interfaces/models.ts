export interface CreditCard {
  cardNumber: number;
  cardHolderName: string;
  issuer: string;
  cscCode: number;
  expirationMonth: number;
  expirationYear: number;
  transactions: Transaction[];
}

export interface Transaction {
  uid: string;
  cardNumber: number;
  amount: number;
  currencyCode: string;
  transactionDate: string;
  comment: string;
}
