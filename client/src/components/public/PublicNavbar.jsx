import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Sprout, LogIn } from 'lucide-react';

const NAV_LINKS = [
  { to: '/', label: 'गृहपृष्ठ', labelEn: 'Home' },
  { to: '/about', label: 'हाम्रोबारे', labelEn: 'About' },
  { to: '/services', label: 'सेवाहरू', labelEn: 'Services' },
  { to: '/contact', label: 'सम्पर्क', labelEn: 'Contact' },
];

export const PublicNavbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [location]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-slate-900/95 backdrop-blur-xl shadow-xl border-b border-white/10'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform">
            <Sprout className="w-5 h-5 text-white" />
          </div>
          <div className="leading-none">
            <p className="text-white font-extrabold text-sm tracking-tight">जनता सहयोगी</p>
            <p className="text-emerald-400 text-[10px] font-semibold tracking-widest uppercase">Sahakari Sanstha</p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(link => {
            const active = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  active
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
                <span className="ml-1 text-[10px] text-white/40 font-normal">({link.labelEn})</span>
              </Link>
            );
          })}
        </nav>

        {/* Login CTA */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-500/30 transition-all hover:scale-105 active:scale-95"
          >
            <LogIn className="w-4 h-4" />
            लगइन (Login)
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setOpen(p => !p)}
          className="md:hidden text-white p-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="md:hidden bg-slate-900/98 backdrop-blur-xl border-t border-white/10 px-5 py-4 space-y-1">
          {NAV_LINKS.map(link => {
            const active = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`block px-4 py-3 rounded-xl text-sm font-semibold transition ${
                  active ? 'bg-emerald-500/20 text-emerald-300' : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label} <span className="text-white/40 font-normal text-xs">({link.labelEn})</span>
              </Link>
            );
          })}
          <button
            onClick={() => navigate('/login')}
            className="w-full mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-sm px-5 py-3 rounded-xl shadow-lg transition"
          >
            <LogIn className="w-4 h-4" />
            लगइन (Login)
          </button>
        </div>
      )}
    </header>
  );
};
