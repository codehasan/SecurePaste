import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/router';

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

export const useProtectedClient = async () => {
  const router = useRouter();
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    router.push('/signin');
  }

  return { supabase, user: data.user };
};
