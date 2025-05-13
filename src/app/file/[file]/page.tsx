"use client";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";

export default function FileReceivePage({ params }: { params: { file: string } }) {
  const [fileUrl, setFileUrl] = useState("");
  const [fileInfo, setFileInfo] = useState<{ name: string; size: number; type: string } | null>(null);
  const [expired, setExpired] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFile() {
      setLoading(true);
      // Try to get public URL from Supabase Storage
      const { data } = supabase.storage.from("drops").getPublicUrl(params.file);
      if (!data?.publicUrl) {
        setExpired(true);
        setLoading(false);
        return;
      }
      setFileUrl(data.publicUrl);
      // Optionally, fetch file metadata if you store it in a table
      setFileInfo({ name: params.file, size: 0, type: "" });
      setLoading(false);
    }
    fetchFile();
  }, [params.file]);

  if (loading) return <div className="text-center py-20 text-foreground">Loading... 🎓</div>;
  if (expired) return <div className="text-center py-20 text-red-500">File not found or expired.</div>;

  return (
    <div className="container fade-in">
      <div className="card max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-card-text text-center">Download File</h1>
        <div className="mb-6 text-center">
          <div className="font-semibold text-card-text">{fileInfo?.name}</div>
          {/* File size/type could be shown if you store metadata */}
        </div>
        <a
          href={fileUrl}
          download
          className="w-full bg-button-bg hover:bg-button-hover text-button-text rounded-xl py-3 px-6 font-semibold shadow-md transition-all duration-200 mb-4 flex justify-center"
        >
          Download
        </a>
        <div className="mt-6 text-xs text-secondary text-center">This file may expire soon. Download it now.</div>
      </div>
    </div>
  );
}
