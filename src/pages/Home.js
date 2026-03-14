import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const FEATURES = [
  {
    icon: '⌨️',
    title: 'Smart Typing Tests',
    desc: 'Four difficulty levels with real-time WPM, CPM, accuracy and custom timers.',
    gradient: 'from-violet-500 to-purple-600',
    delay: 0.1,
  },
  {
    icon: '📊',
    title: 'Deep Analytics',
    desc: 'Beautiful charts tracking your progress, streaks, and improvement over time.',
    gradient: 'from-blue-500 to-cyan-500',
    delay: 0.2,
  },
  {
    icon: '🏆',
    title: 'Leaderboards',
    desc: 'Compete globally, filter by level and time mode, and claim the top spot.',
    gradient: 'from-amber-500 to-orange-500',
    delay: 0.3,
  },
  {
    icon: '⏱️',
    title: 'Custom Timer',
    desc: 'Set any duration from 1 to 600 seconds — your test, your rules.',
    gradient: 'from-emerald-500 to-teal-500',
    delay: 0.4,
  },
  {
    icon: '🌙',
    title: 'Dark / Light Mode',
    desc: 'Seamless theme switching with a polished UI that looks great either way.',
    gradient: 'from-pink-500 to-rose-500',
    delay: 0.5,
  },
  {
    icon: '🚀',
    title: 'Instant Results',
    desc: 'Share your score, save to leaderboard, or retry — all in one click.',
    gradient: 'from-indigo-500 to-violet-500',
    delay: 0.6,
  },
];

const STATS = [
  { value: '1K+',  label: 'Tests Taken',   color: 'text-violet-400' },
  { value: '500+', label: 'Active Users',   color: 'text-blue-400' },
  { value: '95%',  label: 'Avg Accuracy',   color: 'text-emerald-400' },
  { value: '60',   label: 'Avg WPM',        color: 'text-amber-400' },
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
    <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
      {displayed}
      <span className="animate-[blink_1s_step-end_infinite] text-violet-400">|</span>
    </span>
  );
};

const Home = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/3 -right-32 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl animate-float delay-300" />
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-pink-600/15 rounded-full blur-3xl animate-float delay-500" />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16 sm:py-24">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-medium mb-6 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
            The #1 Typing Speed Platform
          </div>

          <h1 className="text-5xl sm:text-7xl font-black text-white mb-4 leading-tight tracking-tight">
            Type{' '}
            <TypingWord />
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            MultiMian TypePro helps you master your keyboard with real-time feedback,
            beautiful analytics, and competitive leaderboards.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/test"
              className="group relative inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-bold rounded-2xl shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/50 transform hover:scale-105 transition-all duration-200"
            >
              <span className="text-xl">⚡</span>
              Start Typing Now
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              to="/leaderboard"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-2xl border border-white/10 hover:border-white/20 backdrop-blur transition-all duration-200"
            >
              <span className="text-xl">🏆</span>
              View Leaderboard
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20"
        >
          {STATS.map((s, i) => (
            <div key={i} className="text-center p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur card-lift">
              <div className={`text-4xl font-black mb-1 ${s.color}`}>{s.value}</div>
              <div className="text-gray-400 text-sm font-medium">{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-white text-center mb-3">Everything you need</h2>
          <p className="text-gray-400 text-center mb-10">Packed with features to make every keystroke count.</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: f.delay }}
                className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 backdrop-blur card-lift cursor-default"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center text-2xl mb-4 shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                  {f.icon}
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="mt-20 relative overflow-hidden rounded-3xl p-10 text-center"
          style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(59,130,246,0.3))', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <div className="absolute inset-0 bg-animated opacity-10 rounded-3xl" />
          <div className="relative z-10">
            <div className="text-5xl mb-4 animate-float">🚀</div>
            <h2 className="text-3xl font-black text-white mb-3">Ready to become a TypePro?</h2>
            <p className="text-gray-300 mb-6 max-w-lg mx-auto">Join thousands of users who improved their typing speed by 40% in just 2 weeks.</p>
            <Link
              to="/test"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-bold rounded-2xl shadow-2xl shadow-violet-500/30 transform hover:scale-105 transition-all duration-200"
            >
              ⚡ Start Free Test
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
