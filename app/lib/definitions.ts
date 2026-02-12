// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type ExpenseType = {
  id: string;
  name: string;
  color: string;
  description: string | null;
  limit_month_spent: number | null;
  created_at: string;
  updated_at: string;
};

export type ExpenseTypeForm = {
  id: string;
  name: string;
  color: string;
  description: string | null;
  limit_month_spent: number | null;
};

export type ExpenseTypeOption = {
  id: string;
  name: string;
};

export type Expense = {
  id: string;
  amount: number;
  expense_type_id: string;
  spent_at: string;
  note: string | null;
  is_income: boolean;
};

export type ExpenseWithType = Expense & {
  expense_type_name: string;
  expense_type_color: string;
};
