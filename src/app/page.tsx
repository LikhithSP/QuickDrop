"use client";
import { useState } from "react";
import { FaMoon, FaSun, FaArrowRight } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setError("Please enter a code");
      return;
    }
    
    setError("");
    router.push(`/code/${code}`);
  };

  return (
    <div className="fade-in w-full flex flex-col items-center justify-center min-h-[60vh] mt-[-48px]">
      <h1 className="text-4xl sm:text-5xl font-extrabold mb-3 tracking-tight text-center text-foreground">QuickDrop</h1>
      <p className="mb-8 text-center max-w-xl text-lg text-secondary font-medium">Instantly share files or text with a code or QR image. No login. Minimal, fast, and private.</p>
      
      {/* Code input area */}
      <div className="w-full max-w-md mb-10">
        <form onSubmit={handleCodeSubmit} className="flex flex-col items-center">
          <div className="w-full bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-[#915858] dark:border-primary rounded-2xl shadow-lg p-6 flex flex-col items-center gap-2">
            <p className="text-secondary text-sm mb-1">Have a code? Enter it here:</p>
            <div className="flex w-full items-center">              <input
                type="text"
                className="flex-1 p-4 rounded-l-xl border-0 bg-white/80 dark:bg-black/40 text-input-text focus:ring-2 focus:ring-primary outline-none transition text-center text-2xl tracking-widest font-mono font-bold shadow-inner placeholder:font-normal placeholder:tracking-normal"
                placeholder="CODE"
                maxLength={4}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
                style={{ letterSpacing: '0.5em' }}
                autoComplete="off"
              />
              <button 
                type="submit"
                className="bg-primary hover:bg-primary/80 text-white rounded-r-xl px-6 py-4 transition-all duration-200 flex items-center justify-center text-2xl font-bold shadow-md ml-2"
                aria-label="Go"
              >
                <FaArrowRight />
              </button>
            </div>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>
        </form>
      </div>
      {/* Send File and Send Text buttons */}
      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md mb-6">
        <Link
          href="/send-file"
          className="send-main-btn flex-1 rounded-xl py-5 px-7 text-lg font-semibold shadow-lg text-center transition-all duration-200 border-2 scale-100 hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          <span className="flex items-center justify-center gap-2">
            Send File
          </span>
        </Link>
        <Link
          href="/send-text"
          className="send-main-btn flex-1 rounded-xl py-5 px-7 text-lg font-semibold shadow-lg text-center transition-all duration-200 border-2 scale-100 hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-secondary/40"
        >
          <span className="flex items-center justify-center gap-2">
            Send Text
          </span>
        </Link>
      </div>
      {/* Info cards */}
      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-4xl justify-center">
        <div className="card text-center flex-1 bg-white/80 dark:bg-black/40 rounded-lg shadow-lg p-3 flex flex-col items-center border border-primary/10 hover:shadow-xl transition-all duration-200 relative overflow-hidden min-w-[200px] max-w-[320px] mx-auto aspect-[3/1.5]">
          <div className="mb-2">
            <img src="/file.svg" alt="Drop File" className="w-7 h-7 mx-auto drop-shadow animate-float text-primary dark:text-primary" style={{ filter: 'invert(32%) sepia(24%) saturate(747%) hue-rotate(330deg) brightness(90%) contrast(90%)', color: 'var(--primary)' }} />
          </div>
          <h2 className="font-bold mb-1 text-sm text-card-text">Drop File</h2>
          <p className="text-xs text-secondary mb-1 leading-tight">Upload and share files up to 50MB. Get a link or QR code instantly.</p>
          <div className="absolute -bottom-4 -right-4 opacity-10 pointer-events-none select-none">
            <svg width="28" height="28" viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="50" fill="#6366F1" /></svg>
          </div>
        </div>
        <div className="card text-center flex-1 bg-white/80 dark:bg-black/40 rounded-lg shadow-lg p-3 flex flex-col items-center border border-secondary/10 hover:shadow-xl transition-all duration-200 relative overflow-hidden min-w-[200px] max-w-[320px] mx-auto aspect-[3/1.5]">
          <div className="mb-2">
            <img src="/globe.svg" alt="Paste Text" className="w-7 h-7 mx-auto drop-shadow animate-float text-primary dark:text-primary" style={{ filter: 'invert(32%) sepia(24%) saturate(747%) hue-rotate(330deg) brightness(90%) contrast(90%)', color: 'var(--primary)' }} />
          </div>
          <h2 className="font-bold mb-1 text-sm text-card-text">Paste Text</h2>
          <p className="text-xs text-secondary mb-1 leading-tight">Paste notes, code, or any text. Share with a link or QR code.</p>
          <div className="absolute -top-4 -left-4 opacity-10 pointer-events-none select-none">
            <svg width="28" height="28" viewBox="0 0 100 100" fill="none"><rect width="100" height="100" rx="30" fill="#06B6D4" /></svg>
          </div>
        </div>
      </div>
    </div>
  );
}
