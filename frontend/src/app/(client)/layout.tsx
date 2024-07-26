import NavBar from '@/components/NavBar/NavBar';

interface LayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: Readonly<LayoutProps>) {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="container mx-auto grow">{children}</main>
    </div>
  );
}
