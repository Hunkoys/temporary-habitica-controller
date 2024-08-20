import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import Image from 'next/image';
import listIcon from '@/app/assets/list-icon.png';

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
const bg = 'bg-slate-800';
const matter = 'bg-slate-600';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${bg}`}>
        <body className={inter.className}>
          <SignedOut>
            <section className={`${bg}`}>
              <SignInButton>Sign</SignInButton>
            </section>
          </SignedOut>
          <SignedIn>
            <div className={`${bg} h-screen flex flex-col justify-between`}>
              <section className={`w-full ${matter}`}>
                <div className="flex justify-between align-baseline h-16 p-5">
                  <UserButton />
                  Settings
                </div>
              </section>
              <section className={`h-full border-2 border-lime-700`}>{children}</section>
              <nav className={`w-full ${matter}`}>
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
        </body>
      </html>
    </ClerkProvider>
  );
}
