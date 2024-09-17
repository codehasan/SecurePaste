'use server';

import { PasteProvider } from '@/hooks/usePaste';
import { getPasteById } from '@/utils/services/paste';
import { ReactNode } from 'react';

interface PasteLayoutProps {
  children: ReactNode;
  params: {
    id: string;
  };
}

const PasteLayout = async ({ children, params }: PasteLayoutProps) => {
  const { authUser, data } = await getPasteById(params.id);

  return (
    <PasteProvider paste={data} authUser={authUser}>
      {children}
    </PasteProvider>
  );
};

export default PasteLayout;
