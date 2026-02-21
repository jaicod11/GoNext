export default function FilterBar({ filters, onChange }) {
  const reset = () => onChange({ maxDistance: 3000, minRating: 0, openNow: false, sortBy: 'distance' });

  return (
    <div className="rounded-2xl bg-surface-700 border border-surface-400/30 p-4 flex flex-col gap-4 animate-slide-up">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
          Filters
        </p>
        <button
          onClick={reset}
          className="text-[11px] text-slate-500 hover:text-brand-400 transition-colors font-medium"
        >
          ↺ Reset
        </button>
      </div>

      {/* Distance - UPDATED MAX TO 20000 (20km) */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <label className="text-xs text-slate-400">📏 Max Distance</label>
          <span className="text-xs font-semibold text-brand-400">
            {filters.maxDistance >= 1000 ? `${filters.maxDistance / 1000}km` : `${filters.maxDistance}m`}
          </span>
        </div>
        <input
          type="range" min="500" max="20000" step="500"
          value={filters.maxDistance}
          onChange={(e) => onChange({ ...filters, maxDistance: Number(e.target.value) })}
          className="w-full h-1 bg-surface-400 rounded-full appearance-none cursor-pointer accent-brand-500"
        />
      </div>

      {/* Rating */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <label className="text-xs text-slate-400">⭐ Min Rating</label>
          <span className="text-xs font-semibold text-brand-400">
            {filters.minRating > 0 ? `${filters.minRating}+` : 'Any'}
          </span>
        </div>
        <input
          type="range" min="0" max="5" step="0.5"
          value={filters.minRating}
          onChange={(e) => onChange({ ...filters, minRating: Number(e.target.value) })}
          className="w-full h-1 bg-surface-400 rounded-full appearance-none cursor-pointer accent-brand-500"
        />
      </div>

      {/* Open Now */}
      <div className="flex items-center justify-between">
        <label className="text-xs text-slate-400">🕐 Open Now Only</label>
        <button
          onClick={() => onChange({ ...filters, openNow: !filters.openNow })}
          className={`relative w-10 h-5 rounded-full transition-colors duration-300 ${
            filters.openNow ? 'bg-brand-600' : 'bg-surface-400'
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${
              filters.openNow ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Sort By */}
      <div className="flex flex-col gap-2">
        <label className="text-xs text-slate-400">↕ Sort By</label>
        <select
          value={filters.sortBy}
          onChange={(e) => onChange({ ...filters, sortBy: e.target.value })}
          className="w-full bg-surface-600 border border-surface-400/50 rounded-xl text-sm text-slate-300 px-3 py-2 cursor-pointer focus:outline-none focus:border-brand-500 transition-colors"
        >
          <option value="distance">📏 Nearest First</option>
          <option value="rating">⭐ Highest Rated</option>
        </select>
      </div>
    </div>
  );
}