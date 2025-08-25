'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { AuthButton } from './auth-button';
import { EnvVarWarning } from './env-var-warning';
import { ThemeSwitcher } from './theme-switcher';
import { LanguageSwitcher } from './language-switcher';
import { hasEnvVars } from '@/lib/utils';

export function Navigation() {
  const t = useTranslations('navigation');

  return (
    <nav className='w-full flex justify-center border-b border-b-foreground/10 h-16'>
      <div className='w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm'>
        <div className='flex gap-5 items-center font-semibold'>
          <Link href={'/'} className='hover:text-foreground/80 transition-colors'>
            {t('home')}
          </Link>
          <Link
            href={'/vendors'}
            className='text-muted-foreground hover:text-foreground transition-colors'>
            {t('vendors')}
          </Link>
        </div>
        <div className='flex items-center gap-3'>
          <LanguageSwitcher />
          <ThemeSwitcher />
          {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
        </div>
      </div>
    </nav>
  );
}
