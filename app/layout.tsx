import Header from "@/app/_components/sections/Header";
import SignInCard from "@/app/_components/elements/login/SignInCard";
import Navbar from "@/app/_components/sections/Navbar";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Spinner } from "@heroui/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Habitica Controller",
  description: "This is temporary",
  generator: "Next.js",
  manifest: "/manifest.json",
  appleWebApp: {
    startupImage: "/apple-icon.jpg",
    capable: true,
    title: "Habitica Controller",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  minimumScale: 1,
  maximumScale: 1,
  initialScale: 1,
  width: "device-width",
  viewportFit: "contain",
  userScalable: false,
  themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#fff" }],
};

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
      <html lang="en" className="dark bg-[#161616] h-full">
        <body className={`${inter.className} h-full w-full overflow-hidden`}>
          <SignedOut>
            <SignInCard />
          </SignedOut>
          <SignedIn>
            <div className="h-full overflow-hidden flex flex-col justify-between items-center gap-1 py-1">
              <Header />
              <div className="overflow-y-auto h-full w-full">{children}</div>
              <Navbar />
            </div>
          </SignedIn>
        </body>
      </html>
    </ClerkProvider>
  );
}

function LoadingOverlay() {
  return (
    <div className="absolute w-screen h-screen flex justify-center items-center backdrop-blur">
      <Spinner />
    </div>
  );
}
