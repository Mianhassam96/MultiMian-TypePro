import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const FEATURES = [
  { icon: '⌨️', title: 'Smart Typing Tests',  desc: 'Four difficulty levels with real-time WPM, CPM, accuracy and custom timers.', gradient: 'from-violet-500 to-purple-600' },
  { icon: '📊', title: 'Deep Analytics',       desc: 'Beautiful charts tracking your progress, streaks, and improvement over time.',  gradient: 'from-blue-500 to-cyan-500'     },
  { icon: '🏆', title: 'Leaderboards',         desc: 'Compete globally, filter by level and time mode, and claim the top spot.',      gradient: 'from-amber-500 to-orange-500'  },
  { icon: '⏱️', title: 'Custom Timer',         desc: 'Set any duration from 1 to 600 seconds — your test, your rules.',              gradient: 'from-emerald-500 to-teal-500'  },
  { icon: '🌙', title: 'Dark / Light Mode',    desc: 'Seamless theme switching with a polished UI that looks great either way.',      gradient: 'from-pink-500 to-rose-500'     },
  { icon: '🚀', title: 'Instant Results',      desc: 'Share your score, save to leaderboard, or retry — all in one click.',          gradient: 'from-indigo-500 to-violet-500' },
];

const STATS = [
  { value: '1K+',  label: 'Tests Taken',  color: 'text-violet-400' },
  { value: '500+', label: 'Active Users',  color: 'text-blue-400'   },
  { value: '95%',  label: 'Avg Accuracy', color: 'text-emerald-400' },
  { value: '60',   label: 'Avg WPM',      color: 'text-amber-400'   },
];

const WORDS = ['Faster.', 'Smarter.', 'Accurate.', 'Unstoppable.'];

const TypingWord = () => {
  const [idx, setIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = WORDS[idx];
    let timeout;
    if (!deleting && displayed.length < word.length) {
      timeout = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 80);
    } else if (!deleting && displayed.length === word.length) {
      timeout = setTimeout(() => setDeleting(true), 1400);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 45);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setIdx((i) => (i + 1) % WORDS.length);
    }
    return () => clearTimeout(timeout);
  }, [displayed, deleting, idx]);

  return (
    <span className="text-brand">
      {displayed}
      <span className="animate-[blink_1s_step-end_infinite]" style={{ color: 'var(--brand-from)' }}>|</span>
    </span>
  );
};

const Home = () => (
  <div className="min-h-screen relative overflow-hidden">
    <div className="max-w-6xl mx-auto px-4 py-16 sm:py-24">

      {/* Hero */}
      <div className="text-center mb-20 animate-fade-up">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6 badge animate-fade-in">
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--brand-from)' }} />
          The #1 Typing Speed Platform
        </div>

        <h1 className="text-5xl sm:text-7xl font-black text-primary mb-4 leading-tight tracking-tight">
          Type <TypingWord />
        </h1>
        <p className="text-lg sm:text-xl text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
          MultiMian TypePro helps you master your keyboard with real-time feedback,
          beautiful analytics, and competitive leaderboards.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/test"
            className="btn-primary group inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold"
          >
            Start Typing Now
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <Link
            to="/leaderboard"
            className="btn-ghost inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold"
          >
            <span>🏆</span>
            View Leaderboard
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20 animate-fade-up delay-200">
        {STATS.map((s, i) => (
          <div key={i} className="text-center p-6 rounded-2xl surface card-lift">
            <div className={`text-4xl font-black mb-1 ${s.color}`}>{s.value}</div>
            <div className="text-secondary text-sm font-medium">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Features */}
      <div className="animate-fade-up delay-300">
        <h2 className="text-3xl font-bold text-primary text-center mb-3">Everything you need</h2>
        <p className="text-secondary text-center mb-10">Packed with features to make every keystroke count.</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="group p-6 rounded-2xl surface card-lift cursor-default animate-card"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center text-2xl mb-4 shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                {f.icon}
              </div>
              <h3 className="text-primary font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-secondary text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Banner */}
      <div
        className="mt-20 relative overflow-hidden rounded-3xl p-10 text-center animate-fade-up delay-500"
        style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))', border: '1px solid var(--border)' }}
      >
        <div className="relative z-10">
          <div className="text-5xl mb-4 animate-float">🚀</div>
          <h2 className="text-3xl font-black text-primary mb-3">Ready to become a TypePro?</h2>
          <p className="text-secondary mb-6 max-w-lg mx-auto">Join thousands of users who improved their typing speed by 40% in just 2 weeks.</p>
          <Link
            to="/test"
            className="btn-primary inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold"
          >
            Start Free Test
          </Link>
        </div>
      </div>
    </div>
  </div>
);

export default Home;
