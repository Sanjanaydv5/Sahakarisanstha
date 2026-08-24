import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { Layout } from './components/layout/Layout';

// Public Landing Pages
import { HomePage } from './pages/public/HomePage';
import { AboutPage } from './pages/public/AboutPage';
import { ServicesPage } from './pages/public/ServicesPage';
import { ContactPage } from './pages/public/ContactPage';

// Auth
import { Login } from './pages/auth/Login';

// Protected App Pages
import { DashboardRouter } from './pages/dashboard/DashboardRouter';
import { NewBillPage } from './pages/billing/NewBillPage';
import { BillingPage } from './pages/billing/BillingPage';
import { BillDetailPage } from './pages/billing/BillDetailPage';
import { SalesRegisterPage } from './pages/register/SalesRegisterPage';
import { CustomersPage } from './pages/customers/CustomersPage';
import { InventoryPage } from './pages/inventory/InventoryPage';
import { ServicesPage as AppServicesPage } from './pages/services/ServicesPage';
import { DuesPage } from './pages/dues/DuesPage';
import { ReportsPage } from './pages/reports/ReportsPage';
import { LetterheadPage } from './pages/letterhead/LetterheadPage';
import { UserManagementPage } from './pages/users/UserManagementPage';
import { SettingsPage } from './pages/settings/SettingsPage';

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <Routes>
            {/* ── Public Landing Pages (no auth required) ── */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services-info" element={<ServicesPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* Auth */}
            <Route path="/login" element={<Login />} />

            {/* ── Protected Routes inside App Layout ── */}
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<DashboardRouter />} />
                <Route path="/billing/new" element={<NewBillPage />} />
                <Route path="/billing" element={<BillingPage />} />
                <Route path="/billing/:id" element={<BillDetailPage />} />
                <Route path="/register" element={<SalesRegisterPage />} />
                <Route path="/customers" element={<CustomersPage />} />
                <Route path="/services" element={<AppServicesPage />} />
                <Route path="/dues" element={<DuesPage />} />
                <Route path="/letterhead" element={<LetterheadPage />} />

                {/* Manager & Admin Only */}
                <Route element={<ProtectedRoute allowedRoles={['admin', 'manager']} />}>
                  <Route path="/inventory" element={<InventoryPage />} />
                  <Route path="/reports" element={<ReportsPage />} />
                </Route>

                {/* Admin Only */}
                <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                  <Route path="/users" element={<UserManagementPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Route>
              </Route>
            </Route>

            {/* Fallback — unknown routes go to dashboard (will redirect to login if not authed) */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;
