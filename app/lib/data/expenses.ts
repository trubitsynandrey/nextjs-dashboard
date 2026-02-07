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

export async function fetchMonthlyExpenseLimits() {
  try {
    const data = await sql<{
      expense_type_id: string;
      name: string;
      color: string;
      limit: number;
      spent: number;
    }[]>`
      SELECT
        type_of_expenses.id AS expense_type_id,
        type_of_expenses.name,
        type_of_expenses.color,
        type_of_expenses.limit_month_spent::float AS limit,
        COALESCE(SUM(expenses.amount), 0)::float AS spent
      FROM type_of_expenses
      LEFT JOIN expenses
        ON expenses.expense_type_id = type_of_expenses.id
        AND expenses.spent_at >= date_trunc('month', now())
        AND expenses.spent_at < (date_trunc('month', now()) + interval '1 month')
      WHERE type_of_expenses.limit_month_spent IS NOT NULL
      GROUP BY type_of_expenses.id, type_of_expenses.name, type_of_expenses.color, type_of_expenses.limit_month_spent
      ORDER BY type_of_expenses.name ASC
    `;

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch monthly expense limits.');
  }
}

export async function fetchMonthlyExpenseTotal() {
  try {
    const data = await sql<{ total: number }[]>`
      SELECT COALESCE(SUM(amount), 0)::float AS total
      FROM expenses
      WHERE spent_at >= date_trunc('month', now())
        AND spent_at < (date_trunc('month', now()) + interval '1 month')
    `;

    return data[0]?.total ?? 0;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch monthly expense total.');
  }
}
