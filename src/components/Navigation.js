import { useState, useEffect } from 'react';
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

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const navItems = [
    { path: '/',            label: 'Home'        },
    { path: '/test',        label: 'Test'        },
    { path: '/leaderboard', label: 'Leaderboard' },
    { path: '/analytics',   label: 'Analytics'   },
    { path: '/about',       label: 'About'       },
    { path: '/contact',     label: 'Contact'     },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`sticky top-0 z-50 nav-base transition-all duration-300 ${scrolled ? 'nav-scrolled' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-1">
            <span
              style={{
                fontFamily: "'Space Grotesk', 'Plus Jakarta Sans', sans-serif",
                fontWeight: 700,
                fontSize: '1.2rem',
                letterSpacing: '-0.03em',
                background: 'linear-gradient(100deg, #6366f1 0%, #8b5cf6 25%, #a855f7 45%, #ec4899 65%, #f59e0b 85%, #6366f1 100%)',
                backgroundSize: '300% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'logoShimmer 4s linear infinite',
                display: 'inline-block',
              }}
            >MultiMianTypePro</span>
            <span style={{
              display: 'inline-block',
              width: 6, height: 6,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ec4899, #f59e0b)',
              boxShadow: '0 0 8px #ec4899',
              flexShrink: 0,
              marginBottom: 2,
            }} />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-0.5">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl transition-all duration-200 hover:scale-110"
              style={{ background: 'var(--bg-overlay)', border: '1px solid var(--border)' }}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <svg className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-xl transition-all duration-200"
              style={{ background: 'var(--bg-overlay)', border: '1px solid var(--border)' }}
              aria-label="Toggle menu"
            >
              <div className="w-5 h-3.5 flex flex-col justify-between">
                <span className={`block h-0.5 rounded transition-all duration-300 origin-center ${mobileOpen ? 'rotate-45 translate-y-[6px]' : ''}`} style={{ background: 'var(--text-secondary)' }} />
                <span className={`block h-0.5 rounded transition-all duration-300 ${mobileOpen ? 'opacity-0 scale-x-0' : ''}`} style={{ background: 'var(--text-secondary)' }} />
                <span className={`block h-0.5 rounded transition-all duration-300 origin-center ${mobileOpen ? '-rotate-45 -translate-y-[6px]' : ''}`} style={{ background: 'var(--text-secondary)' }} />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${mobileOpen ? 'max-h-96 pb-4' : 'max-h-0'}`}>
          <div className="flex flex-col gap-1 pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link block px-4 py-2.5 rounded-xl text-sm ${isActive(item.path) ? 'active' : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
