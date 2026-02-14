'use client'

import { TagIcon, BanknotesIcon } from '@heroicons/react/24/outline';
import { clsx } from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  {
    nameKey: 'expenses',
    href: '/expenses',
    icon: BanknotesIcon,
  },
  {
    nameKey: 'expenseTypes',
    href: '/type-of-expenses',
    icon: TagIcon,
  },
];

export default function NavLinks() {
  const pathname = usePathname();
  const t = useTranslations('Nav');
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.nameKey}
            href={link.href}
            className={clsx("flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3", {
                'bg-sky-100 text-blue-600': pathname === link.href,
              })}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{t(link.nameKey)}</p>
          </Link>
        );
      })}
    </>
  );
}
