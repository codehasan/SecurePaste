import classNames from 'classnames';
import { Metadata, Viewport } from 'next';
import { Fira_Code, Inter } from 'next/font/google';
import './globals.css';

const interFont = Inter({
  weight: ['400', '500', '600', '700'],
  style: ['normal'],
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  fallback: ['Arial', 'sans-serif'],
  adjustFontFallback: true,
});

const firaSansFont = Fira_Code({
  weight: ['400'],
  style: ['normal'],
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  fallback: ['Consolas', 'Monaco', 'Andale Mono', 'Ubuntu Mono', 'monospace'],
  adjustFontFallback: true,
  variable: '--font-fira-code',
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
  colorScheme: 'only light',
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
    <html lang="en" className={classNames(firaSansFont.variable, 'h-full')}>
      <head>
        <link rel="language" href="en-US" />
        <meta
          name="google-site-verification"
          content="WQZCBn-K9y3CEu6gf72DlgWLp3gmaevThCnvgGb3SdE"
        />
      </head>
      <body
        className={classNames(
          interFont.className,
          'flex h-full flex-col bg-[#f8f8fa]'
        )}
      >
        {children}
      </body>
    </html>
  );
}
