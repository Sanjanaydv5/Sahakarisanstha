import React, { useState, useEffect } from 'react';
import { usePWA } from '../../context/PWAContext';
import {
  Download,
  WifiOff,
  X,
  Sparkles,
  CheckCircle2,
  Smartphone,
  Share,
  PlusSquare,
  HelpCircle,
  Monitor
} from 'lucide-react';
import logoImg from '../../assets/logo.jpg';

export const PWAInstallBanner = () => {
  const {
    isInstallable,
    isInstalled,
    isOffline,
    showInstallModal,
    setShowInstallModal,
    installApp
  } = usePWA();

  const [isDismissed, setIsDismissed] = useState(false);
  const [minimized, setMinimized] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem('pwa_prompt_dismissed');
    if (dismissed) {
      setIsDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('pwa_prompt_dismissed', 'true');
  };

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  return (
    <>
      {/* ── 1. Offline Alert Header ── */}
      {isOffline && (
        <div className="fixed top-0 inset-x-0 z-50 bg-amber-600 text-white px-4 py-2 text-xs sm:text-sm font-medium flex items-center justify-center gap-2 shadow-md animate-pulse no-print">
          <WifiOff className="w-4 h-4 shrink-0" />
          <span>तपाईं अहिले अफलाइन मोडमा हुनुहुन्छ। पहिले खोलिएका विवरणहरू उपलब्ध छन्। (You are offline - Offline mode active)</span>
        </div>
      )}

      {/* ── 2. Floating PWA Minimized Button (when dismissed or minimized) ── */}
      {!isInstalled && (isDismissed || minimized) && (
        <button
          onClick={() => setShowInstallModal(true)}
          title="सहकारी मोबाइल एप इन्स्टल गर्नुहोस् (Install Progressive Web App)"
          className="fixed bottom-5 right-5 z-40 bg-gradient-to-r from-emerald-700 to-green-600 text-white p-3 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center gap-2 text-xs font-bold border-2 border-white/20 no-print"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">एप इन्स्टल (App)</span>
        </button>
      )}

      {/* ── 3. Modern PWA Floating Welcome Card (when not installed & not dismissed) ── */}
      {!isInstalled && !isDismissed && !minimized && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-emerald-100 p-4 transition-all duration-300 transform hover:scale-[1.01] no-print">
          <div className="flex items-start gap-3.5">
            <div className="relative p-2.5 rounded-xl bg-gradient-to-tr from-emerald-700 to-green-600 text-white shrink-0 shadow-md">
              <Smartphone className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 uppercase tracking-wider mb-0.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>प्रोग्रेसिभ वेब एप (PWA)</span>
              </div>
              <h4 className="text-sm font-bold text-slate-800 leading-tight">
                जनता सहकारी एप इन्स्टल गर्नुहोस्
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                इन्टरनेट नहुँदा पनि चलाउन मिल्ने, छिटो र सुरक्षित सहकारी एप आफ्नो मोबाइल वा कम्प्युटरमा राख्नुहोस्।
              </p>

              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={installApp}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-sm transition active:scale-95 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  इन्स्टल गर्नुहोस् (Install)
                </button>
                <button
                  onClick={() => setMinimized(true)}
                  className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer"
                >
                  पछि
                </button>
              </div>
            </div>

            <button
              onClick={handleDismiss}
              aria-label="Close install prompt"
              className="text-slate-400 hover:text-slate-600 p-1.5 -mr-1 -mt-1 rounded-lg hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── 4. Full PWA Installation Guide Modal ── */}
      {showInstallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 no-print animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 border border-slate-100 relative">
            <button
              onClick={() => setShowInstallModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3.5 mb-5">
              <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-md bg-white border border-slate-100 shrink-0">
                <img src={logoImg} alt="Cooperative Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                  जनता सहकारी प्रोग्रेसिभ वेब एप
                </h3>
                <p className="text-xs text-emerald-700 font-semibold mt-0.5 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Janata Sahakari Progressive Web App
                </p>
              </div>
            </div>

            {isInstalled ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-emerald-900">एप पहिले नै इन्स्टल भइसकेको छ</h4>
                <p className="text-xs text-emerald-700 mt-1">
                  तपाईं अहिले नै जनता सहकारी एपको पूर्ण संस्करण प्रयोग गरिरहनु भएको छ।
                </p>
              </div>
            ) : isIOS ? (
              <div className="space-y-3">
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-xs text-amber-800">
                  <strong>iPhone / iPad (iOS Safari)</strong> मा इन्स्टल गर्न तलका २ चरणहरू पूरा गर्नुहोस्:
                </div>
                <div className="bg-slate-50 rounded-2xl p-4 space-y-3 text-xs text-slate-700">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                    <p>सफारीको पुछारमा रहेको <Share className="w-3.5 h-3.5 inline mx-1 text-blue-600" /> <strong>Share (सेयर)</strong> आइकन थिच्नुहोस्।</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                    <p>मेनुलाई तल सारेर <PlusSquare className="w-3.5 h-3.5 inline mx-1 text-slate-700" /> <strong>'Add to Home Screen' (गृहपृष्ठमा थप्नुहोस्)</strong> छान्नुहोस् र 'Add' मा क्लिक गर्नुहोस्।</p>
                  </div>
                </div>
              </div>
            ) : isInstallable ? (
              <div className="space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed">
                  यो एपलाई बिना कुनै प्ले स्टोर डाउनलोड नगरी सिधै आफ्नो डिभाइसमा इन्स्टल गरेर अफलाइन पनि प्रयोग गर्न सक्नुहुन्छ।
                </p>
                <button
                  onClick={installApp}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm py-3 rounded-xl shadow-lg transition active:scale-98"
                >
                  <Download className="w-4 h-4" />
                  अहिले नै इन्स्टल गर्नुहोस् (Install Now)
                </button>
              </div>
            ) : (
              <div className="space-y-3 text-xs text-slate-700">
                <p className="text-xs text-slate-600 leading-relaxed">
                  गुगल क्रोम (Google Chrome), एज (Edge) वा एन्ड्रोइडमा सिधै इन्स्टल गर्न सकिन्छ:
                </p>
                <div className="bg-slate-50 rounded-2xl p-4 space-y-2.5">
                  <div className="flex items-start gap-2">
                    <Monitor className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>डेस्कटप:</strong> ब्राउजरको एड्रेस बारमा रहेको इन्स्टल आइकन (<Download className="w-3.5 h-3.5 inline text-emerald-600" />) थिच्नुहोस्।</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Smartphone className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>मोबाइल:</strong> ब्राउजरको मेनु (३ थोप्ला <strong>⋮</strong>) मा ट्याप गरी <strong>'Install App'</strong> वा <strong>'Add to Home screen'</strong> रोज्नुहोस्।</span>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                अफलाइन सुरक्षित क्यास
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                नेपाली भाषा समर्थन
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                द्रुत गति
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
