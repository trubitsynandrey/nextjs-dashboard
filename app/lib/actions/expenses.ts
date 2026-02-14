'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { sql } from '@/app/lib/actions/db';
import { requireUserId } from '@/app/lib/auth-helpers';

export type ExpenseFormState = {
  errors?: {
    amount?: string[];
    expenseTypeId?: string[];
    spentAt?: string[];
  };
  message?: string | null;
};

export type DeleteExpenseState = {
  message?: string | null;
};

export type ExpenseFormAction = (
  prevState: ExpenseFormState,
  formData: FormData,
) => Promise<ExpenseFormState>;

const ExpenseSchema = z.object({
  amount: z.coerce.number().gt(0, { message: 'expenseAmountGtZero' }),
  expenseTypeId: z.string().min(1, { message: 'expenseSelectType' }),
  spentAt: z.string().optional(),
  note: z.string().optional(),
  isIncome: z.boolean(),
});

function toIsoOrNull(value: string | undefined) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

export async function createExpense(
  prevState: ExpenseFormState,
  formData: FormData,
) {
  const userId = await requireUserId();
  const validatedFields = ExpenseSchema.safeParse({
    amount: formData.get('amount'),
    expenseTypeId: formData.get('expense_type_id'),
    spentAt: formData.get('spent_at') ?? undefined,
    note: formData.get('note') ?? '',
    isIncome: formData.get('is_income') === 'on',
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'expenseMissingCreate',
    };
  }

  const { amount, expenseTypeId, spentAt, note, isIncome } = validatedFields.data;
  const spentAtValue = toIsoOrNull(spentAt);
  const trimmedNote = note?.trim();
  const noteValue = trimmedNote ? trimmedNote : null;

  try {
    if (spentAtValue) {
      await sql`
        INSERT INTO expenses (amount, expense_type_id, spent_at, note, is_income, user_id)
        VALUES (${amount}, ${expenseTypeId}, ${spentAtValue}, ${noteValue}, ${isIncome}, ${userId})
      `;
    } else {
      await sql`
        INSERT INTO expenses (amount, expense_type_id, note, is_income, user_id)
        VALUES (${amount}, ${expenseTypeId}, ${noteValue}, ${isIncome}, ${userId})
      `;
    }
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'expenseDbCreate' };
  }

  revalidatePath('/expenses');
  redirect('/expenses');
}

export async function updateExpense(
  id: string,
  prevState: ExpenseFormState,
  formData: FormData,
) {
  const userId = await requireUserId();
  const validatedFields = ExpenseSchema.safeParse({
    amount: formData.get('amount'),
    expenseTypeId: formData.get('expense_type_id'),
    spentAt: formData.get('spent_at') ?? undefined,
    note: formData.get('note') ?? '',
    isIncome: formData.get('is_income') === 'on',
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'expenseMissingUpdate',
    };
  }

  const { amount, expenseTypeId, spentAt, note, isIncome } = validatedFields.data;
  const spentAtValue = toIsoOrNull(spentAt);
  const trimmedNote = note?.trim();
  const noteValue = trimmedNote ? trimmedNote : null;

  try {
    if (spentAtValue) {
      await sql`
        UPDATE expenses
        SET amount = ${amount}, expense_type_id = ${expenseTypeId}, spent_at = ${spentAtValue}, note = ${noteValue}, is_income = ${isIncome}
        WHERE id = ${id} AND user_id = ${userId}
      `;
    } else {
      await sql`
        UPDATE expenses
        SET amount = ${amount}, expense_type_id = ${expenseTypeId}, note = ${noteValue}, is_income = ${isIncome}
        WHERE id = ${id} AND user_id = ${userId}
      `;
    }
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'expenseDbUpdate' };
  }

  revalidatePath('/expenses');
  redirect('/expenses');
}

export async function deleteExpense(
  id: string,
  prevState: DeleteExpenseState,
): Promise<DeleteExpenseState> {
  const userId = await requireUserId();
  try {
    await sql`DELETE FROM expenses WHERE id = ${id} AND user_id = ${userId}`;
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'expenseDbDelete' };
  }

  revalidatePath('/expenses');
  return { message: null };
}
