"use client";
import { useRef, useState } from "react";
import { supabase, generateCode } from "@/lib/supabaseClient";
import QRCode from "qrcode";
import { FaCopy, FaWhatsapp, FaLink } from "react-icons/fa";

const MAX_SIZE = 50 * 1024 * 1024; // 50MB

// Handle origin correctly for both development and Vercel deployments
const SITE_ORIGIN = typeof window !== "undefined" 
  ? window.location.origin 
  : process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}`
    : "";

export default function SendFilePage() {
  const [file, setFile] = useState<File | null>(null);
  const [nickname, setNickname] = useState("");
  const [expiry, setExpiry] = useState("24h");  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [link, setLink] = useState("");
  const [qr, setQr] = useState("");
  const [code, setCode] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    if (f.size > MAX_SIZE) {
      setError("File size exceeds 50MB limit.");
      setFile(null);
      return;
    }
    setError("");
    setFile(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };
  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError("");    
    const ext = file.name.split(".").pop();
    const filePath = `${nickname || Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: uploadError } = await supabase.storage.from("drops").upload(filePath, file, { upsert: false });
    if (uploadError) {
      setError("Upload failed: " + uploadError.message);
      setUploading(false);
      return;
    }
    
    // Generate public URL
    supabase.storage.from("drops").getPublicUrl(filePath);
    
    // Generate a unique code
    const generatedCode = await generateCode('file', filePath, expiry);
    if (!generatedCode) {
      setError("Failed to generate sharing code.");
      setUploading(false);
      return;
    }
    
    setCode(generatedCode);
    // Generate QR code for /code/{code} (not direct file link)
    const codeUrl = `/code/${generatedCode}`;
    setLink(codeUrl);
    QRCode.toDataURL(SITE_ORIGIN + codeUrl, (err, url) => setQr(url));
    setUploading(false);
  };

  return (
    <div className="container fade-in">
      <div className="card max-w-xl mx-auto">
        <h1 className="text-2xl font-extrabold mb-6 text-card-text text-center">Send File</h1>
        <div
          className="border-2 border-dashed border-input-border rounded-xl p-8 text-center cursor-pointer bg-background/80 hover:bg-accent/10 transition mb-6"
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
        >
          {file ? (
            <div>
              <div className="font-semibold text-lg text-card-text">{file.name}</div>
              <div className="text-xs text-secondary">{(file.size / 1024 / 1024).toFixed(2)} MB • {file.type}</div>
            </div>
          ) : (
            <span className="text-secondary">Drag & drop or click to select a file (max 50MB)</span>
          )}
          <input
            type="file"
            ref={inputRef}
            className="hidden"
            onChange={e => e.target.files && handleFile(e.target.files[0])}
          />
        </div>
        <input
          className="w-full mb-3 p-3 rounded-lg border border-input-border bg-input-bg text-input-text focus:border-primary outline-none transition"
          placeholder="Optional nickname (e.g. rahul-notes)"
          value={nickname}
          onChange={e => setNickname(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ""))}
          maxLength={32}
        />
        <div className="mb-4 flex items-center gap-2">
          <label className="text-secondary">Expiry:</label>
          <select value={expiry} onChange={e => setExpiry(e.target.value)} className="p-2 rounded-lg border border-input-border bg-input-bg text-input-text focus:border-primary outline-none transition">
            <option value="24h">24 hours</option>
            <option value="7d">7 days</option>
          </select>
        </div>
        {error && <div className="text-red-500 mb-3 text-center">{error}</div>}        <button
          className="w-full share-btn bg-button-bg hover:bg-button-hover text-button-text rounded-xl py-3 px-6 font-semibold shadow-md transition-all duration-200 mb-4 disabled:opacity-60"
          onClick={handleUpload}
          disabled={!file || uploading}
        >
          {uploading ? "Sharing..." : "Share"}
        </button>
        {code && (
          <div className="mt-8 text-center">
            <div className="mb-4">
              <div className="mb-2 text-secondary font-medium">Share this code:</div>
              <div className="text-4xl font-bold font-mono tracking-wider bg-accent/20 py-3 px-6 rounded-lg inline-block">
                {code}
              </div>
              <div className="mt-1 text-xs text-secondary">
                Anyone with this code can access your file at {SITE_ORIGIN}
              </div>
              <button onClick={() => navigator.clipboard.writeText(code)} 
                      className="mt-2 text-secondary hover:text-primary transition inline-flex items-center gap-1 text-sm border border-input-border px-3 py-1 rounded-lg">
                <FaCopy size={14} /> Copy Code
              </button>
            </div>
            {qr && <img src={qr} alt="QR Code" className="mx-auto mt-2 w-32 h-32 rounded-lg shadow bg-white p-1" />}
          </div>
        )}
      </div>
    </div>
  );
}
