import Footer from '@/components/Footer';
import NavBar from '@/components/NavBar/NavBar';

interface LayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: Readonly<LayoutProps>) {
  return (
    <div className="flex flex-col h-full grow">
      <NavBar />
      <main className="container mx-auto h-full grow">{children}</main>
      <Footer />
    </div>
  );
}
