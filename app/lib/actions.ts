'use server'
import { z } from 'zod';
import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

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

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce.number().gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], { invalid_type_error: 'Please select an invoice status.', }),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(prevState: State, formData: FormData) {

  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  console.log(validatedFields, 'validatedFields')

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

const UpdateInvoice = FormSchema.omit({ id: true, date: true });

const ExpenseTypeSchema = z.object({
  name: z.string().min(1, { message: 'Please enter a name.' }),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, { message: 'Please choose a valid hex color.' }),
  description: z.string().optional(),
  isActive: z.boolean(),
});

export async function updateInvoice(id: string, prevState: State, formData: FormData) {
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  }

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;

  try {
    await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;
  } catch (e) {
    return { message: 'Database Error: Failed to Update Invoice.' };
  }


  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  await sql`DELETE FROM invoices WHERE id = ${id}`;
  revalidatePath('/dashboard/invoices');
}

export async function createExpenseType(
  prevState: ExpenseTypeFormState,
  formData: FormData,
) {
  const validatedFields = ExpenseTypeSchema.safeParse({
    name: formData.get('name'),
    color: formData.get('color'),
    description: formData.get('description') ?? '',
    isActive: formData.get('is_active') === 'on',
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Expense Type.',
    };
  }

  const { name, color, description, isActive } = validatedFields.data;
  const trimmedDescription = description?.trim();
  const descriptionValue = trimmedDescription ? trimmedDescription : null;

  try {
    await sql`
      INSERT INTO type_of_expenses (name, color, description, is_active)
      VALUES (${name}, ${color}, ${descriptionValue}, ${isActive})
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
    isActive: formData.get('is_active') === 'on',
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Expense Type.',
    };
  }

  const { name, color, description, isActive } = validatedFields.data;
  const trimmedDescription = description?.trim();
  const descriptionValue = trimmedDescription ? trimmedDescription : null;

  try {
    await sql`
      UPDATE type_of_expenses
      SET name = ${name}, color = ${color}, description = ${descriptionValue}, is_active = ${isActive}
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

export async function softDeleteExpenseType(
  id: string,
  prevState: DeleteExpenseTypeState,
): Promise<DeleteExpenseTypeState> {
  try {
    await sql`
      UPDATE type_of_expenses
      SET is_active = false
      WHERE id = ${id}
    `;
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Database Error: Failed to Delete Expense Type.' };
  }

  revalidatePath('/dashboard/type-of-expenses');
  return { message: null };
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}
