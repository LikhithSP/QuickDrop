"use client";
import { useState } from "react";
import { supabase, generateCode, getExpiryDate } from "@/lib/supabaseClient";
import QRCode from "qrcode";
import { FaCopy, FaClock } from "react-icons/fa";

// Handle origin correctly for both development and Vercel deployments
const SITE_ORIGIN = typeof window !== "undefined" 
  ? window.location.origin 
  : process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}`
    : "";

export default function SendTextForm() {
  const [text, setText] = useState("");
  const [expiry, setExpiry] = useState("1h");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [link, setLink] = useState("");
  const [qr, setQr] = useState("");
  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleUpload = async () => {
    if (!text.trim()) {
      setError("Text cannot be empty.");
      return;
    }
    setUploading(true);
    setError("");
    
    // Insert text into Supabase table
    const { data, error: insertError } = await supabase
      .from("text_drops")
      .insert([
        {
          text,
          expiry: getExpiryDate(expiry),
        },
      ])
      .select();
      
    if (insertError || !data || !data[0]) {
      setError("Failed to save text.");
      setUploading(false);
      return;
    }
    
    const id = data[0].id;
    
    // Generate a unique code
    const generatedCode = await generateCode('text', id, expiry);
    if (!generatedCode) {
      setError("Failed to generate sharing code.");
      setUploading(false);
      return;
    }
    
    setCode(generatedCode);
    // Generate QR code for /code/{code} (not direct text link)
    const codeUrl = `/code/${generatedCode}`;
    setLink(codeUrl);
    QRCode.toDataURL(SITE_ORIGIN + codeUrl, (err, url) => setQr(url));
    setUploading(false);
  };

  return (
    <div className={`w-full transition-all duration-300 ${code ? "max-w-3xl" : "max-w-md"} animate-in fade-in zoom-in-95 duration-200`}>
      <div className="bg-gradient-to-br from-secondary/10 to-primary/10 border-2 border-secondary/30 dark:border-secondary rounded-2xl shadow-lg p-6 flex flex-col items-center">
        <div className={`w-full flex flex-col md:flex-row ${code ? "gap-8" : "gap-4"}`}>
          {/* Left Column: Form */}
          <div className={`flex flex-col items-center ${code ? "md:w-1/2" : "w-full"}`}>
            <h2 className="text-xl font-bold mb-4 text-card-text text-center w-full">Send Text</h2>
            <textarea
              className="w-full h-32 p-3 rounded-lg border border-input-border bg-input-bg text-input-text focus:border-secondary outline-none transition mb-4 resize-none shadow-inner text-sm"
              placeholder="Paste your notes, code, or any text here..."
              value={text}
              onChange={e => setText(e.target.value)}
              maxLength={5000}
              disabled={!!code}
            />

            <div className="w-full mb-6 flex items-center justify-between gap-4 py-1">
              <div className="flex items-center gap-2 text-secondary">
                <FaClock className="text-[#915858] dark:text-primary" size={15} />
                <label className="text-xs sm:text-sm font-bold whitespace-nowrap">Auto-delete in:</label>
              </div>
              <div className="relative min-w-[130px]">
                <select 
                  value={expiry} 
                  onChange={e => setExpiry(e.target.value)} 
                  disabled={!!code}
                  className="w-full appearance-none bg-white/90 dark:bg-neutral-800/90 !border !border-input-border/60 !rounded-xl !py-2 !pl-3.5 !pr-9 text-input-text focus:!border-[#915858] dark:focus:!border-primary outline-none transition-all font-bold text-xs sm:text-sm shadow-sm hover:bg-white dark:hover:bg-neutral-800 cursor-pointer disabled:opacity-60"
                >
                  <option value="1h">1 Hour</option>
                  <option value="2h">2 Hours</option>
                  <option value="7h">7 Hours</option>
                  <option value="1d">1 Day</option>
                  <option value="7d">7 Days</option>
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-secondary">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>
            </div>
            
            {error && <div className="text-red-500 text-xs mb-3 text-center w-full">{error}</div>}        
            
            <button
              className="w-full share-btn bg-button-bg hover:bg-button-hover text-button-text rounded-xl py-3 px-6 font-semibold shadow-md transition-all duration-200 mb-2 disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={handleUpload}
              disabled={uploading || !text.trim() || !!code}
            >
              {uploading ? "Sharing..." : "Share"}
            </button>
          </div>

          {/* Divider Line (Desktop only) */}
          {code && <div className="hidden md:block w-[1.5px] bg-input-border/20 self-stretch my-4" />}

          {/* Right Column: Code & QR */}
          {code && (
            <div className="md:w-1/2 flex flex-col items-center justify-center text-center pt-6 md:pt-0 md:pl-2 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="mb-2 text-secondary text-sm font-semibold">Share this code:</div>
              <div className="text-5xl font-extrabold font-mono tracking-widest bg-accent/20 py-3.5 px-8 rounded-xl inline-block mb-4 text-black dark:text-white shadow-inner">
                {code}
              </div>
              <button 
                onClick={handleCopy} 
                className={`mb-4 transition-all duration-200 inline-flex items-center gap-2 text-sm border px-4 py-2 rounded-lg cursor-pointer font-semibold ${
                  copied 
                    ? "bg-[#915858]/15 text-[#915858] border-[#915858]/30 dark:bg-primary/20 dark:text-primary dark:border-primary/30" 
                    : "text-secondary hover:text-secondary transition border-input-border bg-background hover:bg-background/80"
                }`}
              >
                <FaCopy size={14} /> {copied ? "Copied!" : "Copy Code"}
              </button>
              {qr && <img src={qr} alt="QR Code" className="w-36 h-36 rounded-lg shadow-md bg-white p-2" />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
