"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import QRCode from "qrcode";
import { FaCopy, FaWhatsapp } from "react-icons/fa";

// Replace window.location.origin with Netlify site URL for deployment
const SITE_ORIGIN = typeof window !== "undefined" && window.location.origin !== "http://localhost:3000"
  ? window.location.origin
  : "https://snapdropx.netlify.app";

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
    <div className="max-w-lg mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Send Text</h1>
      <textarea
        className="w-full h-32 p-2 rounded border mb-2"
        placeholder="Paste your notes, code, or any text here..."
        value={text}
        onChange={e => setText(e.target.value)}
        maxLength={5000}
      />
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
        className="bg-green-600 hover:bg-green-700 text-white rounded-lg py-2 px-6 font-semibold shadow mb-4 w-full"
        onClick={handleUpload}
        disabled={uploading}
      >
        {uploading ? "Saving..." : "Save & Get Link"}
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
