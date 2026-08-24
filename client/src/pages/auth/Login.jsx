import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Lock, User, ShieldCheck, ArrowRight, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export const Login = () => {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { t, lang, toggleLanguage } = useLanguage();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    if (!loginId || !password) {
      setError('कृपया युजरनेम वा ईमेल र पासवर्ड प्रविष्ट गर्नुहोस् ।');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await login(loginId, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'लगइन असफल भयो । कृपया पासवर्ड जाँच गर्नुहोस् ।');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (roleUser, rolePass) => {
    setLoginId(roleUser);
    setPassword(rolePass);
    // Submit
    setTimeout(async () => {
      try {
        setLoading(true);
        setError('');
        await login(roleUser, rolePass);
        navigate('/dashboard');
      } catch (err) {
        setError(err.response?.data?.message || 'लगइन असफल भयो');
      } finally {
        setLoading(false);
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-slate-900 to-teal-950 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      {/* Subtle Background Glow Circles */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Language Switcher Top Right */}
      <div className="absolute top-6 right-6">
        <button
          onClick={toggleLanguage}
          className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3.5 py-1.5 rounded-xl backdrop-blur-md border border-white/20 transition flex items-center gap-1.5 shadow-lg"
        >
          <span>{lang === 'ne' ? '🇳🇵 नेपाली (NP)' : '🇬🇧 English (EN)'}</span>
        </button>
      </div>

      <div className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 z-10 space-y-6">
        {/* Cooperative Emblem & Heading */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 mx-auto flex items-center justify-center text-white text-3xl shadow-lg shadow-emerald-500/30">
            🌱
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 leading-tight">
            {t('orgName')}
          </h2>
          <p className="text-xs font-semibold text-emerald-700">
            {t('orgSubtitle')}
          </p>
          <div className="text-[11px] text-slate-500 font-mono bg-slate-100 py-1 px-3 rounded-full inline-block border border-slate-200">
            दर्ता: ६८८/०६७/०६८ • PAN: ६१४२५५४०१
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl flex items-center gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              युजरनेम वा ईमेल (Username / Email)
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                placeholder="admin वा admin@janatasahakari.org"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              पासवर्ड (Password)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            {loading ? (
              <span>प्रमाणीकरण हुँदैछ... (Signing In...)</span>
            ) : (
              <>
                <span>प्रणालीमा प्रवेश गर्नुहोस् (Login)</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Role One-Click Switcher for Instant Demo & Testing */}
        <div className="pt-3 border-t border-slate-200">
          <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2.5 text-center flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            द्रुत डेमो लगइन (One-Click Role Switcher):
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin', 'Admin@123')}
              className="px-2 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 text-xs font-bold text-center transition flex flex-col items-center"
            >
              <span className="font-extrabold">👑 Admin</span>
              <span className="text-[10px] text-purple-600 font-normal">प्रशासक</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('manager', 'Manager@123')}
              className="px-2 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-900 text-xs font-bold text-center transition flex flex-col items-center"
            >
              <span className="font-extrabold">💼 Manager</span>
              <span className="text-[10px] text-blue-600 font-normal">व्यवस्थापक</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('staff', 'Staff@123')}
              className="px-2 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 text-xs font-bold text-center transition flex flex-col items-center"
            >
              <span className="font-extrabold">🧾 Staff</span>
              <span className="text-[10px] text-emerald-600 font-normal">लेखापाल/काउन्टर</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
