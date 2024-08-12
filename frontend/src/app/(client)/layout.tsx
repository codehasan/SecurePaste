import Footer from '@/components/Footer';
import NavBar from '@/components/NavBar/NavBar';
import { ToastProvider } from '@/hooks/useToast';

interface LayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: Readonly<LayoutProps>) {
  return (
    <div className="flex flex-col h-full grow">
      <NavBar />
      <ToastProvider>
        <main className="container mx-auto h-full grow">{children}</main>
      </ToastProvider>
      <Footer />
    </div>
  );
}
