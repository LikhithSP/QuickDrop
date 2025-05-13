"use client";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { use } from "react";

interface CodePageProps {
  params: {
    code: string;
  };
}

export default function CodePage({ params }: CodePageProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  // Unwrap the code from params using React.use()
  const code = use(params).code;

  useEffect(() => {
    async function resolveCode() {
      setLoading(true);
      
      // Get the code information
      const { data, error } = await supabase
        .from("codes")
        .select("resource_type, resource_id, expiry")
        .eq("code", code)
        .maybeSingle();

      if (error || !data) {
        setError("Invalid code. Please check and try again.");
        setLoading(false);
        return;
      }

      // Check if code is expired
      if (new Date(data.expiry) < new Date()) {
        setError("This code has expired.");
        setLoading(false);
        return;
      }

      // Redirect to the appropriate page
      if (data.resource_type === "text") {
        router.push(`/text/${data.resource_id}`);
      } else if (data.resource_type === "file") {
        router.push(`/file/${data.resource_id}`);
      } else {
        setError("Unknown resource type.");
        setLoading(false);
      }
    }    resolveCode();
  }, [code, router]);

  if (loading) {
    return <div className="text-center py-20 text-foreground">Redirecting... 🎓</div>;
  }

  return (
    <div className="container fade-in">
      <div className="card max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-card-text text-center">Access Shared Item</h1>
        {error && <div className="text-red-500 mb-3 text-center">{error}</div>}
        <button
          className="w-full bg-button-bg hover:bg-button-hover text-button-text rounded-xl py-3 px-6 font-semibold shadow-md transition-all duration-200 mb-4"
          onClick={() => router.push("/")}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
