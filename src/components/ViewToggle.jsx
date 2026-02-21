export default function ViewToggle({ view, onChange }) {
  return (
    <div className="flex gap-1 p-1 bg-surface-600/40 rounded-xl border border-surface-300/20">
      <button
        onClick={() => onChange('list')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
          view === 'list'
            ? 'bg-brand-600 text-white shadow-glow-sm'
            : 'text-slate-500 hover:text-slate-300'
        }`}
      >
        <span>📋</span>
        <span>List View</span>
      </button>
      <button
        onClick={() => onChange('map')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
          view === 'map'
            ? 'bg-brand-600 text-white shadow-glow-sm'
            : 'text-slate-500 hover:text-slate-300'
        }`}
      >
        <span>🗺️</span>
        <span>Map View</span>
      </button>
    </div>
  );
}