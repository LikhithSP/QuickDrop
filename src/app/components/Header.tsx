"use client";

import Link from "next/link";
import dynamic from "next/dynamic";

// Import ThemeToggle with no SSR to prevent hydration mismatch
const ThemeToggle = dynamic(() => import('../ThemeToggle'), { ssr: false });

export default function Header() {
  return (
    <header className=" border-card-border bg-card-bg/90 backdrop-blur-md sticky top-0 z-30 transition-all">
      <nav className="container flex items-center justify-between py-4">
        <Link href="/" className="text-2xl font-bold tracking-tight text-primary hover:text-accent transition-colors">QD</Link>
        <div className="flex items-center gap-6 text-base font-medium">
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
