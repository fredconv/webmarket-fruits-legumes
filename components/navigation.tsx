'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { EnvVarWarning } from './env-var-warning';
import { ThemeSwitcher } from './theme-switcher';
import { LanguageSwitcher } from './language-switcher';
import { hasEnvVars } from '@/lib/utils';
import { Button } from './ui/button';
import { LogoutButton } from './logout-button';
import { usePathname } from 'next/navigation';
import { locales, type Locale } from '@/i18n';

interface NavigationProps {
  user?: {
    email?: string;
  } | null;
}

export function Navigation({ user }: NavigationProps) {
  const t = useTranslations('navigation');
  const tAuth = useTranslations('auth');
  const pathname = usePathname();

  // Extract locale from pathname
  const getLocaleFromPathname = (path: string): string => {
    const match = path.match(/^\/([a-z]{2})(?:\/|$)/);
    if (match && locales.includes(match[1] as Locale)) {
      return match[1];
    }
    return 'en'; // default fallback
  };

  const locale = getLocaleFromPathname(pathname);

  return (
    <nav className='w-full flex justify-center border-b border-b-foreground/10 h-16'>
      <div className='w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm'>
        <div className='flex gap-5 items-center font-semibold'>
          <Link href={`/${locale}`} className='hover:text-foreground/80 transition-colors'>
            {t('home')}
          </Link>
          <Link
            href={`/${locale}/vendors`}
            className='text-muted-foreground hover:text-foreground transition-colors'>
            {t('vendors')}
          </Link>
          {user && (
            <Link
              href={`/${locale}/protected`}
              className='text-muted-foreground hover:text-foreground transition-colors'>
              {t('members')}
            </Link>
          )}
        </div>
        <div className='flex items-center gap-3'>
          <LanguageSwitcher />
          <ThemeSwitcher />
          {!hasEnvVars ? (
            <EnvVarWarning />
          ) : user ? (
            <div className='flex items-center gap-4'>
              {tAuth('hey', { email: user.email || tAuth('user') })}
              <LogoutButton />
            </div>
          ) : (
            <div className='flex gap-2'>
              <Button asChild size='sm' variant={'outline'}>
                <Link href={`/${locale}/auth/login`}>{tAuth('login')}</Link>
              </Button>
              <Button asChild size='sm' variant={'default'}>
                <Link href={`/${locale}/auth/sign-up`}>{tAuth('signUp')}</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
