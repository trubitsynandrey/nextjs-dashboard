import { Expense, ExpenseWithType } from '@/app/lib/definitions';
import { sql } from '@/app/lib/data/db';

export async function fetchExpenses() {
  try {
    const data = await sql<ExpenseWithType[]>`
      SELECT
        expenses.id,
        expenses.amount::float AS amount,
        expenses.expense_type_id,
        expenses.spent_at,
        expenses.note,
        type_of_expenses.name AS expense_type_name,
        type_of_expenses.color AS expense_type_color
      FROM expenses
      JOIN type_of_expenses ON expenses.expense_type_id = type_of_expenses.id
      ORDER BY expenses.spent_at DESC
    `;

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch expenses.');
  }
}

export async function fetchExpenseById(id: string) {
  try {
    const data = await sql<Expense[]>`
      SELECT id, amount::float AS amount, expense_type_id, spent_at, note
      FROM expenses
      WHERE id = ${id}
    `;

    return data[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch expense.');
  }
}
