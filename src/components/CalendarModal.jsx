import { useState } from 'react';
import { useEvents } from '../context/EventsContext';

const MOODS = [
  { id: 'work', label: '💼 Work', color: '#7c3aed' },
  { id: 'date', label: '🌹 Date Night', color: '#f06292' },
  { id: 'quickbite', label: '🍔 Quick Bite', color: '#ff9800' },
  { id: 'budget', label: '💸 Budget', color: '#4caf50' },
  { id: 'explore', label: '🗺️ Explore', color: '#29b6f6' },
];

export default function CalendarModal({ onClose }) {
  const { addEvent, events, deleteEvent } = useEvents();
  const [form, setForm] = useState({ date: '', mood: 'work', note: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.date) return;
    addEvent(form);
    setForm({ date: '', mood: 'work', note: '' });
  };

  const upcoming = events
    .filter(e => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div className="relative max-w-lg w-full glass-dark rounded-3xl p-6 shadow-glow-lg animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors text-2xl leading-none"
        >×</button>

        <div className="flex items-center gap-3 mb-6">
          <div className="text-3xl">📅</div>
          <h2 className="font-display text-2xl font-bold text-white">My Events</h2>
        </div>

        {/* Add Event Form */}
        <form onSubmit={handleSubmit} className="mb-6 pb-6 border-b border-surface-300/10">
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                Date
              </label>
              <input
                type="date"
                value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                required
                min={new Date().toISOString().split('T')[0]}
                className="w-full bg-surface-600/60 border border-surface-300/20 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                Mood
              </label>
              <select
                value={form.mood}
                onChange={e => setForm(f => ({ ...f, mood: e.target.value }))}
                className="w-full bg-surface-600/60 border border-surface-300/20 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500 transition-all"
              >
                {MOODS.map(m => (
                  <option key={m.id} value={m.id}>{m.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-3">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Note (optional)
            </label>
            <input
              type="text"
              placeholder="e.g., Anniversary dinner at 7pm"
              value={form.note}
              onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
              maxLength={100}
              className="w-full bg-surface-600/60 border border-surface-300/20 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-brand-500 transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm transition-all shadow-glow-sm"
          >
            ➕ Add Event
          </button>
        </form>

        {/* Upcoming Events */}
        <div className="max-h-64 overflow-y-auto scrollbar-custom">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-600 mb-3">
            Upcoming ({upcoming.length})
          </p>

          {upcoming.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-3xl mb-2">📭</div>
              <p className="text-sm text-slate-500">No upcoming events</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {upcoming.map(event => {
                const mood = MOODS.find(m => m.id === event.mood);
                return (
                  <div key={event.id}
                    className="flex items-start gap-3 p-3 rounded-xl bg-surface-600/30 border border-surface-300/10"
                  >
                    <div className="text-xl">{mood?.label.split(' ')[0]}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold text-white">
                          {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                        <span className="text-xs text-slate-600">•</span>
                        <span className="text-xs text-slate-500">{mood?.label.split(' ').slice(1).join(' ')}</span>
                      </div>
                      {event.note && (
                        <p className="text-xs text-slate-400">{event.note}</p>
                      )}
                    </div>
                    <button
                      onClick={() => deleteEvent(event.id)}
                      className="text-slate-600 hover:text-red-400 transition-colors text-sm"
                    >
                      🗑️
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}