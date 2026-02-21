import { MOODS } from '../utils/moodConfig';

export default function MoodSelector({ selectedMood, onSelect }) {
  return (
    <div className="rounded-2xl bg-surface-700 border border-surface-400/30 p-4">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-3">
        What's your vibe?
      </p>
      <div className="flex flex-wrap gap-2">
        {MOODS.map((mood) => {
          const isActive = selectedMood?.id === mood.id;
          return (
            <button
              key={mood.id}
              onClick={() => onSelect(isActive ? null : mood)}
              className={`
                px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all duration-200
                ${isActive
                  ? 'text-white border-brand-500 bg-brand-600/30 shadow-glow-sm scale-[1.03]'
                  : 'text-slate-400 border-surface-400/50 bg-surface-600/50 hover:border-brand-500/60 hover:text-white hover:scale-[1.02]'
                }
              `}
            >
              {mood.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}