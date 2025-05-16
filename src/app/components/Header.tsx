"use client";

import Link from "next/link";
import dynamic from "next/dynamic";

const ThemeToggle = dynamic(() => import('../ThemeToggle'), { ssr: false });

export default function Header() {
  return (
    <header className="border-card-border bg-card-bg/90 sticky top-0 z-30 transition-all">
      <nav className="container flex items-center justify-between py-2">
        <Link href="/" className="text-xl font-bold tracking-tight text-primary hover:text-accent transition-colors flex items-center gap-2">
          <span className="inline-block align-middle" style={{ transform: 'rotate(-25deg) translateY(-2px)' }}>
            {/* Paper rocket (paper plane) SVG icon, angled to look like it's flying */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="text-accent mr-1" aria-hidden="true">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </span>
          QD
        </Link>
        <div className="flex items-center gap-6 text-base font-medium">
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
