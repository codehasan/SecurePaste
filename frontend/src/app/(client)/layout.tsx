import Footer from '@/components/Footer';
import NavBar from '@/components/NavBar/NavBar';
import { ToastProvider } from '@/hooks/useToast';
import 'react-toastify/dist/ReactToastify.css';

interface LayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: Readonly<LayoutProps>) {
  return (
    <div className="flex flex-col grow">
      <NavBar />
      <main className="container mx-auto h-full grow">
        <ToastProvider>{children}</ToastProvider>
      </main>
      <Footer />
    </div>
  );
}
