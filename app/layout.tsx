import { ClerkProvider, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import Image from 'next/image';
import listIcon from '@/app/assets/list-icon.png';
import { NextUIProvider } from '@nextui-org/system';
import SignInCard from './components/login/SignInCard';
import { dark } from '@clerk/themes';

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
        <body className={`${inter.className} h-full `}>
          <NextUIProvider className="h-full flex justify-center items-center">
            <SignedOut>
              <SignInCard />
            </SignedOut>
            <SignedIn>
              <div className="bg-slate-950 h-screen flex flex-col justify-between">
                <section className="w-full bg-matter">
                  <div className="flex justify-between align-baseline h-16 p-5">
                    <UserButton />
                    Settings
                  </div>
                </section>
                <section className={`h-full border-2 border-lime-700`}>{children}</section>
                <nav className="w-full bg-matter">
                  <ul className="flex justify-around p-3">
                    <li>
                      <Link href="/">
                        <Image src={listIcon} alt="List Icon" width={iconSize} height={iconSize} />
                      </Link>
                    </li>
                  </ul>
                </nav>
              </div>
            </SignedIn>
          </NextUIProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
