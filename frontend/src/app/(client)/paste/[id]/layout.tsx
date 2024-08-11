import { PasteProvider } from '@/hooks/usePaste';
import { ReactNode } from 'react';

interface PasteLayoutProps {
  children: ReactNode;
  params: {
    id: string;
  };
}

const PasteLayout = async ({ children, params }: PasteLayoutProps) => {
  return <PasteProvider pasteId={params.id}>{children}</PasteProvider>;
};

export default PasteLayout;
