import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Wheat, BarChart3, Users, Zap, ShieldCheck, FileText,
  Printer, Phone, CreditCard, Droplets, Sprout, ChevronRight, CheckCircle2
} from 'lucide-react';
import { PublicNavbar } from '../../components/public/PublicNavbar';
import { PublicFooter } from '../../components/public/PublicFooter';

const SERVICES = [
  {
    icon: Wheat,
    color: 'from-emerald-500 to-green-600',
    glow: 'shadow-emerald-500/20',
    badge: 'मुख्य सेवा',
    title: 'कृषि सामग्री वितरण',
    titleEn: 'Agro Input Distribution',
    desc: 'सरकार-अनुदानित मल, उन्नत बीउ, कीटनाशक र कृषि औजारहरू सदस्य किसानहरूलाई उचित मूल्यमा।',
    points: ['DAP / युरिया / पोटास मल', 'धान / गहुँ / तरकारी बीउ', 'कीटनाशक विषादी', 'जिंक सल्फेट मल'],
  },
  {
    icon: FileText,
    color: 'from-blue-500 to-indigo-600',
    glow: 'shadow-blue-500/20',
    badge: 'डिजिटल',
    title: 'बिलिङ प्रणाली',
    titleEn: 'Digital Billing System',
    desc: 'स्वचालित बिल उत्पादन, नेपाली मिति सहित आधिकारिक भाउचर, र ग्राहक बाँकी ट्र्याकिङ।',
    points: ['नेपाली मिति सहित बिल', 'बाँकी / अग्रिम भुक्तानी', 'बिक्री दर्ता (Schedule-3)', 'बिल प्रिन्ट सुविधा'],
  },
  {
    icon: Users,
    color: 'from-purple-500 to-violet-600',
    glow: 'shadow-purple-500/20',
    badge: 'अभिलेख',
    title: 'किसान व्यवस्थापन',
    titleEn: 'Farmer Management',
    desc: 'किसानको परिचय-पत्र नम्बर, ठेगाना, जमीन क्षेत्र, बाली र खरिद इतिहासको डिजिटल अभिलेख।',
    points: ['किसान दर्ता तथा परिचय', 'जमीन क्षेत्रफल अभिलेख', 'बाली प्रकार ट्र्याकिङ', 'बकाया रकम व्यवस्थापन'],
  },
  {
    icon: Zap,
    color: 'from-amber-500 to-orange-600',
    glow: 'shadow-amber-500/20',
    badge: 'वित्तीय',
    title: 'ई-सेवा तथा डिजिटल सेवा',
    titleEn: 'E-Services & Digital',
    desc: 'ई-सेवा, NEA विद्युत महसुल भुक्तानी, IME/Prabhu मनी ट्रान्सफर सेवाहरू एकै ठाउँमा।',
    points: ['ई-सेवा वालेट लोड', 'NEA विद्युत महसुल', 'IME / Prabhu ट्रान्सफर', 'बैंकिङ सहयोग'],
  },
  {
    icon: Printer,
    color: 'from-teal-500 to-cyan-600',
    glow: 'shadow-teal-500/20',
    badge: 'सेवा',
    title: 'फोटोकपी तथा प्रिन्ट',
    titleEn: 'Photocopy & Print',
    desc: 'नागरिकता, लालपुर्जा, आवेदन पत्र र सरकारी फारमहरूको फोटोकपी र रङ्गीन/सादा प्रिन्टआउट।',
    points: ['फोटोकपी सेवा', 'रङ्गीन / सादा प्रिन्ट', 'सरकारी फारम', 'डकुमेन्ट स्क्यान'],
  },
  {
    icon: BarChart3,
    color: 'from-rose-500 to-pink-600',
    glow: 'shadow-rose-500/20',
    badge: 'विश्लेषण',
    title: 'रिपोर्ट र विश्लेषण',
    titleEn: 'Reports & Analytics',
    desc: 'दैनिक बिक्री, स्टक स्थिति, मासिक आय, र वार्षिक प्रतिवेदनहरू स्वचालित रूपमा।',
    points: ['दैनिक बिक्री रिपोर्ट', 'स्टक / इन्भेन्ट्री', 'बाँकी रकम (Dues)', 'वार्षिक प्रतिवेदन'],
  },
];

export const ServicesPage = () => {
  const navigate = useNavigate();

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

      {/* Hero */}
      <section
        className="pt-36 pb-20 px-6 text-center relative"
        style={{
          background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(16,185,129,0.14) 0%, transparent 70%), linear-gradient(to bottom, #020617, #0f172a)'
        }}
      >
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
        />
        <span className="inline-block text-emerald-400 text-xs font-bold uppercase tracking-widest mb-4 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full">
          सेवाहरू — Our Services
        </span>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
          हामी के-के सेवा दिन्छौं?
        </h1>
        <p className="text-white/50 max-w-xl mx-auto text-lg">
          Complete cooperative management and community services under one digital roof.
        </p>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map(({ icon: Icon, color, glow, badge, title, titleEn, desc, points }, i) => (
            <div
              key={title}
              className={`group bg-white/3 hover:bg-white/6 border border-white/8 hover:border-white/20 rounded-3xl p-7 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${glow} reveal opacity-0`}
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              {/* Badge */}
              <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-white/40 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full mb-4">
                {badge}
              </span>

              {/* Icon */}
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-5 shadow-xl group-hover:scale-110 transition-transform`}>
                <Icon className="w-7 h-7 text-white" />
              </div>

              <h3 className="text-white font-bold text-xl mb-1">{title}</h3>
              <p className="text-emerald-400 text-xs font-semibold mb-4">{titleEn}</p>
              <p className="text-white/50 text-sm leading-relaxed mb-5">{desc}</p>

              {/* Feature List */}
              <ul className="space-y-2">
                {points.map(p => (
                  <li key={p} className="flex items-center gap-2.5 text-sm text-white/60">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Digital Services Banner */}
      <section className="py-16 px-6 bg-slate-900/40 border-y border-white/5">
        <div className="max-w-5xl mx-auto text-center reveal opacity-0">
          <h2 className="text-2xl font-black text-white mb-3">सबै सेवा एकै ठाउँमा</h2>
          <p className="text-white/50 mb-8">All services — agriculture, billing, digital payments & more — at one location.</p>
          <div className="flex flex-wrap justify-center gap-3">
            {['🌾 मल वितरण', '💊 कीटनाशक', '🌱 बीउ', '⚡ विद्युत', '📱 ई-सेवा', '💸 मनी ट्रान्सफर', '🖨 प्रिन्ट', '📋 फोटोकपी'].map(s => (
              <span key={s} className="bg-white/5 border border-white/10 text-white/70 px-4 py-2 rounded-full text-sm font-medium hover:bg-white/10 transition">
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 text-center reveal opacity-0">
        <div className="max-w-xl mx-auto">
          <Sprout className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-white mb-3">हाम्रा सेवाहरू प्रयोग गर्नुहोस्</h2>
          <p className="text-white/50 mb-7">Login to manage your cooperative operations digitally.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 justify-center bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg hover:scale-105 transition-transform"
            >
              लगइन गर्नुहोस् <ChevronRight className="w-4 h-4" />
            </button>
            <Link to="/contact" className="flex items-center gap-2 justify-center border border-white/20 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/5 transition">
              सम्पर्क गर्नुहोस् <Phone className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />

      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease forwards; }
      `}</style>
    </div>
  );
};
