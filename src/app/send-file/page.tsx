"use client";
import { useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import QRCode from "qrcode";
import { FaCopy, FaWhatsapp } from "react-icons/fa";

const MAX_SIZE = 50 * 1024 * 1024; // 50MB

// Use window.location.origin for local development
const SITE_ORIGIN = typeof window !== "undefined" ? window.location.origin : "";

export default function SendFilePage() {
  const [file, setFile] = useState<File | null>(null);
  const [nickname, setNickname] = useState("");
  const [expiry, setExpiry] = useState("24h");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [link, setLink] = useState("");
  const [qr, setQr] = useState("");
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
    const { data, error: uploadError } = await supabase.storage.from("drops").upload(filePath, file, { upsert: false });
    if (uploadError) {
      setError("Upload failed: " + uploadError.message);
      setUploading(false);
      return;
    }
    // Generate public URL
    const { data: publicUrlData } = supabase.storage.from("drops").getPublicUrl(filePath);
    const url = `/file/${filePath}`;
    setLink(url);
    QRCode.toDataURL(SITE_ORIGIN + url, (err, url) => setQr(url));
    setUploading(false);
  };

  return (
    <div className="max-w-lg mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Send File</h1>
      <div
        className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer bg-gray-50 dark:bg-gray-800 mb-4"
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
      >
        {file ? (
          <div>
            <div className="font-semibold">{file.name}</div>
            <div className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB • {file.type}</div>
          </div>
        ) : (
          <span>Drag & drop or click to select a file (max 50MB)</span>
        )}
        <input
          type="file"
          ref={inputRef}
          className="hidden"
          onChange={e => e.target.files && handleFile(e.target.files[0])}
        />
      </div>
      <input
        className="w-full mb-2 p-2 rounded border"
        placeholder="Optional nickname (e.g. rahul-notes)"
        value={nickname}
        onChange={e => setNickname(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ""))}
        maxLength={32}
      />
      <div className="mb-4">
        <label className="mr-2">Expiry:</label>
        <select value={expiry} onChange={e => setExpiry(e.target.value)} className="p-1 rounded border">
          <option value="24h">24 hours</option>
          <option value="7d">7 days</option>
        </select>
      </div>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 px-6 font-semibold shadow mb-4 w-full"
        onClick={handleUpload}
        disabled={!file || uploading}
      >
        {uploading ? "Uploading..." : "Upload & Get Link"}
      </button>
      {link && (
        <div className="mt-6 text-center">
          <div className="mb-2">Share this link:</div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <input className="border rounded p-1 w-60" value={SITE_ORIGIN + link} readOnly />
            <button onClick={() => navigator.clipboard.writeText(SITE_ORIGIN + link)} className="p-2"><FaCopy /></button>
            <a href={`https://wa.me/?text=${encodeURIComponent(SITE_ORIGIN + link)}`} target="_blank" rel="noopener noreferrer" className="p-2 text-green-600"><FaWhatsapp /></a>
          </div>
          {qr && <img src={qr} alt="QR Code" className="mx-auto mt-2 w-32 h-32" />}
        </div>
      )}
    </div>
  );
}
