import { create } from 'zustand';
import { Expense, Settlement } from '../types';

interface ExpenseState {
  expenses: Expense[];
  addExpense: (expense: Expense) => void;
  getSettlements: () => Settlement[];
}

export const useExpenseStore = create<ExpenseState>((set, get) => ({
  expenses: [],
  addExpense: (expense) => set((state) => ({ 
    expenses: [...state.expenses, expense] 
  })),
  getSettlements: () => {
    const { expenses } = get();
    const balances = new Map<string, number>();

    // Calculate net balances
    expenses.forEach(expense => {
      const perPerson = expense.amount / expense.participants.length;
      expense.participants.forEach(participant => {
        const currentBalance = balances.get(participant) || 0;
        if (participant === expense.paidBy) {
          balances.set(participant, currentBalance + expense.amount - perPerson);
        } else {
          balances.set(participant, currentBalance - perPerson);
        }
      });
    });

    const settlements: Settlement[] = [];
    const positiveBalances = Array.from(balances.entries())
      .filter(([_, amount]) => amount > 0)
      .sort((a, b) => b[1] - a[1]);
    const negativeBalances = Array.from(balances.entries())
      .filter(([_, amount]) => amount < 0)
      .sort((a, b) => a[1] - b[1]);

    while (positiveBalances.length > 0 && negativeBalances.length > 0) {
      const [creditor, creditAmount] = positiveBalances[0];
      const [debtor, debtAmount] = negativeBalances[0];
      const settlementAmount = Math.min(creditAmount, -debtAmount);

      settlements.push({
        from: debtor,
        to: creditor,
        amount: settlementAmount,
      });

      positiveBalances[0][1] -= settlementAmount;
      negativeBalances[0][1] += settlementAmount;

      if (positiveBalances[0][1] < 0.01) positiveBalances.shift();
      if (negativeBalances[0][1] > -0.01) negativeBalances.shift();
    }

    return settlements;
  },
}));