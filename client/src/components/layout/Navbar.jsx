import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { toDevanagari, getCurrentBSDateString } from '../../utils/nepaliConverter';
import {
  Globe,
  User,
  LogOut,
  KeyRound,
  Calendar,
  Phone,
  ShieldAlert,
  ChevronDown,
  Menu
} from 'lucide-react';
import logoImg from '../../assets/logo.jpg';

export const Navbar = ({ onChangePasswordClick, onToggleMobileSidebar }) => {
  const { user, logout } = useAuth();
  const { lang, toggleLanguage, t } = useLanguage();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return <span className="bg-purple-100 text-purple-800 text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full border border-purple-300">Admin</span>;
      case 'manager':
        return <span className="bg-blue-100 text-blue-800 text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full border border-blue-300">Manager</span>;
      default:
        return <span className="bg-emerald-100 text-emerald-800 text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full border border-emerald-300">Staff</span>;
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs no-print">
      <div className="px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          {/* Left: Mobile hamburger + Org Logo & Location Header */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* Hamburger Button for Mobile / Tablet */}
            <button
              onClick={onToggleMobileSidebar}
              className="lg:hidden p-2 -ml-1.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition flex-shrink-0"
              aria-label="Toggle Navigation Menu"
              title="मेनु खोल्नुहोस्"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Logo & Title wrapped in Link to Home page */}
            <Link
              to="/"
              className="flex items-center gap-2.5 sm:gap-3 group hover:opacity-90 transition min-w-0"
              title="गृहपृष्ठमा जानुहोस् (Go to Home Page)"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden shadow-md shadow-emerald-500/20 flex-shrink-0 bg-white border border-slate-100">
                <img src={logoImg} alt="जनता सहयोगी कृषि सहकारी" className="w-full h-full object-contain" />
              </div>
              <div className="min-w-0">
                <h1 className="text-sm sm:text-base lg:text-lg font-bold text-slate-900 tracking-tight leading-tight truncate">
                  {t('orgName')}
                </h1>
                <p className="text-[10px] sm:text-xs text-slate-500 font-medium mt-0.5 flex items-center gap-1.5 truncate">
                  <span className="truncate">{t('orgSubtitle')}</span>
                  <span className="hidden md:inline text-slate-300">•</span>
                  <span className="hidden md:inline font-mono">{t('panNo')}</span>
                </p>
              </div>
            </Link>
          </div>

          {/* Right Action Icons: Nepali Date, Language Toggle, User Profile */}
          <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
            {/* Nepali Date Badge */}
            <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              <span>मिति: <strong>{getCurrentBSDateString()} (B.S.)</strong></span>
            </div>

            {/* Bilingual Toggle Button */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition border border-slate-300 shadow-sm"
              title="Toggle Nepali / English language"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              <span>{lang === 'ne' ? 'नेपाली (NP)' : 'English (EN)'}</span>
            </button>

            {/* User Profile Pill & Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center space-x-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition text-left"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div className="hidden sm:block">
                  <div className="text-xs font-bold text-slate-900 leading-none">{user?.name}</div>
                  <div className="mt-0.5">{getRoleBadge(user?.role)}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Profile Menu */}
              {profileDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setProfileDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs text-slate-500">लगइन प्रयोगकर्ता:</p>
                    <p className="text-sm font-bold text-slate-900 truncate">{user?.name}</p>
                    <p className="text-xs text-emerald-700 font-medium capitalize">Role: {user?.role}</p>
                  </div>

                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      if (onChangePasswordClick) onChangePasswordClick();
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                  >
                    <KeyRound className="w-4 h-4 text-slate-400" />
                    <span>पासवर्ड परिवर्तन गर्नुहोस् (Change Password)</span>
                  </button>

                  <div className="border-t border-slate-100 my-1"></div>

                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      logout();
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 font-semibold"
                  >
                    <LogOut className="w-4 h-4 text-red-500" />
                    <span>{t('logout')}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
