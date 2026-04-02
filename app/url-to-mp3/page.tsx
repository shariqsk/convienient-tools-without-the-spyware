"use client";

import { useState, useRef } from "react";
import Link from "next/link";

type Status = "idle" | "loading" | "done" | "error";

export default function UrlToMp3() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const downloadRef = useRef<HTMLAnchorElement>(null);

  async function handleConvert() {
    if (!url.trim()) return;
    setStatus("loading");
    setError("");
    setTitle("");

    try {
      const res = await fetch("/api/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Failed (${res.status})`);
      }

      const disposition = res.headers.get("content-disposition") || "";
      const nameMatch = disposition.match(/filename="?([^"]+)"?/);
      const fileName = nameMatch ? nameMatch[1] : "audio.mp3";
      setTitle(fileName.replace(/\.mp3$/, ""));

      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);

      const a = downloadRef.current!;
      a.href = objectUrl;
      a.download = fileName;
      a.click();
      setTimeout(() => URL.revokeObjectURL(objectUrl), 10000);

      setStatus("done");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
    }
  }

  const isYoutube = /youtu\.?be/.test(url);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 relative overflow-hidden">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="float-anim absolute top-0 left-1/4 w-96 h-96 rounded-full bg-violet-700/10 blur-3xl" />
        <div className="float-anim absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-blue-700/10 blur-3xl" style={{ animationDelay: '3s' }} />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Nav */}
        <nav className="flex items-center gap-3 px-8 py-6 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2 text-zinc-500 hover:text-zinc-300 transition-colors text-sm no-underline">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Link>
          <span className="text-zinc-700">·</span>
          <span className="text-zinc-400 text-sm font-medium">URL to MP3</span>
        </nav>

        {/* Main */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">
          <div className="w-full max-w-xl">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-3xl mb-5">
                🎵
              </div>
              <h1 className="text-4xl font-black tracking-tighter mb-3">
                <span className="shimmer-text">URL to MP3</span>
              </h1>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Paste a YouTube URL. Get an MP3. That's it.
              </p>
            </div>

            {/* Input card */}
            <div className="bg-zinc-900/80 border border-white/8 rounded-2xl p-6 backdrop-blur-sm">
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">
                Video URL
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleConvert()}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full bg-zinc-950 border border-white/8 rounded-xl px-4 py-3.5 text-zinc-100 placeholder-zinc-700 text-sm focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10 transition-all"
                  disabled={status === "loading"}
                />
                {url && (
                  <button
                    onClick={() => { setUrl(""); setStatus("idle"); setError(""); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {url && !isYoutube && (
                <p className="mt-2 text-xs text-amber-500/80">
                  ⚠️ Only YouTube URLs are supported right now
                </p>
              )}

              <button
                onClick={handleConvert}
                disabled={!url.trim() || !isYoutube || status === "loading"}
                className="mt-4 w-full py-3.5 rounded-xl font-semibold text-sm transition-all
                  bg-gradient-to-r from-violet-600 to-blue-600 text-white
                  hover:from-violet-500 hover:to-blue-500
                  disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:from-violet-600 disabled:hover:to-blue-600
                  active:scale-[0.98]"
              >
                {status === "loading" ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Converting... hang tight
                  </span>
                ) : "Convert to MP3"}
              </button>
            </div>

            {/* Status messages */}
            {status === "done" && (
              <div className="mt-4 flex items-start gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3.5">
                <span className="text-emerald-400 text-lg mt-0.5">✓</span>
                <div>
                  <p className="text-emerald-300 font-semibold text-sm">Download started!</p>
                  {title && <p className="text-emerald-500/70 text-xs mt-0.5 truncate">{title}</p>}
                </div>
              </div>
            )}

            {status === "error" && (
              <div className="mt-4 flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3.5">
                <span className="text-red-400 text-lg mt-0.5">✕</span>
                <div>
                  <p className="text-red-300 font-semibold text-sm">Conversion failed</p>
                  <p className="text-red-500/70 text-xs mt-0.5">{error}</p>
                </div>
              </div>
            )}

            {/* Tips */}
            <div className="mt-6 text-center">
              <p className="text-xs text-zinc-700">
                Works with YouTube videos up to ~2 hours · Audio is extracted, not re-encoded from video
              </p>
            </div>
          </div>
        </main>
      </div>

      {/* Hidden download anchor */}
      <a ref={downloadRef} className="hidden" />
    </div>
  );
}
