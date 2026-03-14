import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home           from './pages/Home';
import TestPage       from './pages/TestPage';
import LeaderboardPage from './pages/LeaderboardPage';
import AnalyticsPage  from './pages/AnalyticsPage';
import Navigation     from './components/Navigation';
import ParticleBackground from './components/ParticleBackground';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';

const AboutPage = () => (
  <div className="min-h-screen py-16 px-4">
    <div className="max-w-4xl mx-auto animate-fade-up">
      <div className="text-center mb-14">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 mb-6 shadow-2xl shadow-violet-500/30 animate-float">
          <span className="text-3xl">⚡</span>
        </div>
        <h1 className="text-5xl font-black text-white mb-4">About MultiMian TypePro</h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          A modern typing platform built to help you type faster, smarter, and with more confidence.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-5 mb-10">
        {[
          { icon: '🚀', title: 'Real-time Feedback',  desc: 'Instant WPM, CPM, accuracy and error tracking as you type.',          grad: 'from-violet-500 to-purple-600' },
          { icon: '📊', title: 'Analytics Dashboard', desc: 'Beautiful charts to visualise your progress and improvement.',          grad: 'from-blue-500 to-cyan-500'     },
          { icon: '🏆', title: 'Leaderboards',        desc: 'Compete with others, filter by level and time, claim the top spot.',   grad: 'from-amber-500 to-orange-500'  },
        ].map((f, i) => (
          <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur card-lift">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.grad} flex items-center justify-center text-2xl mb-4 shadow-lg`}>{f.icon}</div>
            <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur text-center">
        <h2 className="text-2xl font-black text-white mb-4">Our Mission</h2>
        <p className="text-gray-400 leading-relaxed max-w-2xl mx-auto">
          MultiMian TypePro is built with the vision of making typing education accessible, engaging, and effective for everyone.
          Whether you're a student, professional, or just looking to improve your digital literacy, our platform provides
          the tools and insights you need to become a confident and efficient typist.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {['React', 'Tailwind CSS', 'Framer Motion', 'Chart.js', 'Open Source'].map((t) => (
            <span key={t} className="px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-medium">{t}</span>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const ContactPage = () => (
  <div className="min-h-screen py-16 px-4">
    <div className="max-w-3xl mx-auto animate-fade-up">
      <div className="text-center mb-14">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-600 to-violet-600 mb-6 shadow-2xl shadow-pink-500/30 animate-float">
          <span className="text-3xl">📬</span>
        </div>
        <h1 className="text-5xl font-black text-white mb-4">Get In Touch</h1>
        <p className="text-gray-400 text-lg">Questions, feedback, or collaboration ideas — we'd love to hear from you.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-5 mb-10">
        {[
          {
            icon: '✉️', title: 'Email Us', grad: 'from-blue-500 to-cyan-500',
            desc: 'Drop us a line for support or partnership opportunities.',
            link: 'mailto:mianhassam96@gmail.com', linkLabel: 'mianhassam96@gmail.com',
          },
          {
            icon: '🐙', title: 'GitHub', grad: 'from-gray-600 to-gray-800',
            desc: 'Check out the source code, contribute, or report issues.',
            link: 'https://github.com/Mianhassam96', linkLabel: '@Mianhassam96',
          },
        ].map((c, i) => (
          <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur card-lift">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.grad} flex items-center justify-center text-2xl mb-4 shadow-lg`}>{c.icon}</div>
            <h3 className="text-white font-bold text-lg mb-2">{c.title}</h3>
            <p className="text-gray-400 text-sm mb-4">{c.desc}</p>
            <a href={c.link} target="_blank" rel="noopener noreferrer"
              className="text-violet-400 hover:text-violet-300 font-medium text-sm transition-colors flex items-center gap-1">
              {c.linkLabel}
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        ))}
      </div>

      <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur text-center">
        <h2 className="text-2xl font-black text-white mb-6">Meet the Creator</h2>
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center text-3xl mx-auto mb-4 shadow-2xl shadow-violet-500/30">
          👨‍💻
        </div>
        <h3 className="text-white font-bold text-xl mb-1">Mian Hassam</h3>
        <p className="text-gray-400 text-sm mb-5">Full-Stack Developer & AI Enthusiast</p>
        <div className="flex justify-center gap-3">
          {[
            { href: 'https://github.com/Mianhassam96',      label: 'GitHub',   icon: '🐙' },
            { href: 'https://linkedin.com/in/mianhassam',   label: 'LinkedIn', icon: '💼' },
          ].map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-gray-300 hover:text-white text-sm font-medium transition-all duration-200">
              {s.icon} {s.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  </div>
);

function AppContent() {
  const { theme } = useTheme();

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <ParticleBackground theme={theme} />
        <Navigation />

        <main className="flex-1 relative z-10">
          <Routes>
            <Route path="/"            element={<Home />} />
            <Route path="/test"        element={<TestPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/analytics"   element={<AnalyticsPage />} />
            <Route path="/about"       element={<AboutPage />} />
            <Route path="/contact"     element={<ContactPage />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="relative z-10 mt-8 border-t border-white/5 bg-black/20 backdrop-blur">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center text-sm">⚡</div>
                <span className="text-white font-bold">MultiMian TypePro</span>
              </Link>

              <div className="flex items-center gap-4">
                {[
                  { href: 'https://github.com/Mianhassam96', label: 'GitHub', svg: <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /> },
                  { href: 'https://linkedin.com/in/mianhassam', label: 'LinkedIn', svg: <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /> },
                ].map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-200" aria-label={s.label}>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">{s.svg}</svg>
                  </a>
                ))}
                <a href="mailto:mianhassam96@gmail.com"
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-200" aria-label="Email">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </a>
              </div>

              <p className="text-gray-600 text-sm">© 2025 MultiMian Dev</p>
            </div>
          </div>
        </footer>

        <ToastContainer position="top-right" autoClose={3000} theme={theme === 'dark' ? 'dark' : 'light'} />
      </div>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
