"use client";
import { useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import Link from "next/link";

export default function Home() {
  return (
    <div className="fade-in w-full flex flex-col items-center justify-center min-h-[70vh]">
      <h1 className="text-4xl sm:text-5xl font-extrabold mb-3 tracking-tight text-center text-foreground">SnapdropX</h1>
      <p className="mb-8 text-center max-w-xl text-lg text-secondary font-medium">Instantly share files or text with a link or QR code. No login. Minimal, fast, and private.</p>
      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md mb-10">
        <Link href="/send-file" className="flex-1 bg-button-bg hover:bg-button-hover text-button-text rounded-xl py-4 px-6 text-lg font-semibold shadow-md text-center transition-all duration-200">Send File</Link>
        <Link href="/send-text" className="flex-1 bg-secondary hover:bg-primary text-white rounded-xl py-4 px-6 text-lg font-semibold shadow-md text-center transition-all duration-200">Send Text</Link>
      </div>
      <div className="flex flex-col sm:flex-row gap-8 w-full max-w-2xl justify-center">
        <div className="card text-center">
          <h2 className="font-bold mb-2 text-xl text-card-text">Drop File</h2>
          <p className="text-sm text-secondary">Upload and share files up to 50MB. Get a link or QR code instantly.</p>
        </div>
        <div className="card text-center">
          <h2 className="font-bold mb-2 text-xl text-card-text">Paste Text</h2>
          <p className="text-sm text-secondary">Paste notes, code, or any text. Share with a link or QR code.</p>
        </div>
      </div>
      <div className="mt-10 text-xs text-secondary flex items-center gap-2">
        <span>Made with ❤️ for privacy and speed</span>
      </div>
    </div>
  );
}
