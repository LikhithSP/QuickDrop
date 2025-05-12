"use client";

import Link from "next/link";
import dynamic from "next/dynamic";

// Import ThemeToggle with no SSR to prevent hydration mismatch
const ThemeToggle = dynamic(() => import('../ThemeToggle'), { ssr: false });

export default function Header() {
  return (
    <header className="w-full border-b border-card-border bg-card-bg/90 backdrop-blur-md sticky top-0 z-30 transition-all">
      <nav className="container flex items-center justify-between py-4">
        <Link href="/" className="text-2xl font-bold tracking-tight text-primary hover:text-accent transition-colors">SnapdropX</Link>
        <div className="flex items-center gap-6 text-base font-medium">
          <Link href="/send-file" className="text-card-text hover:text-accent transition-colors">Send File</Link>
          <Link href="/send-text" className="text-card-text hover:text-accent transition-colors">Send Text</Link>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
