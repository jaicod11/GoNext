export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 h-14 bg-surface-800 border-b border-surface-400/30 shrink-0 z-50">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center text-sm shadow-glow-sm">
          📍
        </div>
        <span className="text-lg font-bold tracking-tight text-white">
          Go<span className="text-brand-400">Next</span>
        </span>
      </div>
      <span className="text-xs text-slate-500 font-medium tracking-wide uppercase">
        Find your next spot
      </span>
    </nav>
  );
}
