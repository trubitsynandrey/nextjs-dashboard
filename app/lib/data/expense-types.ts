import { ExpenseType, ExpenseTypeForm, ExpenseTypeOption } from '@/app/lib/definitions';
import { sql } from '@/app/lib/data/db';

export async function fetchExpenseTypes() {
  try {
    const data = await sql<ExpenseType[]>`
      SELECT id, name, color, description
      FROM type_of_expenses
      ORDER BY updated_at DESC
    `;

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch expense types.');
  }
}

export async function fetchExpenseTypeById(id: string) {
  try {
    const data = await sql<ExpenseTypeForm[]>`
      SELECT id, name, color, description
      FROM type_of_expenses
      WHERE id = ${id}
    `;

    return data[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch expense type.');
  }
}

export async function fetchExpenseTypeOptions() {
  try {
    const data = await sql<ExpenseTypeOption[]>`
      SELECT id, name
      FROM type_of_expenses
      ORDER BY name ASC
    `;

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch expense types.');
  }
}
