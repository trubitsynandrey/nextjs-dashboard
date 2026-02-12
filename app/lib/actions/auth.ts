'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import bcrypt from 'bcrypt';
import { sql } from '@/app/lib/actions/db';

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

export type RegisterState = {
  message?: string | null;
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
  };
};

const RegisterSchema = z.object({
  name: z.string().min(1, { message: 'Please enter your name.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

export async function register(
  prevState: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const validatedFields = RegisterSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing fields. Failed to create account.',
    };
  }

  const { name, email, password } = validatedFields.data;

  try {
    const existing = await sql<{ id: string }[]>`
      SELECT id FROM users WHERE email = ${email}
    `;
    if (existing.length > 0) {
      return { message: 'Email is already registered.' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await sql`
      INSERT INTO users (name, email, password)
      VALUES (${name}, ${email}, ${hashedPassword})
    `;
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Database Error: Failed to create account.' };
  }

  redirect('/login');
}
