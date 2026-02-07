'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { sql } from '@/app/lib/actions/db';

export type ExpenseTypeFormState = {
  errors?: {
    name?: string[];
    color?: string[];
  };
  message?: string | null;
};

export type DeleteExpenseTypeState = {
  message?: string | null;
};

export type ExpenseTypeFormAction = (
  prevState: ExpenseTypeFormState,
  formData: FormData,
) => Promise<ExpenseTypeFormState>;

const ExpenseTypeSchema = z.object({
  name: z.string().min(1, { message: 'Please enter a name.' }),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, { message: 'Please choose a valid hex color.' }),
  description: z.string().optional(),
  limitMonthSpent: z.preprocess(
    (value) => (value === '' || value === null ? undefined : value),
    z.coerce.number().positive({ message: 'Limit must be greater than 0.' }).optional(),
  ),
});

export async function createExpenseType(
  prevState: ExpenseTypeFormState,
  formData: FormData,
) {
  const validatedFields = ExpenseTypeSchema.safeParse({
    name: formData.get('name'),
    color: formData.get('color'),
    description: formData.get('description') ?? '',
    limitMonthSpent: formData.get('limit_month_spent'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Expense Type.',
    };
  }

  const { name, color, description, limitMonthSpent } = validatedFields.data;
  const trimmedDescription = description?.trim();
  const descriptionValue = trimmedDescription ? trimmedDescription : null;
  const limitValue = typeof limitMonthSpent === 'number' ? limitMonthSpent : null;

  try {
    await sql`
      INSERT INTO type_of_expenses (name, color, description, limit_month_spent)
      VALUES (${name}, ${color}, ${descriptionValue}, ${limitValue})
    `;
  } catch (error: any) {
    if (error?.code === '23505') {
      return {
        errors: { name: ['An expense type with this name already exists.'] },
        message: 'Duplicate name. Failed to Create Expense Type.',
      };
    }
    console.error('Database Error:', error);
    return { message: 'Database Error: Failed to Create Expense Type.' };
  }

  revalidatePath('/dashboard/type-of-expenses');
  redirect('/dashboard/type-of-expenses');
}

export async function updateExpenseType(
  id: string,
  prevState: ExpenseTypeFormState,
  formData: FormData,
) {
  const validatedFields = ExpenseTypeSchema.safeParse({
    name: formData.get('name'),
    color: formData.get('color'),
    description: formData.get('description') ?? '',
    limitMonthSpent: formData.get('limit_month_spent'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Expense Type.',
    };
  }

  const { name, color, description, limitMonthSpent } = validatedFields.data;
  const trimmedDescription = description?.trim();
  const descriptionValue = trimmedDescription ? trimmedDescription : null;
  const limitValue = typeof limitMonthSpent === 'number' ? limitMonthSpent : null;

  try {
    await sql`
      UPDATE type_of_expenses
      SET name = ${name}, color = ${color}, description = ${descriptionValue}, limit_month_spent = ${limitValue}
      WHERE id = ${id}
    `;
  } catch (error: any) {
    if (error?.code === '23505') {
      return {
        errors: { name: ['An expense type with this name already exists.'] },
        message: 'Duplicate name. Failed to Update Expense Type.',
      };
    }
    console.error('Database Error:', error);
    return { message: 'Database Error: Failed to Update Expense Type.' };
  }

  revalidatePath('/dashboard/type-of-expenses');
  redirect('/dashboard/type-of-expenses');
}

export async function deleteExpenseType(
  id: string,
  prevState: DeleteExpenseTypeState,
): Promise<DeleteExpenseTypeState> {
  try {
    await sql`DELETE FROM type_of_expenses WHERE id = ${id}`;
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Database Error: Failed to Delete Expense Type.' };
  }

  revalidatePath('/dashboard/type-of-expenses');
  return { message: null };
}
