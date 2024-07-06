import ClientWrapper from '@/lib/context/ClientWrapper';
import { Metadata, Viewport } from 'next';
import { Inter, Manrope } from 'next/font/google';

import './globals.css';

const inter = Manrope({
  weight: ['400', '500', '600', '700'],
  style: ['normal'],
  subsets: ['latin'],
  preload: true,
  fallback: ['Arial', 'sans-serif'],
  adjustFontFallback: true,
});

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  applicationName: 'SecurePaste',
  title: 'SecurePaste',
  description:
    'Empowering secure data sharing through advanced encryption and blockchain technology, ensuring unparalleled privacy and reliability for your confidential information.',
  creator: 'Ratul Hasan, ratul.hasan.rahat.bd@gmail.com',
  generator: 'Ratul Hasan',
  authors: {
    name: 'Ratul Hasan',
    url: 'https://github.com/codehasan',
  },
  robots: 'ALL',
  category:
    'Security, Data Protection, Encryption, Blockchain, Privacy, Secure Sharing',
  keywords: 'secure, paste, safe, pastebin',
};

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: '#000000',
  userScalable: true,
  width: 'device-width',
  initialScale: 1.0,
};

interface LayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Readonly<LayoutProps>) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <link rel="language" href="en-US" />
        <meta
          name="google-site-verification"
          content="WQZCBn-K9y3CEu6gf72DlgWLp3gmaevThCnvgGb3SdE"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
                (function() {
                  const savedTheme = localStorage.getItem('theme') || 'light';
                  document.documentElement.setAttribute('data-theme', savedTheme);
                })();
              `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
