export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
  date: Date;
  participants: string[];
  items: ExpenseItem[];
}

export interface ExpenseItem {
  description: string;
  amount: number;
  sharedBy: string[];
}

export interface Settlement {
  from: string;
  to: string;
  amount: number;
}