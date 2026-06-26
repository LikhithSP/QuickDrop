"use client";
import { useState } from "react";
import { FaArrowRight, FaFileAlt, FaFont, FaDownload, FaSpinner } from "react-icons/fa";
import { useRouter } from "next/navigation";
import SendFileForm from "./components/SendFileForm";
import SendTextForm from "./components/SendTextForm";
import { supabase } from "@/lib/supabaseClient";

export default function Home() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<'receive' | 'send-file' | 'send-text'>('receive');
  const [isSubmitActive, setIsSubmitActive] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [resolvedDrop, setResolvedDrop] = useState<{
    type: 'text' | 'file';
    content: string;
    name?: string;
  } | null>(null);
  const [textCopied, setTextCopied] = useState(false);
  const [showAutoCopyBanner, setShowAutoCopyBanner] = useState(false);
  const [downloadingFile, setDownloadingFile] = useState(false);
  const router = useRouter();

  const handleFileDownload = async (url: string, fileName: string) => {
    setDownloadingFile(true);
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const localUrl = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = localUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(localUrl);
    } catch (err) {
      console.error("Direct download failed, falling back to redirect", err);
      window.open(url, "_blank");
    } finally {
      setDownloadingFile(false);
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 4) {
      setError("Code must be exactly 4 digits");
      return;
    }
    
    setIsSubmitActive(true);
    setResolving(true);
    setError("");

    try {
      const { data: codeData, error: fetchError } = await supabase
        .from("codes")
        .select("resource_type, resource_id, expiry")
        .eq("code", code)
        .maybeSingle();

      if (fetchError || !codeData) {
        setError("Invalid code. Please check and try again.");
        setResolving(false);
        setIsSubmitActive(false);
        return;
      }

      if (new Date(codeData.expiry) < new Date()) {
        setError("This code has expired.");
        setResolving(false);
        setIsSubmitActive(false);
        return;
      }

      if (codeData.resource_type === "text") {
        const { data: textData, error: textError } = await supabase
          .from("text_drops")
          .select("text")
          .eq("id", codeData.resource_id)
          .maybeSingle();

        if (textError || !textData) {
          setError("Failed to retrieve text content.");
          setResolving(false);
          setIsSubmitActive(false);
          return;
        }

        // Auto-copy to clipboard immediately upon resolution
        try {
          await navigator.clipboard.writeText(textData.text);
          setTextCopied(true);
          setShowAutoCopyBanner(true);
          setTimeout(() => {
            setTextCopied(false);
            setShowAutoCopyBanner(false);
          }, 3000);
        } catch (err) {
          console.warn("Auto-copy blocked by browser.");
        }

        setResolvedDrop({
          type: "text",
          content: textData.text,
        });
      } else if (codeData.resource_type === "file") {
        let filePaths: string[] = [];
        try {
          filePaths = JSON.parse(codeData.resource_id);
          if (!Array.isArray(filePaths)) {
            filePaths = [codeData.resource_id];
          }
        } catch (e) {
          filePaths = [codeData.resource_id];
        }

        const filesData = filePaths.map(path => {
          const { data } = supabase.storage.from("drops").getPublicUrl(path);
          const parts = path.split("-");
          const fileName = parts.slice(2).join("-") || path;
          return {
            url: data?.publicUrl || "",
            name: fileName,
            path: path
          };
        });

        setResolvedDrop({
          type: "file",
          content: JSON.stringify(filesData),
        });
      } else {
        setError("Unknown resource type.");
        setResolving(false);
        setIsSubmitActive(false);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      setResolving(false);
      setIsSubmitActive(false);
    }
  };

  return (
    <div className="fade-in w-full flex flex-col items-center justify-center mt-[-48px]">
      <h1 className="text-4xl sm:text-5xl font-extrabold mb-3 tracking-tight text-center text-foreground">QuickDrop</h1>
      <p className="mb-8 text-center max-w-xl text-lg text-secondary font-medium">
        Instantly share multiple files or text with a code or QR image.
        <br />
        No login. Minimal, fast, and open source.
      </p>

      {/* Premium Tabs */}
      <div className="flex flex-row gap-2 sm:gap-3 mb-8 max-w-md w-full justify-center items-stretch px-2 sm:px-0">
        {/* Receive Button Container */}
        <div className="flex p-1 rounded-full border border-[#915858]/40 dark:border-primary/40 sm:border-2 sm:border-[#915858] dark:sm:border-primary bg-[#915858]/10 dark:bg-primary/15 backdrop-blur-sm justify-center items-center">
          <button
            onClick={() => {
              setActiveTab('receive');
              setResolvedDrop(null);
              setResolving(false);
              setIsSubmitActive(false);
              setCode("");
              setError("");
            }}
            className={`w-full flex items-center justify-center gap-1.5 sm:gap-2 py-2 px-3 sm:px-6 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 border ${
              activeTab === 'receive' 
                ? '!bg-[#915858] dark:!bg-primary !text-white shadow-md !border-[#915858] dark:!border-primary' 
                : 'bg-secondary/20 text-secondary hover:text-foreground hover:bg-secondary/30 border-[#915858]/30 dark:border-primary/30'
            }`}
          >
            <FaDownload size={12} className="sm:w-[14px] sm:h-[14px]" /> Receive
          </button>
        </div>

        {/* Send Tabs Container */}
        <div className="flex bg-[#915858]/10 dark:bg-primary/15 border border-[#915858]/40 dark:border-primary/40 sm:border-2 sm:border-[#915858] dark:sm:border-primary shadow-inner p-1 rounded-full justify-between backdrop-blur-sm gap-1 flex-1">
          <button
            onClick={() => setActiveTab('send-file')}
            className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2 px-2 sm:px-4 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 border ${
              activeTab === 'send-file' 
                ? '!bg-[#915858] dark:!bg-primary !text-white shadow-md !border-[#915858] dark:!border-primary' 
                : 'bg-secondary/20 text-secondary hover:text-foreground hover:bg-secondary/30 border-[#915858]/30 dark:border-primary/30'
            }`}
          >
            <FaFileAlt size={12} className="sm:w-[14px] sm:h-[14px]" /> Send File
          </button>
          <button
            onClick={() => setActiveTab('send-text')}
            className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2 px-2 sm:px-4 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 border ${
              activeTab === 'send-text' 
                ? '!bg-[#915858] dark:!bg-primary !text-white shadow-md !border-[#915858] dark:!border-primary' 
                : 'bg-secondary/20 text-secondary hover:text-foreground hover:bg-secondary/30 border-[#915858]/30 dark:border-primary/30'
            }`}
          >
            <FaFont size={12} className="sm:w-[14px] sm:h-[14px]" /> Send Text
          </button>
        </div>
      </div>

      {/* Tab Content Area */}
      <div className="w-full flex flex-col items-center mb-8">
        {activeTab === 'receive' && (
          <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
            {!resolvedDrop ? (
              <form onSubmit={handleCodeSubmit} className="flex flex-col items-center mb-6">
                <div className="w-full bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-[#915858] dark:border-primary rounded-2xl shadow-lg p-6 flex flex-col items-center gap-2">
                  <p className="text-secondary text-sm mb-1">Have a code? Enter it here:</p>
                  <div className="flex w-full items-center">
                    <input
                      type="text"
                      className="flex-1 p-4 rounded-l-xl border-0 bg-white/80 dark:bg-black/40 text-input-text focus:ring-2 focus:ring-primary outline-none transition text-center text-2xl tracking-widest font-mono font-bold shadow-inner placeholder:font-normal placeholder:tracking-normal"
                      placeholder="CODE"
                      maxLength={4}
                      value={code}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, '');
                        setCode(val);
                        if (val.length === 4) {
                          setError("");
                        }
                      }}
                      style={{ letterSpacing: '0.5em' }}
                      autoComplete="off"
                    />
                    <button 
                      type="submit"
                      disabled={resolving}
                      className={`bg-primary hover:bg-primary/90 text-white rounded-r-xl px-6 py-4 transition-all duration-150 flex items-center justify-center text-2xl font-bold shadow-md ml-2 hover:scale-105 active:scale-95 hover:shadow-lg active:translate-y-[1px] disabled:opacity-80 disabled:cursor-not-allowed ${
                        isSubmitActive ? "!scale-95 !translate-y-[1px] !brightness-90 !shadow-sm" : ""
                      }`}
                      aria-label="Go"
                    >
                      {resolving ? <FaSpinner className="animate-spin text-xl" /> : <FaArrowRight />}
                    </button>
                  </div>
                  {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                </div>
              </form>
            ) : (
              <div className="w-full bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-[#915858] dark:border-primary rounded-2xl shadow-lg p-6 flex flex-col items-center gap-4 animate-in fade-in zoom-in-95 duration-200">
                {resolvedDrop.type === "text" ? (
                  <>
                    <h2 className="text-xl font-bold text-card-text text-center w-full">Received Text</h2>
                    <textarea
                      className="w-full h-40 p-3 rounded-lg border border-input-border bg-white/80 dark:bg-black/40 text-input-text focus:ring-2 focus:ring-primary outline-none transition resize-none text-sm shadow-inner"
                      value={resolvedDrop.content}
                      readOnly
                    />
                    {showAutoCopyBanner && (
                      <div className="text-xs font-bold text-[#915858] dark:text-primary bg-[#915858]/10 dark:bg-primary/10 py-1.5 px-4 rounded-xl border border-[#915858]/20 dark:border-primary/20 animate-in fade-in duration-200 inline-block mt-2">
                        Copied to clipboard!
                      </div>
                    )}
                    <div className="flex gap-3 w-full mt-2">
                      <button
                        className={`flex-1 py-3 px-4 font-semibold rounded-xl shadow-md transition-all duration-200 cursor-pointer text-sm border-0 ${
                          textCopied 
                            ? "bg-[#915858]/20 text-[#915858] border border-[#915858]/30 dark:bg-primary/20 dark:text-primary dark:border-primary/30" 
                            : "!bg-[#915858] dark:!bg-primary !text-white hover:brightness-110"
                        }`}
                        onClick={() => {
                          navigator.clipboard.writeText(resolvedDrop.content);
                          setTextCopied(true);
                          setShowAutoCopyBanner(false);
                          setTimeout(() => setTextCopied(false), 3000);
                        }}
                      >
                        {textCopied ? "Copied!" : "Copy Text"}
                      </button>
                      <button
                        onClick={() => {
                          setResolvedDrop(null);
                          setCode("");
                          setResolving(false);
                          setIsSubmitActive(false);
                        }}
                        className="flex-1 text-secondary hover:text-foreground transition text-sm font-semibold border border-input-border/50 py-3 rounded-xl bg-background/50 hover:bg-background cursor-pointer text-center"
                      >
                        Receive Another
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="text-xl font-bold text-card-text text-center w-full">Received Files</h2>
                    <div className="w-full flex flex-col gap-2 max-h-48 overflow-y-auto mb-2 pr-1">
                      {(() => {
                        let filesList: { url: string; name: string; path: string }[] = [];
                        try {
                          filesList = JSON.parse(resolvedDrop.content);
                        } catch (e) {
                          filesList = [{ url: resolvedDrop.content, name: resolvedDrop.name || "file", path: "" }];
                        }
                        return filesList.map((fileItem, idx) => (
                          <div key={idx} className="flex justify-between items-center bg-white/80 dark:bg-black/40 border border-input-border/30 rounded-xl p-3 shadow-sm w-full gap-4">
                            <div className="font-semibold text-sm text-card-text truncate flex-1 min-w-0 pr-2">{fileItem.name}</div>
                            <button
                              onClick={() => handleFileDownload(fileItem.url, fileItem.name)}
                              disabled={downloadingFile}
                              className="bg-primary hover:bg-primary/80 text-white rounded-full p-2.5 font-semibold shadow transition-all duration-200 cursor-pointer disabled:opacity-80 border-0 flex-shrink-0 flex items-center justify-center"
                              aria-label="Download"
                            >
                              <FaDownload size={14} />
                            </button>
                          </div>
                        ));
                      })()}
                    </div>
                    <div className="flex gap-3 w-full mt-2">
                      <button
                        onClick={async () => {
                          let filesList: { url: string; name: string }[] = [];
                          try {
                            filesList = JSON.parse(resolvedDrop.content);
                          } catch (e) {
                            filesList = [{ url: resolvedDrop.content, name: resolvedDrop.name || "file" }];
                          }
                          for (let i = 0; i < filesList.length; i++) {
                            const fileItem = filesList[i];
                            handleFileDownload(fileItem.url, fileItem.name);
                            if (i < filesList.length - 1) {
                              await new Promise(r => setTimeout(r, 400));
                            }
                          }
                        }}
                        disabled={downloadingFile}
                        className="flex-grow !bg-[#915858] dark:!bg-primary !text-white hover:brightness-110 rounded-xl py-3.5 px-4 font-semibold shadow-md transition-all duration-200 flex justify-center items-center text-center cursor-pointer text-sm disabled:opacity-80 disabled:cursor-not-allowed border-0"
                      >
                        Download All
                      </button>
                      <button
                        onClick={() => {
                          setResolvedDrop(null);
                          setCode("");
                          setResolving(false);
                          setIsSubmitActive(false);
                        }}
                        className="flex-grow text-secondary hover:text-foreground transition text-sm font-semibold border border-input-border/50 py-3.5 rounded-xl bg-background/50 hover:bg-background cursor-pointer text-center"
                      >
                        Receive Another
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}


          </div>
        )}

        {activeTab === 'send-file' && <SendFileForm />}
        
        {activeTab === 'send-text' && <SendTextForm />}
      </div>

    </div>
  );
}
