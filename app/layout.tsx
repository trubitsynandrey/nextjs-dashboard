import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
 
export async function generateMetadata(): Promise<Metadata> {
  const tMeta = await getTranslations('Meta');
  return {
    title: {
      template: tMeta('titleTemplate'),
      default: tMeta('defaultTitle'),
    },
    description: tMeta('description'),
    metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${inter.className} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
