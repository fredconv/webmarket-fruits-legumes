'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';
import { locales, type Locale } from '@/i18n';

export function LanguageSwitcher() {
  const t = useTranslations('language');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (newLocale: Locale) => {
    // Remove the current locale from the pathname
    const pathWithoutLocale = pathname.replace(`/${locale}`, '');
    // Navigate to the new locale
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  const getLanguageLabel = (locale: string) => {
    switch (locale) {
      case 'en':
        return t('english');
      case 'fr':
        return t('french');
      case 'nl':
        return t('dutch');
      default:
        return locale.toUpperCase();
    }
  };

  const getCurrentLanguageFlag = (locale: string) => {
    switch (locale) {
      case 'en':
        return '🇺🇸';
      case 'fr':
        return '🇫🇷';
      case 'nl':
        return '🇳🇱';
      default:
        return '🌐';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='sm' className='gap-2'>
          <Globe className='h-4 w-4' />
          <span className='hidden sm:inline'>
            {getCurrentLanguageFlag(locale)} {getLanguageLabel(locale)}
          </span>
          <span className='sm:hidden'>{getCurrentLanguageFlag(locale)}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        {locales.map((lang) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => handleLanguageChange(lang)}
            className={locale === lang ? 'bg-accent' : ''}>
            <span className='mr-2'>{getCurrentLanguageFlag(lang)}</span>
            {getLanguageLabel(lang)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
