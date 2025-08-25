'use client';

import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';

export function LogoutButton() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || 'en';

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push(`/${locale}/auth/login`);
  };

  return <Button onClick={logout}>Logout</Button>;
}
