"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowRight } from "react-icons/fa";

export default function CodeInput() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setError("Please enter a code");
      return;
    }
    
    setError("");
    router.push(`/code/${code.trim()}`);
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          className="p-2 rounded-l-lg border border-input-border bg-input-bg text-input-text focus:border-primary outline-none transition text-center tracking-wider font-mono w-24"
          placeholder="CODE"
          maxLength={4}
          value={code}          onChange={(e) => {
            // Remove any non-alphanumeric characters but preserve case
            setCode(e.target.value.replace(/[^a-zA-Z0-9]/g, ''));
          }}
        />
        <button 
          type="submit"
          className="bg-primary hover:bg-primary/80 text-white rounded-r-lg px-3 transition-all duration-200 text-sm"
        >
          <FaArrowRight size={12} />
        </button>
      </form>
      {error && <div className="absolute text-xs text-red-500 mt-1">{error}</div>}
    </div>
  );
}
