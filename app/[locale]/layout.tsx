import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Navigation } from '@/components/navigation';
import { createClient } from '@/lib/supabase/server';

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  // Await the params to get the locale
  const { locale } = await params;
  const messages = await getMessages({ locale });

  // Get user info server-side
  let user = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();
    // Extract email from claims if available
    user = data?.claims ? { email: data.claims.email } : null;
  } catch (error) {
    console.error('Error getting user:', error);
  }

  return (
    <NextIntlClientProvider messages={messages}>
      <div className='min-h-screen flex flex-col'>
        <Navigation user={user} />
        <main className='flex-1'>{children}</main>
      </div>
    </NextIntlClientProvider>
  );
}
