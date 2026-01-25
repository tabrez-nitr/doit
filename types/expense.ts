export interface Expense {
  id: string;
  amount: number;
  description: string;
  date: string; // ISO Date String YYYY-MM-DD
  category: string;
}
