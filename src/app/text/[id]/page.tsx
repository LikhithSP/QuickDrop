"use client";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function TextReceivePage() {
  const params = useParams();
  const textId = params?.id as string;
  const [text, setText] = useState("");
  const [expired, setExpired] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchText() {
      setLoading(true);
      // Try to fetch by nickname or id
      const { data, error } = await supabase
        .from("text_drops")
        .select("text, expiry")
        .or(`id.eq.${textId},nickname.eq.${textId}`)
        .maybeSingle();
      if (!data || error) {
        setExpired(true);
        setLoading(false);
        return;
      }
      // Check expiry
      if (new Date(data.expiry) < new Date()) {
        setExpired(true);
        setLoading(false);
        return;
      }
      setText(data.text);
      setLoading(false);
    }
    if (textId) fetchText();
  }, [textId]);

  if (loading) return <div className="text-center py-20">Loading... 🎓</div>;
  if (expired) return <div className="text-center py-20 text-red-500">Text not found or expired.</div>;

  return (
    <div className="max-w-lg mx-auto py-10 text-center">
      <h1 className="text-2xl font-bold mb-4">Shared Text</h1>
      <textarea
        className="w-full h-40 p-2 rounded border mb-4"
        value={text}
        readOnly
      />
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 px-6 font-semibold shadow mb-4"
        onClick={() => navigator.clipboard.writeText(text)}
      >
        Copy Text
      </button>
      <div className="mt-6 text-xs text-gray-400">This text may expire soon. Shared in XYZ College.</div>
    </div>
  );
}
