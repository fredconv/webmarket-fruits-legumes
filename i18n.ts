import { getRequestConfig } from 'next-intl/server';

export const locales = ['en', 'fr', 'nl'] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }) => {
  // Ensure locale is defined and valid
  const validLocale = locale || 'en';
  
  return {
    locale: validLocale,
    messages: (await import(`./messages/${validLocale}.json`)).default,
  };
});
