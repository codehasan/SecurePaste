'use server';
import { PasteProvider } from '@/hooks/usePaste';
import logger from '@/lib/logging/server';
import { getPasteById } from '@/utils/services/paste';
import { getUserInfoById } from '@/utils/services/user';
import { User as PrismaUser } from '@prisma/client';
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
