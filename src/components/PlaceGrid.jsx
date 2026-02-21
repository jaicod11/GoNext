import PlaceCard from './PlaceCard';

export default function PlaceGrid({ places, highlightedId, onCardClick }) {
  if (places.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-10 px-4 text-center rounded-2xl bg-surface-700/50 border border-surface-400/20">
        <div className="text-2xl">😕</div>
        <p className="text-sm text-slate-400 font-medium">No places found</p>
        <p className="text-xs text-slate-600">Try widening distance or adjusting filters</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 px-1">
        {places.length} place{places.length !== 1 ? 's' : ''} found
      </p>
      {places.map((place, i) => (
        <PlaceCard
          key={place.id}
          place={place}
          index={i}
          isHighlighted={place.id === highlightedId}
          onClick={onCardClick}
        />
      ))}
    </div>
  );
}