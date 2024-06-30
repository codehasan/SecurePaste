import { globalFont } from '@/lib/head/GlobalFont';
import { ReactNode } from 'react';
import { globalMetadata } from '@/lib/head/MetaData';
import { Metadata } from 'next';

import '../globals.css';

interface LayoutProps {
  children: ReactNode;
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
      </head>
      <body className={globalFont.className}>
        <main>{children}</main>
      </body>
    </html>
  );
}
