"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import QRCode from "qrcode";
import { FaCopy, FaWhatsapp } from "react-icons/fa";

// Handle origin correctly for both development and Vercel deployments
const SITE_ORIGIN = typeof window !== "undefined" 
  ? window.location.origin 
  : process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}`
    : "";

export default function SendTextPage() {
  const [text, setText] = useState("");
  const [nickname, setNickname] = useState("");
  const [expiry, setExpiry] = useState("24h");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [link, setLink] = useState("");
  const [qr, setQr] = useState("");

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
          nickname: nickname || null,
          expiry: expiry === "24h" ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ])
      .select();
    if (insertError || !data || !data[0]) {
      setError("Failed to save text.");
      setUploading(false);
      return;
    }
    const id = data[0].id;
    const url = `/text/${nickname || id}`;
    setLink(url);
    QRCode.toDataURL(SITE_ORIGIN + url, (err, url) => setQr(url));
    setUploading(false);
  };

  return (
    <div className="container fade-in">
      <div className="card max-w-xl mx-auto">
        <h1 className="text-2xl font-extrabold mb-6 text-card-text text-center">Send Text</h1>
        <textarea
          className="w-full h-32 p-3 rounded-lg border border-input-border bg-input-bg text-input-text focus:border-primary outline-none transition mb-3 resize-none"
          placeholder="Paste your notes, code, or any text here..."
          value={text}
          onChange={e => setText(e.target.value)}
          maxLength={5000}
        />
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
        {error && <div className="text-red-500 mb-3 text-center">{error}</div>}
        <button
          className="w-full bg-button-bg hover:bg-button-hover text-button-text rounded-xl py-3 px-6 font-semibold shadow-md transition-all duration-200 mb-4 disabled:opacity-60"
          onClick={handleUpload}
          disabled={uploading}
        >
          {uploading ? "Saving..." : "Save & Get Link"}
        </button>
        {link && (
          <div className="mt-8 text-center">
            <div className="mb-2 text-secondary">Share this link:</div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <input className="border rounded-lg p-2 w-60 bg-input-bg text-input-text border-input-border" value={SITE_ORIGIN + link} readOnly />
              <button onClick={() => navigator.clipboard.writeText(SITE_ORIGIN + link)} className="p-2 text-secondary hover:text-primary transition"><FaCopy /></button>
              <a href={`https://wa.me/?text=${encodeURIComponent(SITE_ORIGIN + link)}`} target="_blank" rel="noopener noreferrer" className="p-2 text-green-600 hover:scale-110 transition"><FaWhatsapp /></a>
            </div>
            {qr && <img src={qr} alt="QR Code" className="mx-auto mt-2 w-32 h-32 rounded-lg shadow bg-white p-1" />}
          </div>
        )}
      </div>
    </div>
  );
}
