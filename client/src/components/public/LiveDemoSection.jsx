import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Receipt, Boxes, Play, Pause, Maximize2, X,
  ChevronLeft, ChevronRight, CheckCircle2, Sparkles, ShieldCheck,
  ArrowRight, ExternalLink, Eye, MonitorPlay, Lock
} from 'lucide-react';

const DEMO_SLIDES = [
  {
    id: 'dashboard',
    label: 'कार्यकारी ड्यासबोर्ड',
    labelEn: 'Executive Dashboard',
    icon: LayoutDashboard,
    badge: '📊 प्रत्यक्ष विश्लेषण (Real-Time)',
    title: 'मुख्य कार्यकारी ड्यासबोर्ड तथा विश्लेषणात्मक तथ्याङ्क',
    titleEn: 'Comprehensive Cooperative Analytics & Live Performance',
    image: '/api/demo-assets/dashboard_demo_preview_1792690390077.jpg',
    urlPath: '/dashboard',
    desc: 'सहकारीको सम्पूर्ण आर्थिक कारोबार, किसान सदस्य संख्या, मलखादको गोदाम मौज्दात र मासिक बिक्रीको एकीकृत ग्राफिक रिपोर्ट।',
    features: [
      'दैनिक तथा मासिक खरिद-बिक्री स्वचालित चार्ट (Interactive Revenue Trends)',
      'डीएपी, युरिया र पोटास मलको प्रत्यक्ष मौज्दात स्तर (Live Stock Gauges)',
      'सक्रिय किसान सदस्य र बाँकी बक्यौता रकम ट्र्याकिङ (Member Dues Tracking)',
      'हालका सम्पूर्ण लेनदेनहरूको डिजिटल अभिलेख (Instant Audit Trail)'
    ],
    stats: [
      { label: 'मासिक कारोबार (Monthly Sales)', val: 'रु. ४,५२,०००+' },
      { label: 'सक्रिय कृषक (Active Farmers)', val: '५४०+ सदस्य' },
      { label: 'गोदाम मौज्दात (Warehouse Stock)', val: '४७० बोरा' }
    ]
  },
  {
    id: 'billing',
    label: 'पीओएस तथा बिक्री बिलिङ',
    labelEn: 'POS & Billing',
    icon: Receipt,
    badge: '🧾 द्रुत काउन्टर बिलिङ (Fast POS)',
    title: 'मलखाद बिक्री तथा आधिकारिक रसिद उत्पादन प्रणाली',
    titleEn: 'Smart Agricultural POS & Nepali Voucher Printing',
    image: '/api/demo-assets/billing_pos_demo_1792690455086.jpg',
    urlPath: '/billing/new',
    desc: 'किसानको नाम, जग्गाको क्षेत्रफल (कठ्ठा/बिघा) र बालीअनुसार मलको कोटा निर्धारण गरी तत्काल नेपाली भाषामा आधिकारिक रसिद छाप्ने सुविधा।',
    features: [
      'किसान छनोट गर्नासाथ जग्गा र सम्पर्क विवरण स्वतः भरिने (Auto Farmer Fill)',
      'डीएपी, युरिया, पोटास र उन्नत बीउको एक-क्लिक चयन (Quick Product Picker)',
      'अग्रिम नगद भुक्तानी र बाँकी उधारो हिसाबको स्वचालित गणना (Credit Ledger)',
      'चलानी नम्बर तथा संस्थाको छापसहितको आधिकारिक भौचर (Official Seal Bill)'
    ],
    stats: [
      { label: 'बिल उत्पादन समय (Bill Speed)', val: '< ३० सेकेन्ड' },
      { label: 'भुक्तानी विधि (Payment)', val: 'नगद / खाता' },
      { label: 'रसिद ढाँचा (Format)', val: 'नेपाली भाषा' }
    ]
  },
  {
    id: 'register',
    label: 'अनुसूची-३ वितरण दर्ता',
    labelEn: 'Schedule-3 Register',
    icon: Boxes,
    badge: '📋 नेपाल सरकार ढाँचा (Govt Format)',
    title: 'अनुसूची-३ मलखाद वितरण दर्ता तथा गोदाम मौज्दात',
    titleEn: 'Schedule-3 Subsidized Fertilizer Register & Stock Control',
    image: '/api/demo-assets/register_stock_demo_1792690491115.jpg',
    urlPath: '/register',
    desc: 'नेपाल सरकार अनुदानित मलखाद वितरण निर्देशिकाबमोजिम अनुसूची-३ दर्ता, स्वचालित चलानी नम्बर र मौज्दात थ्रेसहोल्ड चेतावनी।',
    features: [
      'नागरिकता/परिचयपत्र नम्बरसहितको अनुसूची-३ सरकारी रजिष्टर (Schedule-3 Compliant)',
      'गोदाममा मल सकिन लाग्दा स्वचालित रिअर्डर अलर्ट (Low Stock Alert Rings)',
      'एक्सेल (Excel) र पीडीएफ (PDF) मा एक-क्लिक रिपोर्ट डाउनलोड (One-click Export)',
      'सहकारी नियम २०४९ र सरकारी अडिटका लागि पूर्णतया प्रमाणीकृत (Govt Audit Ready)'
    ],
    stats: [
      { label: 'सरकारी ढाँचा (Govt Standard)', val: 'अनुसूची-३' },
      { label: 'अलर्ट प्रणाली (Alert Rings)', val: 'स्वचालित' },
      { label: 'डाटा सुरक्षा (Security)', val: '२५६-बिट' }
    ]
  }
];

export const LiveDemoSection = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const timerRef = useRef(null);

  const SLIDE_DURATION = 6000; // 6 seconds per slide

  // Auto-play slideshow simulation
  useEffect(() => {
    if (!isPlaying) {
      setProgress(0);
      return;
    }

    const intervalTime = 50;
    const step = (intervalTime / SLIDE_DURATION) * 100;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveTab((cur) => (cur + 1) % DEMO_SLIDES.length);
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isPlaying, activeTab]);

  const handleSelectTab = (idx) => {
    setActiveTab(idx);
    setProgress(0);
  };

  const handlePrev = () => {
    setActiveTab((cur) => (cur === 0 ? DEMO_SLIDES.length - 1 : cur - 1));
    setProgress(0);
  };

  const handleNext = () => {
    setActiveTab((cur) => (cur + 1) % DEMO_SLIDES.length);
    setProgress(0);
  };

  const activeSlide = DEMO_SLIDES[activeTab];

  return (
    <section id="demo" className="py-24 px-4 sm:px-6 relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-t border-white/5">
      {/* Background Ambience Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold px-4 py-1.5 rounded-full mb-4 backdrop-blur-md shadow-lg shadow-emerald-500/10">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <Sparkles className="w-3.5 h-3.5" />
            <span>प्रत्यक्ष प्रणाली डेमो (Live Interactive System Demo)</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4">
            सहकारी व्यवस्थापन प्रणालीको{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-green-400 bg-clip-text text-transparent">
              प्रत्यक्ष झलक
            </span>
          </h2>

          <p className="text-white/60 text-base sm:text-lg leading-relaxed">
            कृषक सेवा, लेखा, रासायनिक मलखाद बिक्री र गोदाम मौज्दातलाई सरल बनाउने अत्याधुनिक क्लाउड सफ्टवेयरको प्रत्यक्ष डेमो अवलोकन गर्नुहोस्।
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          {DEMO_SLIDES.map((slide, idx) => {
            const Icon = slide.icon;
            const isActive = activeTab === idx;
            return (
              <button
                key={slide.id}
                onClick={() => handleSelectTab(idx)}
                type="button"
                className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-300 border ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-xl shadow-emerald-500/25 scale-105'
                    : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border-white/10 hover:border-white/20 backdrop-blur-md'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-emerald-400'}`} />
                <span>{slide.label}</span>
                <span className={`text-[10px] hidden sm:inline ${isActive ? 'text-slate-900/80 font-normal' : 'text-white/40'}`}>
                  ({slide.labelEn})
                </span>
              </button>
            );
          })}
        </div>

        {/* Mock Browser & Video-Style Interactive Frame */}
        <div className="rounded-3xl bg-slate-900/90 border border-white/15 shadow-2xl shadow-emerald-950/50 backdrop-blur-2xl overflow-hidden transition-all">
          {/* Top Browser Header Bar */}
          <div className="px-5 py-3.5 bg-slate-950/80 border-b border-white/10 flex items-center justify-between gap-4">
            {/* Window Controls */}
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            </div>

            {/* Simulated Address Bar */}
            <div className="flex-1 max-w-md bg-slate-900/80 border border-white/10 rounded-xl px-3.5 py-1.5 flex items-center gap-2 text-xs text-white/50 font-mono truncate">
              <Lock className="w-3 h-3 text-emerald-400 flex-shrink-0" />
              <span className="text-emerald-400/90">https://</span>
              <span className="text-white/80">app.janatasahakari.org</span>
              <span className="text-white/40">{activeSlide.urlPath}</span>
            </div>

            {/* Video Tour Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                type="button"
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white/80 transition border border-white/10"
                title={isPlaying ? "टुर पज गर्नुहोस्" : "अटो-टुर सुरु गर्नुहोस्"}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 text-amber-400" />
                    <span className="hidden sm:inline">Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="hidden sm:inline">Play Tour</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setIsModalOpen(true)}
                type="button"
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white/80 transition border border-white/10"
                title="पूर्ण पर्दामा हेर्नुहोस् (Fullscreen Preview)"
              >
                <Maximize2 className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </div>

          {/* Progress Bar for Tour */}
          {isPlaying && (
            <div className="w-full bg-white/5 h-1">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-75 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {/* Main Visual Showcase Display */}
          <div className="relative group overflow-hidden bg-slate-950">
            <img
              src={activeSlide.image}
              alt={activeSlide.title}
              className="w-full h-auto object-cover max-h-[580px] transition-transform duration-700 ease-out group-hover:scale-[1.01]"
              loading="lazy"
            />

            {/* Top Overlay Badge on Screen */}
            <div className="absolute top-4 left-4 z-20">
              <div className="bg-slate-950/80 backdrop-blur-md border border-white/20 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-xl flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{activeSlide.badge}</span>
              </div>
            </div>

            {/* Bottom Controls / Hover Reveal */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-6 pointer-events-none">
              <div className="text-left pointer-events-auto">
                <p className="text-xs uppercase font-extrabold tracking-widest text-emerald-400 mb-1">
                  {activeSlide.badge}
                </p>
                <h3 className="text-lg font-bold text-white leading-tight">
                  {activeSlide.title}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                type="button"
                className="pointer-events-auto flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg transition hover:scale-105"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>विस्तृत हेर्नुहोस् (Zoom)</span>
              </button>
            </div>

            {/* Left / Right Carousel Arrow Buttons */}
            <button
              onClick={handlePrev}
              type="button"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-950/70 hover:bg-slate-900 border border-white/20 text-white flex items-center justify-center transition-all opacity-70 hover:opacity-100 shadow-xl"
              aria-label="Previous demo"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-950/70 hover:bg-slate-900 border border-white/20 text-white flex items-center justify-center transition-all opacity-70 hover:opacity-100 shadow-xl"
              aria-label="Next demo"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Module Information & Highlights Grid */}
          <div className="p-6 sm:p-8 bg-slate-900/90 border-t border-white/10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            {/* Left 2 Cols: Details & Feature Checklist */}
            <div className="lg:col-span-2 space-y-4">
              <div>
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest">
                  {activeSlide.labelEn} Showcase
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                  {activeSlide.title}
                </h3>
                <p className="text-sm text-white/60 mt-2 leading-relaxed">
                  {activeSlide.desc}
                </p>
              </div>

              {/* Feature Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                {activeSlide.features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-white/80">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Col: Key Metric Highlights & CTA */}
            <div className="bg-slate-950/70 rounded-2xl p-5 border border-white/10 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  प्रमुख सूचकहरू (Key Metrics):
                </p>
                <div className="space-y-2">
                  {activeSlide.stats.map((st, i) => (
                    <div key={i} className="flex items-center justify-between text-xs py-1.5 border-b border-white/5">
                      <span className="text-white/60">{st.label}</span>
                      <span className="font-bold text-white font-mono">{st.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => navigate('/login')}
                  type="button"
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-sm py-3 px-4 rounded-xl shadow-lg shadow-emerald-500/20 transition hover:scale-[1.02] active:scale-95"
                >
                  <span>प्रणालीमा प्रवेश गरी हेर्नुहोस्</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Global Cooperative Trust Highlights */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <ShieldCheck className="w-5 h-5 text-emerald-400 mx-auto mb-1.5" />
            <p className="text-xs font-bold text-white">नेपाल सरकार ऐन अनुकूल</p>
            <p className="text-[10px] text-white/40">सहकारी ऐन २०४८/नियम २०४९</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <Boxes className="w-5 h-5 text-teal-400 mx-auto mb-1.5" />
            <p className="text-xs font-bold text-white">अनुदानित मलखाद अनुसूची-३</p>
            <p className="text-[10px] text-white/40">वितरण कोटा र चलानी नियन्त्रण</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <Lock className="w-5 h-5 text-amber-400 mx-auto mb-1.5" />
            <p className="text-xs font-bold text-white">२५६-बिट सुरक्षित इन्क्रिप्सन</p>
            <p className="text-[10px] text-white/40">भूमिका-आधारित सुरक्षा प्रणाली</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <MonitorPlay className="w-5 h-5 text-purple-400 mx-auto mb-1.5" />
            <p className="text-xs font-bold text-white">मोबाइल तथा कम्प्युटरमा चल्ने</p>
            <p className="text-[10px] text-white/40">पूर्णतया रेस्पोन्सिभ PWA एप</p>
          </div>
        </div>
      </div>

      {/* Lightbox / Zoom Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col justify-center items-center p-4">
          <div className="absolute top-4 right-4 flex items-center gap-3 z-50">
            <button
              onClick={() => setIsModalOpen(false)}
              type="button"
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition border border-white/20"
              title="बन्द गर्नुहोस् (Close)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="max-w-6xl w-full max-h-[85vh] flex flex-col items-center">
            <div className="text-center mb-3">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                {activeSlide.badge}
              </span>
              <h4 className="text-lg font-bold text-white">{activeSlide.title}</h4>
            </div>

            <div className="w-full overflow-auto rounded-2xl border border-white/20 shadow-2xl bg-slate-900">
              <img
                src={activeSlide.image}
                alt={activeSlide.title}
                className="w-full h-auto object-contain max-h-[75vh]"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
