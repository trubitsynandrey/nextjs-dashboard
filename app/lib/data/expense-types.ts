import { ExpenseType, ExpenseTypeForm, ExpenseTypeOption } from '@/app/lib/definitions';
import { sql } from '@/app/lib/data/db';
import { requireUserId } from '@/app/lib/auth-helpers';

export async function fetchExpenseTypes() {
  const userId = await requireUserId();
  try {
    const data = await sql<ExpenseType[]>`
      SELECT id, name, color, description, limit_month_spent
      FROM type_of_expenses
      WHERE user_id = ${userId}
      ORDER BY updated_at DESC
    `;

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch expense types.');
  }
}

export async function fetchExpenseTypeById(id: string) {
  const userId = await requireUserId();
  try {
    const data = await sql<ExpenseTypeForm[]>`
      SELECT id, name, color, description, limit_month_spent
      FROM type_of_expenses
      WHERE id = ${id} AND user_id = ${userId}
    `;

    return data[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch expense type.');
  }
}

export async function fetchExpenseTypeOptions() {
  const userId = await requireUserId();
  try {
    const data = await sql<ExpenseTypeOption[]>`
      SELECT id, name
      FROM type_of_expenses
      WHERE user_id = ${userId}
      ORDER BY name ASC
    `;

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch expense types.');
  }
}
