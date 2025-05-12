'use client';
import { notFound, useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";

export default function FileReceivePage() {
  const params = useParams();
  const file = params?.file as string;
  const [fileUrl, setFileUrl] = useState("");
  const [fileInfo, setFileInfo] = useState<{ name: string; size: number; type: string } | null>(null);
  const [expired, setExpired] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFile() {
      setLoading(true);
      // Try to get public URL from Supabase Storage
      const { data } = supabase.storage.from("drops").getPublicUrl(file);
      if (!data?.publicUrl) {
        setExpired(true);
        setLoading(false);
        return;
      }
      setFileUrl(data.publicUrl);
      // Optionally, fetch file  if you store it in a table
      setFileInfo({ name: file, size: 0, type: "" });
      setLoading(false);
    }
    if (file) fetchFile();
  }, [file]);

  if (loading) return <div className="text-center py-20">Loading... 🎓</div>;
  if (expired) return <div className="text-center py-20 text-red-500">File not found or expired.</div>;

  return (
    <div className="max-w-lg mx-auto py-10 text-center">
      <h1 className="text-2xl font-bold mb-4">Download File</h1>
      <div className="mb-4">
        <div className="font-semibold">{fileInfo?.name}</div>
        {/* File size  could be shown if you store metadata */}
      </div>
      <a
        href={fileUrl}
        download
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 px-6 font-semibold shadow mb-4 inline-block"
      >
        Download
      </a>
      <div className="mt-6 text-xs text-gray-400">This file may expire soon. Shared in XYZ College.</div>
    </div>
  );
}
