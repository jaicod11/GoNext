import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [tab, setTab] = useState('login'); // 'login' | 'signup'
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const update = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    await new Promise(r => setTimeout(r, 600)); // simulate loading

    let result;
    if (tab === 'login') {
      result = login(form.email, form.password);
    } else {
      if (!form.name.trim()) { setError('Please enter your name.'); setLoading(false); return; }
      result = signup(form.name, form.email, form.password);
    }

    if (result.error) { setError(result.error); setLoading(false); return; }
    navigate('/home');
  };

  return (
    <div className="min-h-screen flex overflow-hidden bg-surface-900">

      {/* ── LEFT BRANDING PANEL ── */}
      <div className="hidden lg:flex w-[55%] relative flex-col items-center justify-center overflow-hidden">

        {/* Animated background orbs */}
        <div className="absolute inset-0">
          <div className="orb-1 absolute top-[15%] left-[20%] w-96 h-96 rounded-full bg-violet-600/20 blur-[80px]" />
          <div className="orb-2 absolute bottom-[20%] right-[15%] w-80 h-80 rounded-full bg-indigo-500/20 blur-[80px]" />
          <div className="orb-3 absolute top-[50%] left-[50%] w-64 h-64 rounded-full bg-purple-700/15 blur-[60px]" />
          {/* Grid lines */}
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>

        {/* Content */}
        <div className="relative z-10 px-16 max-w-xl">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-glow">
              <img src="/logo.png" alt="GoNext" className="w-full h-full object-cover" />
            </div>
            <span className="font-display text-2xl font-bold text-white tracking-tight">GoNext</span>
          </div>

          <h1 className="font-display text-5xl font-bold leading-tight mb-6">
            <span className="text-white">Discover places</span><br />
            <span className="shimmer-text">that match your mood.</span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed mb-12">
            From quiet cafés for deep work to romantic spots for date night —
            GoNext finds your perfect place, every time.
          </p>

          {/* Feature pills */}
          <div className="flex flex-col gap-3">
            {[
              { icon: '🎯', text: 'Mood-based recommendations' },
              { icon: '🗺️', text: 'Real-time map integration' },
              { icon: '⚡', text: 'Instant filters & ratings' },
            ].map((f, i) => (
              <div key={i}
                className={`glass flex items-center gap-3 rounded-2xl px-4 py-3 anim-fade-up delay-${(i+1)*100}`}
              >
                <span className="text-xl">{f.icon}</span>
                <span className="text-sm text-slate-300 font-medium">{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT FORM PANEL ── */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        {/* Subtle background for mobile */}
        <div className="absolute inset-0 lg:hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-surface-800 to-surface-900" />
          <div className="orb-1 absolute top-[10%] right-[10%] w-64 h-64 rounded-full bg-violet-600/15 blur-[60px]" />
        </div>

        <div className="relative w-full max-w-md anim-scale-in">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-lg shadow-glow-sm">📍</div>
            <span className="font-display text-xl font-bold text-white">GoNext</span>
          </div>

          {/* Card */}
          <div className="glass-dark rounded-3xl p-8">
            <div className="mb-8">
              <h2 className="font-display text-2xl font-bold text-white mb-1">
                {tab === 'login' ? 'Welcome back' : 'Create account'}
              </h2>
              <p className="text-slate-500 text-sm">
                {tab === 'login'
                  ? 'Sign in to continue your journey'
                  : 'Join thousands discovering great places'}
              </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-surface-600/50 rounded-xl mb-6">
              {['login', 'signup'].map(t => (
                <button key={t}
                  onClick={() => { setTab(t); setError(''); setForm({ name:'', email:'', password:'' }); }}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    tab === t
                      ? 'bg-brand-600 text-white shadow-glow-sm'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {t === 'login' ? 'Sign In' : 'Sign Up'}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {tab === 'signup' && (
                <div className="anim-fade-up">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={form.name}
                    onChange={e => update('name', e.target.value)}
                    required
                    className="w-full bg-surface-600/60 border border-surface-300/20 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 transition-all"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => update('email', e.target.value)}
                  required
                  className="w-full bg-surface-600/60 border border-surface-300/20 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => update('password', e.target.value)}
                  required
                  minLength={6}
                  className="w-full bg-surface-600/60 border border-surface-300/20 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 transition-all"
                />
              </div>

              {error && (
                <div className="bg-red-900/30 border border-red-700/40 rounded-xl px-4 py-3 text-sm text-red-400">
                  ⚠️ {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm transition-all duration-200 shadow-glow-sm hover:shadow-glow disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{tab === 'login' ? 'Signing in...' : 'Creating account...'}</span>
                  </>
                ) : (
                  <span>{tab === 'login' ? '→ Sign In' : '→ Create Account'}</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}