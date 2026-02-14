'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { sql } from '@/app/lib/actions/db';
import { requireUserId } from '@/app/lib/auth-helpers';

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
  name: z.string().min(1, { message: 'expenseTypeNameRequired' }),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, { message: 'expenseTypeColorInvalid' }),
  description: z.string().optional(),
  limitMonthSpent: z.preprocess(
    (value) => (value === '' || value === null ? undefined : value),
    z.coerce.number().positive({ message: 'expenseTypeLimitPositive' }).optional(),
  ),
});

export async function createExpenseType(
  prevState: ExpenseTypeFormState,
  formData: FormData,
) {
  const userId = await requireUserId();
  const validatedFields = ExpenseTypeSchema.safeParse({
    name: formData.get('name'),
    color: formData.get('color'),
    description: formData.get('description') ?? '',
    limitMonthSpent: formData.get('limit_month_spent'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'expenseTypeMissingCreate',
    };
  }

  const { name, color, description, limitMonthSpent } = validatedFields.data;
  const trimmedDescription = description?.trim();
  const descriptionValue = trimmedDescription ? trimmedDescription : null;
  const limitValue = typeof limitMonthSpent === 'number' ? limitMonthSpent : null;

  try {
    await sql`
      INSERT INTO type_of_expenses (name, color, description, limit_month_spent, user_id)
      VALUES (${name}, ${color}, ${descriptionValue}, ${limitValue}, ${userId})
    `;
  } catch (error: any) {
    if (error?.code === '23505') {
      return {
        errors: { name: ['expenseTypeNameExists'] },
        message: 'expenseTypeDuplicateName',
      };
    }
    console.error('Database Error:', error);
    return { message: 'expenseTypeDbCreate' };
  }

  revalidatePath('/type-of-expenses');
  revalidatePath('/expenses');
  redirect('/type-of-expenses');
}

export async function updateExpenseType(
  id: string,
  prevState: ExpenseTypeFormState,
  formData: FormData,
) {
  const userId = await requireUserId();
  const validatedFields = ExpenseTypeSchema.safeParse({
    name: formData.get('name'),
    color: formData.get('color'),
    description: formData.get('description') ?? '',
    limitMonthSpent: formData.get('limit_month_spent'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'expenseTypeMissingUpdate',
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
      WHERE id = ${id} AND user_id = ${userId}
    `;
  } catch (error: any) {
    if (error?.code === '23505') {
      return {
        errors: { name: ['expenseTypeNameExists'] },
        message: 'expenseTypeDuplicateNameUpdate',
      };
    }
    console.error('Database Error:', error);
    return { message: 'expenseTypeDbUpdate' };
  }

  revalidatePath('/type-of-expenses');
  revalidatePath('/expenses');
  redirect('/type-of-expenses');
}

export async function deleteExpenseType(
  id: string,
  prevState: DeleteExpenseTypeState,
): Promise<DeleteExpenseTypeState> {
  const userId = await requireUserId();
  try {
    await sql`DELETE FROM type_of_expenses WHERE id = ${id} AND user_id = ${userId}`;
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'expenseTypeDbDelete' };
  }

  revalidatePath('/type-of-expenses');
  return { message: null };
}
