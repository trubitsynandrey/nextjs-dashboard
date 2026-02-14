'use client'

import { lusitana } from '@/app/ui/fonts';
import {
  AtSymbolIcon,
  KeyIcon,
  UserIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from './button';
import { useActionState } from 'react';
import { register } from '@/app/lib/actions/auth';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function RegisterForm() {
  const [state, formAction, isPending] = useActionState(register, {
    message: null,
    errors: {},
  });
  const tAuth = useTranslations('Auth');
  const tErrors = useTranslations('Errors');

  return (
    <form action={formAction} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>
          {tAuth('registerHeading')}
        </h1>
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="name"
            >
              {tAuth('name')}
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="name"
                type="text"
                name="name"
                placeholder={tAuth('namePlaceholder')}
                required
              />
              <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            {state.errors?.name?.length ? (
              <p className="mt-2 text-xs text-red-500">
                {tErrors(state.errors.name[0])}
              </p>
            ) : null}
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              {tAuth('email')}
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                type="email"
                name="email"
                placeholder={tAuth('emailPlaceholder')}
                required
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            {state.errors?.email?.length ? (
              <p className="mt-2 text-xs text-red-500">
                {tErrors(state.errors.email[0])}
              </p>
            ) : null}
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              {tAuth('password')}
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type="password"
                name="password"
                placeholder={tAuth('passwordPlaceholder')}
                required
                minLength={6}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            {state.errors?.password?.length ? (
              <p className="mt-2 text-xs text-red-500">
                {tErrors(state.errors.password[0])}
              </p>
            ) : null}
          </div>
        </div>
        <Button className="mt-4 w-full" aria-disabled={isPending}>
          {tAuth('register')} <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button>
        <div
          className="flex min-h-8 items-center space-x-2"
          aria-live="polite"
          aria-atomic="true"
        >
          {state.message ? (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{tErrors(state.message)}</p>
            </>
          ) : null}
        </div>
        <p className="text-sm text-gray-600">
          {tAuth('alreadyHaveAccount')}{' '}
          <Link className="text-blue-600 hover:underline" href="/login">
            {tAuth('login')}
          </Link>
        </p>
      </div>
    </form>
  );
}
