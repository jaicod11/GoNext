import { useEffect } from 'react';
import { useEvents } from '../context/EventsContext';

export default function EventNotification() {
  const { todayNotification, dismissNotification } = useEvents();

  useEffect(() => {
    if (todayNotification?.show) {
      // Auto-dismiss after 10 seconds
      const timer = setTimeout(dismissNotification, 10000);
      return () => clearTimeout(timer);
    }
  }, [todayNotification]);

  if (!todayNotification?.show) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative max-w-md w-full glass-dark rounded-3xl p-8 shadow-glow-lg border-2 animate-scale-in"
        style={{ borderColor: todayNotification.color }}
      >
        {/* Close button */}
        <button
          onClick={dismissNotification}
          className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors text-xl"
        >
          ×
        </button>

        {/* Emoji with pulse animation */}
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div 
            className="absolute inset-0 rounded-full blur-xl opacity-50"
            style={{ background: todayNotification.color, animation: 'pulse-ring 2s ease-out infinite' }}
          />
          <div className="relative text-6xl flex items-center justify-center">
            {todayNotification.emoji}
          </div>
        </div>

        {/* Title */}
        <h2 
          className="font-display text-2xl font-bold text-center mb-3"
          style={{ color: todayNotification.color }}
        >
          {todayNotification.title}
        </h2>

        {/* Message */}
        <p className="text-slate-300 text-center leading-relaxed mb-6">
          {todayNotification.message}
        </p>

        {/* Event details */}
        {todayNotification.note && (
          <div className="bg-surface-600/40 rounded-xl px-4 py-3 mb-6">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Your note</p>
            <p className="text-sm text-slate-300">{todayNotification.note}</p>
          </div>
        )}

        {/* Action button */}
        <button
          onClick={dismissNotification}
          className="w-full py-3 rounded-xl font-semibold text-white transition-all duration-200 shadow-glow hover:shadow-glow-lg"
          style={{ background: todayNotification.color }}
        >
          Let's Go! 🚀
        </button>
      </div>
    </div>
  );
}