import NavBar from '@/components/NavBar/NavBar';

interface LayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: Readonly<LayoutProps>) {
  return (
    <>
      <NavBar />
      <main className="size-full">{children}</main>
    </>
  );
}
