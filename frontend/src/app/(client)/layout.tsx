import { SEO } from '@/components/SEO';
import NavBar from '@/components/NavBar/NavBar';
import ClientWrapper from '@/context/ClientWrapper';
import { globalFont } from '@/lib/head/GlobalFont';
import { globalMetadata } from '@/lib/head/MetaData';

import '../globals.css';
import { Metadata } from 'next';

interface LayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = globalMetadata;

export default function RootLayout({ children }: Readonly<LayoutProps>) {
  return (
    <html lang="en">
      <head>
        <link rel="language" href="en-US" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/icon.png" />
        <meta
          name="google-site-verification"
          content="WQZCBn-K9y3CEu6gf72DlgWLp3gmaevThCnvgGb3SdE"
        />
        <SEO
          title={metadata.title as string}
          description={metadata.description as string}
          keywords={['secure', 'paste', 'safe', 'pastebin']}
        ></SEO>
        <script
          dangerouslySetInnerHTML={{
            __html: `
                (function() {
                  const savedTheme = localStorage.getItem('theme') || 'emerald';
                  document.documentElement.setAttribute('data-theme', savedTheme);
                })();
              `,
          }}
        />
      </head>
      <body className={globalFont.className}>
        <ClientWrapper>
          <NavBar />
          <main className="w-full h-full">{children}</main>
        </ClientWrapper>
      </body>
    </html>
  );
}
