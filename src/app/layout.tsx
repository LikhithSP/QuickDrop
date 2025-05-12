import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SnapdropX",
  description: "Instantly share files or text with a link or QR code. No login. Minimal, fast, and private.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <meta name="theme-color" content="#2563eb" />
        <Script src="/theme.js" strategy="beforeInteractive" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}>
        <Header />
        <main className="container fade-in min-h-[80vh] flex flex-col justify-center items-center">
          {children}
        </main>
        <footer className="w-full border-t border-card-border text-center py-6 text-sm text-secondary mt-8">
          &copy; {new Date().getFullYear()} SnapdropX. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
