import Link from "next/link";
import ThemeToggle from "./theme-toggle";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}>

      <header className="flex items-center justify-end px-5 py-5 md:px-10">
        <ThemeToggle />
      </header>

      <main className="flex-1 flex flex-col justify-center px-5 md:px-10 py-10 w-full max-w-lg mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-8" style={{ letterSpacing: "-0.03em", lineHeight: 1.1, color: "var(--fg)" }}>
          Pick a tool.
        </h1>

        <Link href="/url-to-mp3" className="tool-card">
          <div className="flex items-center gap-4">
            <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: "#ff5c0018" }}>
              🎵
            </div>
            <div>
              <div className="font-semibold text-sm mb-0.5">URL to MP3</div>
              <div className="text-xs" style={{ color: "var(--fg-muted)" }}>Paste a YouTube link, get the audio.</div>
            </div>
          </div>
          <svg className="shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--fg-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </Link>
      </main>

    </div>
  );
}
