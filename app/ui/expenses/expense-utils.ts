import { ExpenseWithType } from '@/app/lib/definitions';

type ExpenseGroup = {
  id: string;
  name: string;
  color: string;
  spent: number;
  expenses: ExpenseWithType[];
};

export function groupExpensesByType(expenses: ExpenseWithType[]) {
  const map = new Map<string, ExpenseGroup>();

  for (const expense of expenses) {
    if (expense.is_income) {
      continue;
    }

    const existing = map.get(expense.expense_type_id);
    if (existing) {
      existing.spent += expense.amount;
      existing.expenses.push(expense);
      continue;
    }

    map.set(expense.expense_type_id, {
      id: expense.expense_type_id,
      name: expense.expense_type_name,
      color: expense.expense_type_color,
      spent: expense.amount,
      expenses: [expense],
    });
  }

  return map;
}
