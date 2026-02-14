import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { getTranslations } from 'next-intl/server';

export default async function AcmeLogo() {
  const tBrand = await getTranslations('Brand');

  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-white`}
    >
      <p className="text-[24px]">{tBrand('appName')}</p>
    </div>
  );
}
