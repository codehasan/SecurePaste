import Footer from '@/components/Footer';
import NavBar from '@/components/NavBar/NavBar';
import ClientProviders from './providers';

interface LayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: Readonly<LayoutProps>) {
  return (
    <ClientProviders>
      <div className="flex grow flex-col">
        <NavBar />
        <main className="container mx-auto h-full grow">{children}</main>
        <Footer />
      </div>
    </ClientProviders>
  );
}
