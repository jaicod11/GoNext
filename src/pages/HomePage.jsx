import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return { text: 'Good morning', emoji: '☀️' };
  if (h < 17) return { text: 'Good afternoon', emoji: '🌤️' };
  if (h < 21) return { text: 'Good evening', emoji: '🌆' };
  return { text: 'Hey night owl', emoji: '🌙' };
}

const MOODS = [
  { emoji: '💼', label: 'Work', desc: 'Cafés & co-working' },
  { emoji: '🌹', label: 'Date Night', desc: 'Romantic restaurants' },
  { emoji: '🍔', label: 'Quick Bite', desc: 'Fast & casual food' },
  { emoji: '💸', label: 'Budget', desc: 'Great value spots' },
  { emoji: '🗺️', label: 'Explore', desc: 'Parks & attractions' },
];

const STATS = [
  { value: '20+', label: 'Places fetched per search' },
  { value: '5', label: 'Mood categories' },
  { value: '3000', label: 'Free API calls/day' },
];

export default function HomePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const greeting = getGreeting();

  return (
    <div className="min-h-screen bg-surface-900 relative overflow-hidden">

      {/* ── ANIMATED BACKGROUND ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Mesh gradient */}
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(109,40,217,0.12) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(59,130,246,0.10) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(168,85,247,0.08) 0%, transparent 50%)' }}
        />
        {/* Floating orbs */}
        <div className="orb-1 absolute top-[5%] right-[10%] w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-[100px]" />
        <div className="orb-2 absolute bottom-[10%] left-[5%] w-[400px] h-[400px] rounded-full bg-indigo-500/10 blur-[80px]" />
        <div className="orb-3 absolute top-[40%] left-[40%] w-[300px] h-[300px] rounded-full bg-purple-800/10 blur-[80px]" />
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: 'linear-gradient(#a78bfa 1px, transparent 1px), linear-gradient(90deg, #a78bfa 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
        {/* Floating particles */}
        {[...Array(12)].map((_, i) => (
          <div key={i}
            className="absolute w-1 h-1 rounded-full bg-brand-400/30"
            style={{
              left: `${10 + (i * 7.5) % 85}%`,
              top: `${15 + (i * 11) % 70}%`,
              animation: `float-slow ${8 + i * 1.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.8}s`,
            }}
          />
        ))}
      </div>

      {/* ── NAVBAR ── */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-2.5">
          {/* ✅ FIXED: Logo image instead of emoji */}
          <div className="w-8 h-8 rounded-lg overflow-hidden shadow-glow-sm">
            <img src="/logo.png" alt="GoNext" className="w-full h-full object-cover" />
          </div>
          <span className="font-display text-xl font-bold text-white">Go<span className="text-brand-400">Next</span></span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-500 hidden sm:block">
            👤 {user?.name}
          </span>
          <button
            onClick={logout}
            className="text-sm text-slate-500 hover:text-red-400 transition-colors font-medium"
          >
            Sign out
          </button>
        </div>
      </nav>

      {/* ── HERO SECTION ── */}
      <main className="relative z-10 flex flex-col items-center text-center px-6 pt-12 pb-8">

        {/* Greeting badge */}
        <div className="glass flex items-center gap-2 rounded-full px-4 py-2 mb-8 anim-fade-up">
          <span className="text-lg">{greeting.emoji}</span>
          <span className="text-sm text-slate-400">{greeting.text}, <span className="text-brand-300 font-semibold">{user?.name?.split(' ')[0]}</span></span>
        </div>

        {/* Main headline */}
        <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6 anim-fade-up delay-100">
          <span className="text-white">So, what are</span><br />
          <span className="shimmer-text">you up to today?</span>
        </h1>

        <p className="text-slate-400 text-lg md:text-xl max-w-xl leading-relaxed mb-10 anim-fade-up delay-200">
          Tell us your mood and we'll find the perfect spot nearby —
          whether it's hustling, exploring, or treating yourself.
        </p>

        {/* CTA buttons */}
        <div className="flex gap-4 mb-16 anim-fade-up delay-300">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-8 py-4 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-2xl text-sm transition-all shadow-glow hover:shadow-glow-lg hover:-translate-y-0.5"
          >
            🚀 Find My Next Spot
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-8 py-4 glass text-slate-300 hover:text-white font-semibold rounded-2xl text-sm transition-all hover:-translate-y-0.5"
          >
            🗺️ Open Map
          </button>
        </div>

        {/* Stats */}
        <div className="flex gap-8 md:gap-16 mb-16 anim-fade-up delay-400">
          {STATS.map((s, i) => (
            <div key={i} className="text-center">
              <div className="font-display text-3xl font-bold text-white mb-1">{s.value}</div>
              <div className="text-xs text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Mood quick-pick */}
        <div className="w-full max-w-3xl anim-fade-up delay-500">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-600 mb-4">
            Pick a mood to jump straight in
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {MOODS.map((mood, i) => (
              <button
                key={i}
                onClick={() => navigate('/dashboard')}
                className="glass group flex flex-col items-center gap-2 py-5 px-3 rounded-2xl hover:border-brand-500/50 hover:bg-brand-600/10 transition-all duration-200 hover:-translate-y-1 hover:shadow-glow-sm"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform">{mood.emoji}</span>
                <span className="text-sm font-semibold text-slate-300 group-hover:text-white">{mood.label}</span>
                <span className="text-[11px] text-slate-600 group-hover:text-slate-400">{mood.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}