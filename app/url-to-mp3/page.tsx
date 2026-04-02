"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import ThemeToggle from "../theme-toggle";

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
        throw new Error(data.error || `Error ${res.status}`);
      }

      const disposition = res.headers.get("content-disposition") || "";
      const nameMatch = disposition.match(/filename="?([^"]+)"?/);
      const fileName = nameMatch ? nameMatch[1] : "audio.mp3";
      setTitle(fileName.replace(/\.mp3$/, "").replace(/_/g, " "));

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

  const isValidUrl = (() => { try { new URL(url); return true; } catch { return false; } })();
  const canConvert = !!url.trim() && isValidUrl && status !== "loading";

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}>

      <header className="flex items-center justify-between px-5 py-5 md:px-10">
        <Link href="/" className="flex items-center gap-2 text-sm font-medium" style={{ color: "var(--fg-muted)", textDecoration: "none" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back
        </Link>
        <ThemeToggle />
      </header>

      <main className="flex-1 flex flex-col justify-center px-5 md:px-10 pb-16 w-full max-w-lg mx-auto">

        <div className="flex items-center gap-3 mb-8">
          <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: "#ff5c0018" }}>
            🎵
          </div>
          <h1 className="text-2xl font-bold m-0" style={{ letterSpacing: "-0.02em" }}>
            URL to MP3
          </h1>
        </div>

        <input
          type="url"
          value={url}
          onChange={(e) => { setUrl(e.target.value); setStatus("idle"); setError(""); }}
          onKeyDown={(e) => e.key === "Enter" && canConvert && handleConvert()}
          placeholder="https://..."
          disabled={status === "loading"}
          className="page-input mb-3"
        />


        <button
          onClick={handleConvert}
          disabled={!canConvert}
          className="w-full rounded-xl py-3.5 text-sm font-semibold"
          style={{
            background: canConvert ? "#ff5c00" : "var(--card-bg)",
            color: canConvert ? "#fff" : "var(--fg-muted)",
            border: "none",
            fontFamily: "inherit",
            cursor: canConvert ? "pointer" : "not-allowed",
            transition: "background 0.15s",
          }}
        >
          {status === "loading" ? <span className="blink">Converting</span> : "Convert & Download"}
        </button>

        {status === "done" && (
          <div className="mt-4 rounded-xl px-4 py-3" style={{ background: "#0d1f0d", border: "1px solid #1a3a1a" }}>
            <p className="text-xs font-medium m-0" style={{ color: "#4ade80" }}>Download started</p>
            {title && <p className="text-xs mt-1 m-0" style={{ color: "var(--fg-muted)" }}>{title}</p>}
          </div>
        )}

        {status === "error" && (
          <div className="mt-4 rounded-xl px-4 py-3" style={{ background: "#1f0d0d", border: "1px solid #3a1a1a" }}>
            <p className="text-xs font-medium m-0" style={{ color: "#f87171" }}>Failed</p>
            <p className="text-xs mt-1 m-0" style={{ color: "var(--fg-muted)" }}>{error}</p>
          </div>
        )}

        <p className="mt-6 text-xs" style={{ color: "var(--fg-muted)" }}>
          YouTube, direct video links, and more · 192kbps MP3
        </p>
      </main>

      <a ref={downloadRef} className="hidden" />
    </div>
  );
}
