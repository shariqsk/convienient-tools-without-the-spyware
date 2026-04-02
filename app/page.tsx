import Link from "next/link";

const tools = [
  {
    href: "/url-to-mp3",
    icon: "🎵",
    title: "URL to MP3",
    description: "Paste any YouTube URL and get a clean MP3. No accounts, no limits, no nonsense.",
    badge: "Audio",
    badgeColor: "bg-violet-500/20 text-violet-300 border border-violet-500/30",
    gradient: "from-violet-600/20 to-blue-600/20",
    iconBg: "bg-violet-500/10",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 overflow-hidden relative">
      {/* Background orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="float-anim absolute -top-32 -left-32 w-96 h-96 rounded-full bg-violet-700/10 blur-3xl" />
        <div className="float-anim absolute top-1/2 -right-40 w-[500px] h-[500px] rounded-full bg-blue-700/8 blur-3xl" style={{ animationDelay: '2s' }} />
        <div className="float-anim absolute -bottom-20 left-1/3 w-80 h-80 rounded-full bg-emerald-700/8 blur-3xl" style={{ animationDelay: '4s' }} />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Nav */}
        <nav className="flex items-center justify-between px-8 py-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-sm font-bold">
              CT
            </div>
            <span className="font-semibold text-zinc-200 text-sm tracking-tight">Convenient Tools</span>
          </div>
          <div className="text-xs text-zinc-600 border border-zinc-800 rounded-full px-3 py-1">
            No tracking • No spyware
          </div>
        </nav>

        {/* Hero */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center">
          <div className="mb-6">
            <span className="inline-flex items-center gap-2 text-xs font-medium bg-violet-500/10 text-violet-400 border border-violet-500/20 rounded-full px-4 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse inline-block" />
              Open source · Privacy first
            </span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-black tracking-tighter mb-4 leading-none">
            <span className="shimmer-text">Convenient</span>
            <br />
            <span className="text-zinc-100">Tools</span>
          </h1>

          <p className="max-w-md text-zinc-400 text-lg mt-6 mb-16 leading-relaxed">
            Tools that just <em className="text-zinc-200 not-italic font-medium">work</em>.{" "}
            No accounts. No ads. No tracking your every move.
          </p>

          {/* Tool cards */}
          <div className="w-full max-w-4xl">
            <p className="text-xs uppercase tracking-widest text-zinc-600 mb-8 font-semibold">Available Tools</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-center">
              {tools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className={`card-glow group relative bg-zinc-900/80 border border-white/8 rounded-2xl p-6 text-left backdrop-blur-sm bg-gradient-to-br ${tool.gradient} cursor-pointer no-underline`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl ${tool.iconBg} flex items-center justify-center text-2xl`}>
                      {tool.icon}
                    </div>
                    <span className={`text-xs font-medium rounded-full px-2.5 py-1 ${tool.badgeColor}`}>
                      {tool.badge}
                    </span>
                  </div>
                  <h2 className="font-bold text-zinc-100 text-lg mb-2 group-hover:text-white transition-colors">
                    {tool.title}
                  </h2>
                  <p className="text-sm text-zinc-500 leading-relaxed group-hover:text-zinc-400 transition-colors">
                    {tool.description}
                  </p>
                  <div className="mt-5 flex items-center gap-1.5 text-xs font-medium text-violet-400 group-hover:text-violet-300 transition-colors">
                    Open tool
                    <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}

              {/* Coming soon placeholder */}
              <div className="relative bg-zinc-900/40 border border-white/4 rounded-2xl p-6 text-left opacity-50">
                <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-2xl mb-4">
                  ➕
                </div>
                <h2 className="font-bold text-zinc-500 text-lg mb-2">More coming...</h2>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  Got an idea? Tools being cooked up. No ETA. No promises.
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="text-center py-6 text-xs text-zinc-700 border-t border-white/5">
          Built for humans · Zero corporate BS
        </footer>
      </div>
    </div>
  );
}
