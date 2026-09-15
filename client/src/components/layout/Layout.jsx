import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { ChangePasswordModal } from '../../pages/auth/ChangePasswordModal';
import { KeyRound } from 'lucide-react';

export const Layout = () => {
  const { user } = useAuth();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();

  // Auto-close mobile sidebar whenever route changes
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <Navbar
        onChangePasswordClick={() => setShowPasswordModal(true)}
        onToggleMobileSidebar={() => setMobileSidebarOpen(prev => !prev)}
      />

      {/* Mandatory / First-time login banner */}
      {user?.mustChangePassword && (
        <div className="bg-amber-500 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between no-print shadow-inner">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4" />
            <span>
              सुरक्षा सूचना: तपाईको खाताको पूर्वनिर्धारित पासवर्ड परिवर्तन गर्न सिफारिस गरिन्छ । (Please change your default password).
            </span>
          </div>
          <button
            onClick={() => setShowPasswordModal(true)}
            className="bg-amber-700 hover:bg-amber-800 text-white px-3 py-1 rounded text-xs transition underline"
          >
            अहिले बदल्नुहोस् (Change Now)
          </button>
        </div>
      )}

      <div className="flex-1 flex">
        <Sidebar
          mobileOpen={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>

      {showPasswordModal && (
        <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
      )}
    </div>
  );
};
