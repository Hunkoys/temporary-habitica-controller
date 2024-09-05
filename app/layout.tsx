import { ClerkProvider, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { NextUIProvider } from '@nextui-org/system';
import { dark } from '@clerk/themes';
import SignInCard from '@/app/components/login/SignInCard';
import Navbar from '@/app/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Habitica Controller',
  description: 'This is temporary',
  generator: 'Next.js',
  manifest: '/manifest.json',
  appleWebApp: {
    startupImage: '/apple-icon.jpg',
    capable: true,
    title: 'Habitica Controller',
    statusBarStyle: 'black-translucent',
  },
};

export const viewport: Viewport = {
  minimumScale: 1,
  maximumScale: 1,
  initialScale: 1,
  width: 'device-width',
  viewportFit: 'contain',
  userScalable: false,
  themeColor: [{ media: '(prefers-color-scheme: dark)', color: '#fff' }],
};

const iconSize = 36;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en" className="dark bg-background h-full">
        <body className={`${inter.className} h-full w-full`}>
          <NextUIProvider className=" h-full w-full">
            <SignedOut>
              <SignInCard />
            </SignedOut>
            <SignedIn>
              <div className="h-full flex flex-col items-center gap-3 p-3">
                <Navbar />
                {children}
              </div>
            </SignedIn>
          </NextUIProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
