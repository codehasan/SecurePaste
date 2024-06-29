import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { SEO } from '@/components/SEO';
import NavBar from '@/components/NavBar/NavBar';

import './globals.css';

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  style: ['normal'],
  subsets: ['latin'],
  preload: true,
  fallback: ['Arial', 'sans-serif'],
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  applicationName: 'SecurePaste',
  title: 'SecurePaste',
  description:
    'Empowering secure data sharing through advanced encryption and blockchain technology, ensuring unparalleled privacy and reliability for your confidential information.',
  viewport: 'width=device-width, initial-scale=1.0',
  themeColor: '#000000',
  creator: 'Ratul Hasan, ratul.hasan.rahat.bd@gmail.com',
  generator: 'Ratul Hasan',
  authors: {
    name: 'Ratul Hasan',
    url: 'https://github.com/codehasan',
  },
  robots: 'ALL',
  category:
    'Security, Data Protection, Encryption, Blockchain, Privacy, Secure Sharing',
};

interface LayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Readonly<LayoutProps>) {
  return (
    <html lang="en">
      <head>
        <link rel="language" href="en-US" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/icon.png" />
        <SEO
          title={metadata.title as string}
          description={metadata.description as string}
          keywords={['secure', 'paste', 'safe', 'pastebin']}
        ></SEO>
      </head>
      <body className={poppins.className}>
        <NavBar />
        <main>{children}</main>
      </body>
    </html>
  );
}
