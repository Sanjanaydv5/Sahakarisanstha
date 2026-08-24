import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Award, Users, Target, Heart, ShieldCheck, Sprout,
  Building, Calendar, FileText, CheckCircle2, ChevronRight
} from 'lucide-react';
import { PublicNavbar } from '../../components/public/PublicNavbar';
import { PublicFooter } from '../../components/public/PublicFooter';

const MILESTONES = [
  { year: '२०६७', event: 'सहकारी ऐन २०४८ अन्तर्गत संस्था दर्ता', eventEn: 'Organization registered under Cooperative Act 2048' },
  { year: '२०६८', event: 'पहिलो कृषि सामग्री वितरण कार्यक्रम सञ्चालन', eventEn: 'First agro-input distribution program launched' },
  { year: '२०७२', event: 'किसान सदस्यता ५०० पार', eventEn: 'Farmer membership crossed 500' },
  { year: '२०७८', event: 'डिजिटल बिलिङ र अभिलेख प्रणाली प्रारम्भ', eventEn: 'Digital billing & record system initiated' },
  { year: '२०८०', event: 'ई-सेवा तथा वित्तीय सेवा विस्तार', eventEn: 'E-services and financial services expanded' },
  { year: '२०८१', event: 'सम्पूर्ण डिजिटल व्यवस्थापन प्रणाली', eventEn: 'Full digital management system deployed' },
];

const VALUES = [
  { icon: Heart, color: 'text-rose-400 bg-rose-500/10 border-rose-500/20', title: 'समर्पण', titleEn: 'Dedication', desc: 'किसान र समुदायको सेवामा पूर्णरूपमा समर्पित' },
  { icon: ShieldCheck, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', title: 'पारदर्शिता', titleEn: 'Transparency', desc: 'हरेक कारोबारमा स्पष्टता र इमानदारी' },
  { icon: Users, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20', title: 'सामूहिकता', titleEn: 'Cooperation', desc: 'सहकारी भावनामा एकीकृत समुदाय निर्माण' },
  { icon: Target, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', title: 'गुणस्तर', titleEn: 'Quality', desc: 'उच्च गुणस्तरका सामग्री र सेवाहरूको प्रतिबद्धता' },
];

export const AboutPage = () => {
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

      {/* Page Hero */}
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
          हाम्रोबारे — About Us
        </span>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
          हाम्रो संस्थाको परिचय
        </h1>
        <p className="text-white/50 max-w-xl mx-auto text-lg">
          Know about Janata Sahayogi Krishi Sahakari Sanstha Limited — our history, mission, and values.
        </p>
      </section>

      {/* Organization Info */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 reveal opacity-0">
            <h2 className="text-3xl font-black text-white">
              किसानको विश्वासपात्र साझेदार
            </h2>
            <p className="text-white/60 leading-relaxed">
              जनता सहयोगी कृषि सहकारी संस्था लिमिटेड नेपाल सरकारको सहकारी ऐन २०४८ तथा नियम २०४९ अन्तर्गत २०६७ सालमा स्थापना भएको संस्था हो।
            </p>
            <p className="text-white/60 leading-relaxed">
              लोहारपट्टी-२, मधेपुरा (महोत्तरी) मा अवस्थित यो संस्थाले किसानहरूलाई मल, बीउ, कीटनाशक र अन्य कृषि सामग्रीहरू उपलब्ध गराउँदै आइरहेको छ। साथै डिजिटल सेवाहरू मार्फत ग्रामीण समुदायको जीवनस्तर उकास्न काम गर्दैछ।
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Building, label: 'दर्ता नं', value: '६८८/०६७/०६८' },
                { icon: FileText, label: 'PAN नं', value: '६१४२५५४०१' },
                { icon: Calendar, label: 'स्थापना', value: '२०६७ साल' },
                { icon: Award, label: 'प्रकार', value: 'कृषि सहकारी' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <Icon className="w-5 h-5 text-emerald-400 mb-2" />
                  <p className="text-xs text-white/40 mb-0.5">{label}</p>
                  <p className="text-white font-bold text-sm">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="space-y-5 reveal opacity-0">
            <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <Target className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-emerald-400 text-xs font-bold uppercase tracking-wider">हाम्रो लक्ष्य</p>
                  <p className="text-white font-bold">Mission</p>
                </div>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">
                किसानहरूलाई गुणस्तरीय कृषि सामग्री उचित मूल्यमा उपलब्ध गराई उनीहरूको आर्थिक सशक्तीकरण गर्नु नै हाम्रो मुख्य लक्ष्य हो।
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/5 border border-blue-500/20 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Sprout className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-blue-400 text-xs font-bold uppercase tracking-wider">हाम्रो दृष्टिकोण</p>
                  <p className="text-white font-bold">Vision</p>
                </div>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">
                आधुनिक प्रविधि र सहकारी भावनाको मेलबाट महोत्तरी जिल्लाको कृषि क्षेत्रलाई डिजिटल र समृद्ध बनाउने।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 px-6 bg-slate-900/30 border-y border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 reveal opacity-0">
            <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest">हाम्रा मूल्यहरू</span>
            <h2 className="text-3xl font-black text-white mt-2">Core Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {VALUES.map(({ icon: Icon, color, title, titleEn, desc }) => (
              <div key={title} className="text-center bg-white/3 border border-white/8 rounded-2xl p-6 hover:border-white/20 transition reveal opacity-0">
                <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl border flex items-center justify-center ${color}`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-white font-bold text-lg">{title}</h3>
                <p className="text-white/40 text-xs mb-2">{titleEn}</p>
                <p className="text-white/50 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14 reveal opacity-0">
            <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest">इतिहास</span>
            <h2 className="text-3xl font-black text-white mt-2">हाम्रो यात्रा — Our Journey</h2>
          </div>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-emerald-500/50 via-emerald-500/20 to-transparent" />
            <div className="space-y-8">
              {MILESTONES.map(({ year, event, eventEn }, i) => (
                <div key={year} className="flex gap-6 reveal opacity-0" style={{ transitionDelay: `${i * 80}ms` }}>
                  <div className="w-8 h-8 rounded-full bg-emerald-500 border-4 border-slate-950 flex items-center justify-center flex-shrink-0 mt-1 z-10">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                  <div className="bg-white/3 border border-white/8 rounded-xl p-4 flex-1 hover:border-emerald-500/30 transition">
                    <span className="text-emerald-400 font-black text-lg">{year}</span>
                    <p className="text-white font-semibold text-sm mt-1">{event}</p>
                    <p className="text-white/40 text-xs mt-0.5">{eventEn}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 text-center reveal opacity-0">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-black text-white mb-3">हाम्रो सेवाहरू जान्नुहोस्</h2>
          <p className="text-white/50 mb-7">Learn about all the services we provide to our members.</p>
          <Link
            to="/services"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg hover:scale-105 transition-transform"
          >
            सेवाहरू हेर्नुहोस् <ChevronRight className="w-4 h-4" />
          </Link>
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
