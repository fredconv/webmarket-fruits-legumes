'use client';

import { useLocale, useTranslations } from 'next-intl';

import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { TutorialStep } from './tutorial-step';

export function SignUpUserSteps() {
  const t = useTranslations('tutorial');
  const locale = useLocale();

  return (
    <ol className='flex flex-col gap-6'>
      {process.env.VERCEL_ENV === 'preview' || process.env.VERCEL_ENV === 'production' ? (
        <TutorialStep title={t('setupRedirectUrls')}>
          <p>{t('hostedOnVercel')}</p>
          <p className='mt-4'>
            {t('particularDeployment')}
            <span className='relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-xs font-medium text-secondary-foreground border'>
              &quot;{process.env.VERCEL_ENV}&quot;
            </span>{' '}
            on
            <span className='relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-xs font-medium text-secondary-foreground border'>
              https://{process.env.VERCEL_URL}
            </span>
            .
          </p>
          <p className='mt-4'>
            {t('getTheMostOut')}{' '}
            <Link
              className='text-primary hover:text-foreground'
              href={'https://supabase.com/dashboard/project/_/auth/url-configuration'}>
              {t('updateSupabaseProject')}
            </Link>{' '}
            {t('withRedirectUrls')}
          </p>
          <ul className='mt-4'>
            <li>
              -{' '}
              <span className='relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-xs font-medium text-secondary-foreground border'>
                http://localhost:3000/**
              </span>
            </li>
            <li>
              -{' '}
              <span className='relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-xs font-medium text-secondary-foreground border'>
                {`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/**`}
              </span>
            </li>
            <li>
              -{' '}
              <span className='relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-xs font-medium text-secondary-foreground border'>
                {`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL?.replace(
                  '.vercel.app',
                  ''
                )}-*-[vercel-team-url].vercel.app/**`}
              </span>{' '}
              (Vercel Team URL can be found in{' '}
              <Link
                className='text-primary hover:text-foreground'
                href='https://vercel.com/docs/accounts/create-a-team#find-your-team-id'
                target='_blank'>
                Vercel Team settings
              </Link>
              )
            </li>
          </ul>
          <Link
            href='https://supabase.com/docs/guides/auth/redirect-urls#vercel-preview-urls'
            target='_blank'
            className='text-primary/50 hover:text-primary flex items-center text-sm gap-1 mt-4'>
            Redirect URLs Docs <ArrowUpRight size={14} />
          </Link>
        </TutorialStep>
      ) : null}
      <TutorialStep title={t('signUpFirstUser')}>
        <p>
          {t.rich('signUpFirstUserDescription', {
            signUpLink: (chunks) => (
              <Link
                href={`/${locale}/auth/sign-up`}
                className='font-bold hover:underline text-foreground/80'>
                {chunks}
              </Link>
            ),
          })}
        </p>
      </TutorialStep>
    </ol>
  );
}
