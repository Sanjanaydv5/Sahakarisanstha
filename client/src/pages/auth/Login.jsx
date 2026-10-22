import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Lock, User, ShieldCheck, ArrowRight, AlertCircle, Eye, EyeOff, ShieldAlert, KeyRound } from 'lucide-react';
import logoImg from '../../assets/logo.jpg';

export const Login = () => {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { t, lang, toggleLanguage } = useLanguage();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    if (!loginId.trim() || !password) {
      setError(lang === 'ne' ? 'कृपया युजरनेम वा ईमेल र पासवर्ड प्रविष्ट गर्नुहोस् ।' : 'Please enter your username/email and password.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await login(loginId.trim(), password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || (lang === 'ne' ? 'लगइन असफल भयो । कृपया पासवर्ड जाँच गर्नुहोस् ।' : 'Login failed. Please verify your credentials.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      {/* Subtle Background Glow Circles */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Language Switcher Top Right */}
      <div className="absolute top-6 right-6">
        <button
          onClick={toggleLanguage}
          type="button"
          className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3.5 py-1.5 rounded-xl backdrop-blur-md border border-white/20 transition flex items-center gap-1.5 shadow-lg"
        >
          <span>{lang === 'ne' ? '🇳🇵 नेपाली (NP)' : '🇬🇧 English (EN)'}</span>
        </button>
      </div>

      <div className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 z-10 space-y-6">
        {/* Cooperative Emblem & Heading */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl overflow-hidden mx-auto shadow-lg shadow-emerald-500/30 bg-white border border-slate-100 p-1">
            <img src={logoImg} alt="जनता सहयोगी कृषि सहकारी" className="w-full h-full object-contain rounded-xl" />
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

        {/* Security / Encryption Status Banner */}
        <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-xl py-2 px-3 flex items-center justify-between text-[11px] text-emerald-900 font-medium">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>२५६-बिट सुरक्षित इन्क्रिप्सन (SSL/TLS Secured)</span>
          </span>
          <span className="text-[10px] font-bold uppercase bg-emerald-200/60 text-emerald-800 px-2 py-0.5 rounded-full">
            Active
          </span>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3.5 rounded-xl flex items-start gap-2.5 animate-shake">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* Secure Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              युजरनेम वा आधिकारिक ईमेल (User ID / Email)
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                placeholder="उदा: sahakari_admin वा admin@janatasahakari.org"
                autoComplete="username"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700">
                पासवर्ड (Password)
              </label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                autoComplete="current-password"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 focus:outline-none p-0.5"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            {loading ? (
              <span>सुरक्षित प्रमाणीकरण हुँदैछ... (Authenticating...)</span>
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span>प्रणालीमा सुरक्षित प्रवेश (Secure Login)</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Security Advisory for Outsiders */}
        <div className="pt-3 border-t border-slate-200 text-center">
          <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-600 mb-1">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
            <span>सुरक्षा सूचना (Security Advisory):</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-normal">
            यो प्रणाली जनता सहयोगी कृषि सहकारी संस्थाका अधिकृत कर्मचारीहरूका लागि मात्र हो । अनधिकृत पहुँच वा पासवर्ड अनुमान गर्ने प्रयास स्वतः सिस्टम लग र फायरवालद्वारा निषेध गरिएको छ ।
          </p>
        </div>
      </div>
    </div>
  );
};
