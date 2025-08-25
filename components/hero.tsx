import { NextLogo } from './next-logo';
import { SupabaseLogo } from './supabase-logo';

export function Hero() {
  return (
    <div className='flex flex-col gap-16 items-center'>
      <div className='flex gap-8 justify-center items-center'>
        <a
          href='https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs'
          target='_blank'
          rel='noreferrer'>
          <SupabaseLogo />
        </a>
        <span className='border-l rotate-45 h-6' />
        <a href='https://nextjs.org/' target='_blank' rel='noreferrer'>
          <NextLogo />
        </a>
      </div>
      <h1 className='sr-only'>Fruit & Vegetable Market - Connect with Local Vendors</h1>
      <p className='text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center'>
        Connect with local <span className='font-bold text-green-600'>fruit & vegetable</span>{' '}
        vendors in your area
      </p>
      <div className='w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8' />
    </div>
  );
}
