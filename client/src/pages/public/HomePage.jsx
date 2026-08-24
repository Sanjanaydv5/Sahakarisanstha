import React, { useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowRight, Sprout, ShieldCheck, Wheat, Users, BarChart3,
  Zap, Star, ChevronRight, TrendingUp, Award, CheckCircle2
} from 'lucide-react';
import { PublicNavbar } from '../../components/public/PublicNavbar';
import { PublicFooter } from '../../components/public/PublicFooter';

const STATS = [
  { value: '२०६७', label: 'स्थापना वर्ष', labelEn: 'Est. Year', icon: Award },
  { value: '५००+', label: 'किसान सदस्य', labelEn: 'Farmer Members', icon: Users },
  { value: '७+', label: 'सेवा प्रकार', labelEn: 'Service Types', icon: Zap },
  { value: '१००%', label: 'विश्वसनीय', labelEn: 'Trustworthy', icon: ShieldCheck },
];

const FEATURES = [
  {
    icon: Wheat,
    color: 'from-emerald-500 to-green-600',
    title: 'कृषि सामग्री वितरण',
    titleEn: 'Agro Input Distribution',
    desc: 'मल, बीउ, कीटनाशक र कृषि औजारहरू उचित मूल्यमा किसानहरूलाई वितरण गर्दछौं।',
  },
  {
    icon: TrendingUp,
    color: 'from-blue-500 to-cyan-600',
    title: 'बिलिङ र हिसाब',
    titleEn: 'Billing & Accounts',
    desc: 'डिजिटल बिल उत्पादन, खरिद-बिक्री अभिलेख र बाँकी रकम ट्र्याकिङ प्रणाली।',
  },
  {
    icon: Users,
    color: 'from-purple-500 to-violet-600',
    title: 'किसान व्यवस्थापन',
    titleEn: 'Farmer Management',
    desc: 'किसानको विवरण, जमीन क्षेत्रफल, बाली प्रकार र बकाया रकमको सम्पूर्ण अभिलेख।',
  },
  {
    icon: Zap,
    color: 'from-orange-500 to-amber-600',
    title: 'डिजिटल सेवाहरू',
    titleEn: 'Digital Services',
    desc: 'ई-सेवा, विद्युत महसुल, मनी ट्रान्सफर, फोटोकपी र प्रिन्टआउट सेवाहरू।',
  },
  {
    icon: BarChart3,
    color: 'from-rose-500 to-pink-600',
    title: 'रिपोर्ट तथा विश्लेषण',
    titleEn: 'Reports & Analytics',
    desc: 'बिक्री रिपोर्ट, स्टक विश्लेषण र वार्षिक प्रतिवेदन स्वचालित रूपमा तयार पार्नुहोस्।',
  },
  {
    icon: ShieldCheck,
    color: 'from-teal-500 to-emerald-600',
    title: 'सुरक्षित प्रणाली',
    titleEn: 'Secure System',
    desc: 'भूमिका-आधारित प्रवेश नियन्त्रण — Admin, Manager र Staff स्तरको सुरक्षा।',
  },
];

export const HomePage = () => {
  const navigate = useNavigate();
  const heroRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('animate-fade-in-up');
      }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans overflow-x-hidden">
      <PublicNavbar />

      {/* ── Hero ── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(16,185,129,0.18) 0%, transparent 70%), linear-gradient(to bottom right, #020617, #0f172a, #042f2e)'
        }}
      >
        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />

        {/* Floating glow orbs */}
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-teal-500/8 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center py-28">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold px-4 py-2 rounded-full mb-8 backdrop-blur-sm">
            <Star className="w-3 h-3 fill-current" />
            सहकारी ऐन २०४८ अन्तर्गत स्थापित • दर्ता नं: ६८८/०६७/०६८
          </div>

          <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              जनता सहयोगी
            </span>
            <br />
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              कृषि सहकारी संस्था
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-4 leading-relaxed font-medium">
            Janata Sahayogi Krishi Sahakari Sanstha Limited
          </p>
          <p className="text-base text-white/50 max-w-xl mx-auto mb-10 leading-relaxed">
            लोहारपट्टी-२, मधेपुरा (महोत्तरी) — किसानहरूको सशक्तीकरण र कृषि विकासमा समर्पित।
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="flex items-center gap-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-base px-8 py-4 rounded-2xl shadow-2xl shadow-emerald-500/30 transition-all hover:scale-105 active:scale-95"
            >
              <Sprout className="w-5 h-5" />
              प्रणालीमा प्रवेश गर्नुहोस्
              <ArrowRight className="w-5 h-5" />
            </button>
            <Link
              to="/about"
              className="flex items-center gap-2 text-white/70 hover:text-white font-semibold text-base px-6 py-4 rounded-2xl border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all"
            >
              हाम्रोबारे जान्नुहोस् <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-1.5">
            <div className="w-1 h-3 bg-white/60 rounded-full" />
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-16 bg-slate-900/50 border-y border-white/5">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map(({ value, label, labelEn, icon: Icon }) => (
            <div key={label} className="text-center group reveal opacity-0">
              <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/20 transition">
                <Icon className="w-6 h-6 text-emerald-400" />
              </div>
              <p className="text-3xl font-black text-white mb-1">{value}</p>
              <p className="text-sm font-semibold text-emerald-400">{label}</p>
              <p className="text-xs text-white/30 mt-0.5">{labelEn}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 reveal opacity-0">
            <span className="text-emerald-400 text-sm font-bold uppercase tracking-widest">हाम्रा सुविधाहरू</span>
            <h2 className="text-3xl md:text-4xl font-black text-white mt-3 mb-4">
              एकीकृत सहकारी व्यवस्थापन प्रणाली
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Integrated Cooperative Management System — सबै काम एकै ठाउँमा।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, color, title, titleEn, desc }) => (
              <div
                key={title}
                className="group bg-white/3 hover:bg-white/6 border border-white/8 hover:border-emerald-500/30 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 reveal opacity-0"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-bold text-lg mb-1">{title}</h3>
                <p className="text-emerald-400 text-xs font-semibold mb-3">{titleEn}</p>
                <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-20 px-6">
        <div
          className="max-w-4xl mx-auto rounded-3xl p-12 text-center relative overflow-hidden reveal opacity-0"
          style={{
            background: 'linear-gradient(135deg, rgba(16,185,129,0.2) 0%, rgba(20,184,166,0.15) 100%)',
            border: '1px solid rgba(16,185,129,0.3)'
          }}
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl" />
          <Sprout className="w-14 h-14 text-emerald-400 mx-auto mb-6" />
          <h2 className="text-3xl font-black text-white mb-3">
            अहिले नै सुरु गर्नुहोस्
          </h2>
          <p className="text-white/60 mb-8 text-lg">
            तपाईंको सहकारी व्यवस्थापन डिजिटल बनाउनुहोस् — <span className="text-emerald-400">आजै लगइन गर्नुहोस्।</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold px-8 py-4 rounded-xl shadow-xl transition-all hover:scale-105"
            >
              <LogInIcon className="w-5 h-5" />
              लगइन गर्नुहोस् (Login)
            </button>
            <Link to="/contact" className="flex items-center gap-2 border border-white/20 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-all">
              सम्पर्क गर्नुहोस् (Contact Us)
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />

      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease forwards;
        }
      `}</style>
    </div>
  );
};

// inline icon to avoid import naming conflict
const LogInIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
    <polyline points="10 17 15 12 10 7"/>
    <line x1="15" y1="12" x2="3" y2="12"/>
  </svg>
);
