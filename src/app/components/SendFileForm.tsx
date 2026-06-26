"use client";
import { useRef, useState } from "react";
import { supabase, generateCode } from "@/lib/supabaseClient";
import QRCode from "qrcode";
import { FaCopy, FaClock } from "react-icons/fa";

const MAX_SIZE = 50 * 1024 * 1024; // 50MB

// Handle origin correctly for both development and Vercel deployments
const SITE_ORIGIN = typeof window !== "undefined" 
  ? window.location.origin 
  : process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}`
    : "";

export default function SendFileForm() {
  const [files, setFiles] = useState<File[]>([]);
  const [expiry, setExpiry] = useState("1h");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [link, setLink] = useState("");
  const [qr, setQr] = useState("");
  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleFiles = (incomingFiles: File[]) => {
    const allFiles = [...files, ...incomingFiles];
    const totalSize = allFiles.reduce((sum, f) => sum + f.size, 0);
    if (totalSize > MAX_SIZE) {
      setError("Total file size exceeds 50MB limit.");
      return;
    }
    setError("");
    setFiles(allFiles);
  };

  const removeFile = (index: number) => {
    if (code) return; // Prevent edit after upload
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setUploading(true);
    setError("");    
    
    try {
      const filePaths: string[] = [];
      
      for (const file of files) {
        const cleanName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
        // Prepend timestamp and random key to avoid collisions
        const filePath = `${Date.now()}-${Math.random().toString(36).slice(2)}-${cleanName}`;
        const { error: uploadError } = await supabase.storage.from("drops").upload(filePath, file, { upsert: false });
        
        if (uploadError) {
          setError(`Upload failed for ${file.name}: ${uploadError.message}`);
          setUploading(false);
          return;
        }
        
        filePaths.push(filePath);
      }
      
      // Store paths as a JSON string
      const resourceId = JSON.stringify(filePaths);
      
      // Generate a unique code
      const generatedCode = await generateCode('file', resourceId, expiry);
      if (!generatedCode) {
        setError("Failed to generate sharing code.");
        setUploading(false);
        return;
      }
      
      setCode(generatedCode);
      const codeUrl = `/code/${generatedCode}`;
      setLink(codeUrl);
      QRCode.toDataURL(SITE_ORIGIN + codeUrl, (err, url) => setQr(url));
    } catch (err) {
      setError("An error occurred during upload.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`w-full transition-all duration-300 ${code ? "max-w-3xl" : "max-w-md"} animate-in fade-in zoom-in-95 duration-200`}>
      <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/30 dark:border-primary rounded-2xl shadow-lg p-6 flex flex-col items-center">
        <div className={`w-full flex flex-col md:flex-row ${code ? "gap-8" : "gap-4"}`}>
          {/* Left Column: Form */}
          <div className={`flex flex-col items-center ${code ? "md:w-1/2" : "w-full"}`}>
            <h2 className="text-xl font-bold mb-4 text-card-text text-center w-full">Send File</h2>
            <div
              className="w-full border-2 border-dashed border-input-border rounded-xl p-6 text-center cursor-pointer bg-background/80 hover:bg-accent/10 transition mb-4 max-h-48 overflow-y-auto"
              onClick={() => !code && inputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
            >
              {files.length > 0 ? (
                <div className="flex flex-col gap-2 w-full text-left" onClick={e => e.stopPropagation()}>
                  {files.map((f, i) => (
                    <div key={i} className="flex justify-between items-center bg-white/70 dark:bg-black/30 p-2 rounded-lg border border-input-border/30">
                      <div className="flex-1 min-w-0 pr-2">
                        <div className="font-semibold text-sm text-card-text truncate">{f.name}</div>
                        <div className="text-xs text-secondary">{(f.size / 1024 / 1024).toFixed(2)} MB</div>
                      </div>
                      {!code && (
                        <button 
                          onClick={() => removeFile(i)} 
                          className="text-red-500 hover:text-red-700 text-xs font-bold px-2 py-1 border-0 bg-transparent cursor-pointer"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  {!code && (
                    <div className="text-center text-xs text-secondary mt-1">
                      Click inside this area to add more files
                    </div>
                  )}
                </div>
              ) : (
                <span className="text-secondary text-sm">Drag & drop or click to select files (max 50MB total)</span>
              )}
              <input
                type="file"
                ref={inputRef}
                className="hidden"
                multiple
                onChange={e => e.target.files && handleFiles(Array.from(e.target.files))}
                disabled={!!code}
              />
            </div>

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
              disabled={files.length === 0 || uploading || !!code}
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
                    : "text-secondary hover:text-primary border-input-border bg-background hover:bg-background/80"
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
