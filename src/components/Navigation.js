import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const Navigation = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const navItems = [
    { path: '/',            label: 'Home',        icon: '🏠' },
    { path: '/test',        label: 'Test',         icon: '⌨️' },
    { path: '/leaderboard', label: 'Leaderboard',  icon: '🏆' },
    { path: '/analytics',   label: 'Analytics',    icon: '📊' },
    { path: '/about',       label: 'About',        icon: 'ℹ️' },
    { path: '/contact',     label: 'Contact',      icon: '📞' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-lg shadow-violet-500/10 border-b border-white/20 dark:border-white/5'
        : 'bg-white/60 dark:bg-gray-900/60 backdrop-blur-md border-b border-white/10'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center shadow-lg group-hover:shadow-violet-500/50 transition-shadow duration-300">
              <span className="text-lg">⚡</span>
            </div>
            <span className="font-extrabold text-xl bg-gradient-to-r from-violet-600 to-blue-500 bg-clip-text text-transparent tracking-tight">
              TypePro
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(item.path)
                    ? 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/30'
                    : 'text-gray-600 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50/50 dark:hover:bg-violet-900/20'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
                {isActive(item.path) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-gradient-to-r from-violet-600 to-blue-500 rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Right controls */}
          <div className="flex items-center space-x-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-violet-100 dark:hover:bg-violet-900/40 transition-all duration-200 group"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5 text-gray-700 group-hover:text-violet-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-yellow-400 group-hover:text-yellow-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-violet-100 dark:hover:bg-violet-900/40 transition-all duration-200"
              aria-label="Toggle menu"
            >
              <div className="w-5 h-4 flex flex-col justify-between">
                <span className={`block h-0.5 bg-gray-700 dark:bg-gray-300 rounded transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                <span className={`block h-0.5 bg-gray-700 dark:bg-gray-300 rounded transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
                <span className={`block h-0.5 bg-gray-700 dark:bg-gray-300 rounded transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${mobileOpen ? 'max-h-96 pb-4' : 'max-h-0'}`}>
          <div className="flex flex-col space-y-1 pt-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive(item.path)
                    ? 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/30'
                    : 'text-gray-600 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50/50 dark:hover:bg-violet-900/20'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
