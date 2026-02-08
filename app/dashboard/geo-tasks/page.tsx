import { Metadata } from 'next';
import { lusitana } from '@/app/ui/fonts';
import YandexMap from '@/app/ui/geo-tasks/yandex-map';

export const metadata: Metadata = {
  title: 'Geo Tasks',
};

export default function Page() {
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Geo Tasks</h1>
      </div>
      <div className="mt-6">
        <YandexMap />
      </div>
    </div>
  );
}
