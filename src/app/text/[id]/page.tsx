"use client";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { use } from "react";
// Removed unused import

interface TextReceivePageProps {
  params: {
    id: string;
  };
}

export default function TextReceivePage({ params }: TextReceivePageProps) {
  const textId = use(params).id;
  const [text, setText] = useState("");
  const [expired, setExpired] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchText() {
      setLoading(true);      // Try to fetch by nickname or id - using proper parameterization
      const { data, error } = await supabase
        .from("text_drops")
        .select("text, expiry")
        .or(`id.eq."${textId}",nickname.eq."${textId}"`)
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
    fetchText();
  }, [textId]);

  if (loading) return <div className="text-center py-20 text-foreground">Loading... 🎓</div>;
  if (expired) return <div className="text-center py-20 text-red-500">Text not found or expired.</div>;

  return (
    <div className="container fade-in">
      <div className="card max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-card-text text-center">Shared Text</h1>
        <textarea
          className="w-full h-40 p-3 rounded-lg border border-input-border bg-input-bg text-input-text mb-6"
          value={text}
          readOnly
        />
        <button
          className="w-full bg-button-bg hover:bg-button-hover text-button-text rounded-xl py-3 px-6 font-semibold shadow-md transition-all duration-200 mb-4"
          onClick={() => navigator.clipboard.writeText(text)}
        >
          Copy Text
        </button>
        <div className="mt-6 text-xs text-secondary text-center">This text may expire soon. Save it now.</div>
      </div>
    </div>
  );
}
