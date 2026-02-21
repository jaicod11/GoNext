import { formatDistance } from '../utils/distanceCalc';

export default function PlaceCard({ place, index, isHighlighted, onClick }) {
  return (
    <div
      onClick={() => onClick(place)}
      className={`
        group flex gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 animate-slide-up
        ${isHighlighted
          ? 'bg-brand-600/10 border-brand-500/60 shadow-glow-sm'
          : 'bg-surface-700 border-surface-400/30 hover:border-brand-500/40 hover:bg-surface-600/80 hover:-translate-y-px hover:shadow-card'
        }
      `}
    >
      {/* Number badge */}
      <div className="shrink-0 w-6 h-6 rounded-lg bg-surface-500 border border-surface-300/30 flex items-center justify-center text-[10px] font-bold text-brand-400 mt-0.5">
        {index + 1}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm text-white truncate mb-0.5 group-hover:text-brand-100 transition-colors">
          {place.name}
        </h3>
        <p className="text-[11px] text-slate-500 capitalize mb-1.5 truncate">
          {place.category}
        </p>
        <p className="text-[11px] text-slate-500 mb-2.5 truncate">
          📍 {place.address}
        </p>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-surface-500 border border-surface-300/20 text-slate-400 font-medium">
            📏 {formatDistance(place.distance)}
          </span>
          {place.rating && (
            <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-amber-900/30 border border-amber-700/30 text-amber-400 font-medium">
              ⭐ {place.rating}
            </span>
          )}
          {place.isOpen !== null && (
            <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium border ${
              place.isOpen
                ? 'bg-emerald-900/30 border-emerald-700/30 text-emerald-400'
                : 'bg-red-900/30 border-red-700/30 text-red-400'
            }`}>
              {place.isOpen ? '● Open' : '● Closed'}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {place.website && (
            <a
              href={place.website}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-[11px] text-brand-400 hover:text-brand-300 font-medium transition-colors"
            >
              🌐 Website
            </a>
          )}
          
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lon}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-[11px] text-sky-400 hover:text-sky-300 font-medium transition-colors"
          >
            🗺️ Directions
          </a>
        </div>
      </div>
    </div>
  );
}