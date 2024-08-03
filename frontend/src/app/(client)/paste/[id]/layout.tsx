import { PasteProvider } from '@/hooks/usePaste';
import { ReactNode, Suspense } from 'react';
import Loading from '../../loading';
import { createClient } from '@/utils/supabase/server';
import { getPasteById } from '@/utils/services/paste';

interface PasteLayoutProps {
  children: ReactNode;
  params: {
    id: string;
  };
}

const PasteLayout = async ({ children, params }: PasteLayoutProps) => {
  const supabase = createClient();
  const { authUser, paste } = await getPasteById(supabase, params.id);

  return (
    <Suspense fallback={<Loading />}>
      <PasteProvider authUser={authUser} paste={paste}>
        {children}
      </PasteProvider>
    </Suspense>
  );
};

export default PasteLayout;
