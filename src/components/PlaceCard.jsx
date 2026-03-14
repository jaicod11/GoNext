import { formatDistance } from '../utils/distanceCalc';
import { useFavorites } from '../context/FavoritesContext';

function StarRating({ rating }) {
  if (!rating) return null;
  const stars = Math.round(rating);
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map(i => (
        <span key={i} className={`text-sm ${i <= stars ? 'text-amber-400' : 'text-slate-700'}`}>★</span>
      ))}
      <span className="text-xs text-slate-400 ml-1 font-semibold">{rating}</span>
    </div>
  );
}

function PriceIndicator({ distance }) {
  const price = distance < 1000 ? 3 : distance < 3000 ? 2 : 1;
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3].map(i => (
        <span key={i} className={`text-xs font-bold ${i <= price ? 'text-emerald-400' : 'text-slate-700'}`}>
          $
        </span>
      ))}
    </div>
  );
}

export default function PlaceCard({ place, index, isHighlighted, onClick, mood }) {
  const { isFavorite, addFavorite, removeFavorite, isVisited, markVisited, unmarkVisited } = useFavorites();
  const isFav = isFavorite(place.id);
  const hasVisited = isVisited(place.id);

  const toggleFav = (e) => {
    e.stopPropagation();
    if (isFav) {
      removeFavorite(place.id);
    } else {
      addFavorite(place, mood);
    }
  };

  // ✅ NEW: Toggle visited
  const toggleVisited = (e) => {
    e.stopPropagation();
    if (hasVisited) {
      unmarkVisited(place.id);
    } else {
      markVisited(place, mood);
    }
  };

  const getGradient = (name) => {
    const colors = [
      'from-violet-500 to-purple-600',
      'from-blue-500 to-cyan-600',
      'from-pink-500 to-rose-600',
      'from-orange-500 to-amber-600',
      'from-teal-500 to-emerald-600',
    ];
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  return (
    <div
      onClick={() => onClick(place)}
      className={`
        group relative flex flex-col overflow-hidden rounded-2xl border cursor-pointer transition-all duration-300 
        hover:-translate-y-1 hover:shadow-card anim-fade-up
        ${isHighlighted
          ? 'bg-brand-600/15 border-brand-500/60 shadow-glow-sm scale-[1.02]'
          : 'bg-surface-700 border-surface-400/20 hover:border-brand-500/40'
        }
      `}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {/* Image */}
      <div className={`relative h-32 bg-gradient-to-br ${getGradient(place.name)} overflow-hidden`}>
        <div className="absolute inset-0 bg-black/20" />
        
        {/* ✅ NEW: Visited checkmark overlay */}
        {hasVisited && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
            <div className="text-4xl">✓</div>
            <div className="absolute bottom-2 left-2 px-2 py-1 rounded-md bg-brand-600/90 backdrop-blur-sm">
              <p className="text-[10px] text-white font-semibold uppercase tracking-wide">Visited</p>
            </div>
          </div>
        )}

        <div className="absolute top-2 left-2 w-6 h-6 rounded-lg bg-black/60 backdrop-blur-sm flex items-center justify-center text-xs font-bold text-white">
          {index + 1}
        </div>

        {/* Action buttons */}
        <div className="absolute top-2 right-2 flex gap-1">
          <button
            onClick={toggleFav}
            className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-lg hover:scale-110 transition-transform"
            title={isFav ? "Remove from favorites" : "Add to favorites"}
          >
            {isFav ? '❤️' : '🤍'}
          </button>
          {/* ✅ NEW: Mark as visited button */}
          <button
            onClick={toggleVisited}
            className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-base hover:scale-110 transition-transform"
            title={hasVisited ? "Mark as not visited" : "Mark as visited"}
          >
            {hasVisited ? '✅' : '☑️'}
          </button>
        </div>

        <div className="absolute bottom-2 left-2 px-2 py-1 rounded-md bg-black/60 backdrop-blur-sm">
          <p className="text-[10px] text-white/90 uppercase tracking-wide font-semibold">
            {place.category.split(' › ')[0]}
          </p>
        </div>
      </div>

      {/* Card body */}
      <div className="p-3.5">
        <h3 className="font-semibold text-sm text-white truncate mb-1 group-hover:text-brand-100 transition-colors">
          {place.name}
        </h3>
        
        <p className="text-[11px] text-slate-500 truncate mb-2.5">
          📍 {place.address}
        </p>

        <div className="flex items-center justify-between mb-2.5">
          <StarRating rating={place.rating} />
          <PriceIndicator distance={place.distance} />
        </div>

        <div className="flex flex-wrap gap-1.5">
          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-surface-500/50 border border-surface-300/20 text-slate-400 font-medium">
            📏 {formatDistance(place.distance)}
          </span>
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
      </div>
    </div>
  );
}