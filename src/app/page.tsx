"use client";
import { useState } from "react";
import QRCode from "qrcode";
import { FaMoon, FaSun } from "react-icons/fa";
import Image from "next/image";

export default function Home() {
  const [dark, setDark] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleDark = () => {
    setDark((d) => !d);
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", !dark);
    }
  };

  return (
    <div className={`min-h-screen p-8 pb-20 flex flex-col items-center justify-center font-sans transition-colors duration-300 ${dark ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      <button
        className="absolute top-4 right-4 p-2 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow hover:scale-110 transition"
        onClick={toggleDark}
        aria-label="Toggle dark mode"
      >
        {dark ? <FaSun /> : <FaMoon />}
      </button>
      {loading && (
        <div className="mb-4 animate-bounce text-4xl">🎓</div>
      )}
      <h1 className="text-3xl sm:text-5xl font-bold mb-2">CampusDrop</h1>
      <p className="mb-6 text-center max-w-xl">Instantly share files or text with a link or QR code. No login. Made for <span className="font-semibold">XYZ College</span>! 🚀</p>
      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md mb-8">
        <a href="/send-file" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-4 px-6 text-lg font-semibold shadow text-center transition">Send File</a>
        <a href="/send-text" className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-lg py-4 px-6 text-lg font-semibold shadow text-center transition">Send Text</a>
      </div>
      <div className="flex flex-col sm:flex-row gap-8 w-full max-w-2xl justify-center">
        <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-6 shadow text-center">
          <h2 className="font-bold mb-2">Drop File</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Upload and share files up to 50MB. Get a link or QR code instantly.</p>
        </div>
        <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-6 shadow text-center">
          <h2 className="font-bold mb-2">Paste Text</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Paste notes, code, or any text. Share with a link or QR code.</p>
        </div>
      </div>
      <div className="mt-10 text-xs text-gray-400 dark:text-gray-500 flex items-center gap-2">
        <span>🔗 Shared in XYZ College</span>
      </div>
    </div>
  );
}
