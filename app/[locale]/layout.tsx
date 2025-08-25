import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Navigation } from '@/components/navigation';

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  // We don't need to use the locale directly here since next-intl handles it
  await params;
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <div className='min-h-screen flex flex-col'>
        <Navigation />
        <main className='flex-1'>{children}</main>
      </div>
    </NextIntlClientProvider>
  );
}
