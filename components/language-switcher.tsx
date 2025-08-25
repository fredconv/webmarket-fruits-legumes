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
  const hookLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  // Extract locale from pathname as fallback
  const getLocaleFromPathname = (path: string): Locale => {
    const match = path.match(/^\/([a-z]{2})(?:\/|$)/);
    if (match && locales.includes(match[1] as Locale)) {
      return match[1] as Locale;
    }
    return 'en'; // default fallback
  };

  // Use pathname-derived locale if it differs from hook locale
  const locale = getLocaleFromPathname(pathname) || hookLocale;

  const handleLanguageChange = (newLocale: Locale) => {
    // Get current pathname and remove all possible locale prefixes
    let pathWithoutLocale = pathname;

    // Remove locale prefix if it exists at the start
    const localePattern = new RegExp(`^/(${locales.join('|')})`);
    pathWithoutLocale = pathWithoutLocale.replace(localePattern, '');

    // Ensure we have a leading slash for the path part
    if (pathWithoutLocale && !pathWithoutLocale.startsWith('/')) {
      pathWithoutLocale = '/' + pathWithoutLocale;
    }

    // Construct new URL
    const newPath = `/${newLocale}${pathWithoutLocale}`;

    console.log('Original pathname:', pathname);
    console.log('Path without locale:', pathWithoutLocale);
    console.log('New path:', newPath);

    router.push(newPath);
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
