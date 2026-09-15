import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  LayoutDashboard,
  Receipt,
  FileSpreadsheet,
  Users,
  Boxes,
  Zap,
  CreditCard,
  BarChart3,
  FileText,
  UserCog,
  Settings,
  PlusCircle,
  Clock,
  Sparkles,
  X
} from 'lucide-react';
import logoImg from '../../assets/logo.jpg';

export const Sidebar = ({ mobileOpen, onClose }) => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const role = user?.role || 'staff';

  const navItems = [
    {
      label: t('dashboard'),
      path: '/dashboard',
      icon: LayoutDashboard,
      roles: ['admin', 'manager', 'staff']
    },
    {
      label: t('newBill'),
      path: '/billing/new',
      icon: PlusCircle,
      badge: 'POS',
      roles: ['admin', 'manager', 'staff'],
      highlight: true
    },
    {
      label: t('allBills'),
      path: '/billing',
      icon: Receipt,
      roles: ['admin', 'manager', 'staff']
    },
    {
      label: t('distributionRegister'),
      path: '/register',
      icon: FileSpreadsheet,
      roles: ['admin', 'manager', 'staff']
    },
    {
      label: t('customers'),
      path: '/customers',
      icon: Users,
      roles: ['admin', 'manager', 'staff']
    },
    {
      label: t('inventory'),
      path: '/inventory',
      icon: Boxes,
      roles: ['admin', 'manager']
    },
    {
      label: t('services'),
      path: '/services',
      icon: Zap,
      roles: ['admin', 'manager', 'staff']
    },
    {
      label: t('dues'),
      path: '/dues',
      icon: CreditCard,
      roles: ['admin', 'manager', 'staff']
    },
    {
      label: t('reports'),
      path: '/reports',
      icon: BarChart3,
      roles: ['admin', 'manager']
    },
    {
      label: t('letterhead'),
      path: '/letterhead',
      icon: FileText,
      roles: ['admin', 'manager', 'staff']
    },
    {
      label: t('users'),
      path: '/users',
      icon: UserCog,
      roles: ['admin']
    },
    {
      label: t('settings'),
      path: '/settings',
      icon: Settings,
      roles: ['admin']
    }
  ];

  const filteredItems = navItems.filter(item => item.roles.includes(role));

  const renderNavBody = (isMobile = false) => (
    <div className="flex-1 flex flex-col justify-between overflow-y-auto">
      <div className="p-4 space-y-5">
        {/* Quick Fast Sale CTA */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-3.5 text-white shadow-lg shadow-emerald-950/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-100 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              काउन्टर बिलिङ (POS)
            </span>
          </div>
          <p className="text-xs text-emerald-50 mt-1 font-medium">मलखादको तत्काल बिल काट्नुहोस्</p>
          <NavLink
            to="/billing/new"
            onClick={() => isMobile && onClose && onClose()}
            className="mt-2.5 w-full bg-white text-emerald-800 hover:bg-emerald-50 font-bold text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow transition active:scale-95"
          >
            <PlusCircle className="w-4 h-4 text-emerald-600" />
            <span>+ नयाँ बिल बनाउनुहोस्</span>
          </NavLink>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => isMobile && onClose && onClose()}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-700/20'
                      : 'hover:bg-slate-800 hover:text-white text-slate-300'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] bg-emerald-500/30 text-emerald-300 px-1.5 py-0.5 rounded-md font-bold">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer info */}
      <div className="p-4 border-t border-slate-800 text-[11px] text-slate-500">
        <p className="font-semibold text-slate-400">जनता सहयोगी कृषि सहकारी</p>
        <p>दर्ता: ६८८/०६७/०६८ • PAN: ६१४२५५४०१</p>
        <p className="text-[10px] text-slate-600 mt-1">MERN Stack • v1.0.0</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex w-64 bg-slate-900 text-slate-300 flex-shrink-0 min-h-[calc(100vh-4rem)] flex-col justify-between border-r border-slate-800 no-print">
        {renderNavBody(false)}
      </aside>

      {/* Mobile Slide-over Drawer & Backdrop */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex no-print animate-in fade-in duration-200">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer Content */}
          <aside className="relative w-72 max-w-[85vw] bg-slate-900 text-slate-300 flex flex-col justify-between border-r border-slate-800 shadow-2xl z-50 min-h-screen animate-in slide-in-from-left duration-250">
            {/* Mobile Header with Logo & Close Button */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg overflow-hidden bg-white flex-shrink-0">
                  <img src={logoImg} alt="Logo" className="w-full h-full object-contain" />
                </div>
                <span className="font-bold text-sm text-white truncate">जनता सहयोगी</span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                aria-label="Close navigation menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {renderNavBody(true)}
          </aside>
        </div>
      )}
    </>
  );
};
