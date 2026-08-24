import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, AlertCircle, Sprout } from 'lucide-react';
import { PublicNavbar } from '../../components/public/PublicNavbar';
import { PublicFooter } from '../../components/public/PublicFooter';

const INFO_CARDS = [
  {
    icon: MapPin,
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    title: 'कार्यालय ठेगाना',
    titleEn: 'Office Address',
    lines: ['लोहारपट्टी-२, मधेपुरा (महोत्तरी)', 'बागमती प्रदेश, नेपाल', 'Loharpatti-2, Madhepura, Mahottari'],
  },
  {
    icon: Phone,
    color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    title: 'फोन नम्बर',
    titleEn: 'Phone Numbers',
    lines: ['९८४४-१११६२१', '९८१४-८५०७४६', 'कार्यालय समयमा उपलब्ध'],
  },
  {
    icon: Mail,
    color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    title: 'इमेल',
    titleEn: 'Email Address',
    lines: ['admin@janatasahakari.org', 'manager@janatasahakari.org', 'जुनसुकै समय सन्देश पठाउनुहोस्'],
  },
  {
    icon: Clock,
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    title: 'कार्यालय समय',
    titleEn: 'Office Hours',
    lines: ['आइत–शुक्र: बिहान ९ – साँझ ५', 'शनिबार: बिहान ९ – दिउँसो १', 'सार्वजनिक बिदाका दिन बन्द'],
  },
];

export const ContactPage = () => {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [loading, setLoading] = useState(false);

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

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.message) {
      setStatus('error');
      return;
    }
    setLoading(true);
    // Simulate sending (replace with actual API if needed)
    await new Promise(r => setTimeout(r, 1500));
    setStatus('success');
    setLoading(false);
    setForm({ name: '', phone: '', email: '', message: '' });
  };

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
          सम्पर्क — Contact Us
        </span>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
          हामीसँग सम्पर्क गर्नुहोस्
        </h1>
        <p className="text-white/50 max-w-xl mx-auto text-lg">
          Any queries? We are here to help. Reach us anytime.
        </p>
      </section>

      {/* Info Cards */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {INFO_CARDS.map(({ icon: Icon, color, title, titleEn, lines }) => (
            <div key={title} className="bg-white/3 border border-white/8 rounded-2xl p-6 hover:border-white/20 transition reveal opacity-0">
              <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-4 ${color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-white font-bold text-base mb-0.5">{title}</h3>
              <p className="text-white/30 text-[11px] mb-3">{titleEn}</p>
              <div className="space-y-1">
                {lines.map((l, i) => (
                  <p key={i} className="text-white/60 text-sm">{l}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Map + Contact Form */}
      <section className="py-10 px-6 pb-24">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">

          {/* Map Embed */}
          <div className="reveal opacity-0 space-y-5">
            <div>
              <h2 className="text-2xl font-black text-white mb-2">हाम्रो स्थान</h2>
              <p className="text-white/40 text-sm">Find us on the map — Loharpatti-2, Madhepura, Mahottari</p>
            </div>
            <div className="rounded-2xl overflow-hidden border border-white/10 h-72 bg-slate-900 relative">
              <iframe
                title="Janata Sahakari Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1780.9603675710518!2d85.87677953844545!3d26.778796488733224!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ec6a4ddd99542f%3A0x7ec5fbe9c3e48052!2sMadhepura%2C%20Bagada%2045700%2C%20Nepal!5e0!3m2!1sen!2sus!4v1787581564426!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) saturate(0.8)' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>

            {/* Quick info */}
            <div className="bg-white/3 border border-white/8 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm text-white/70">कार्यालय अहिले <span className="text-emerald-400 font-semibold">खुल्ला</span> छ</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-white/40 mb-1">दर्ता नं</p>
                  <p className="text-white font-bold">६८८/०६७/०६८</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-white/40 mb-1">PAN नं</p>
                  <p className="text-white font-bold">614255401</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="reveal opacity-0">
            <div>
              <h2 className="text-2xl font-black text-white mb-2">सन्देश पठाउनुहोस्</h2>
              <p className="text-white/40 text-sm mb-6">Send us a message and we'll get back to you.</p>
            </div>

            {status === 'success' && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl p-4 flex items-center gap-3 mb-5">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">सन्देश सफलतापूर्वक पठाइयो! धन्यवाद।</span>
              </div>
            )}
            {status === 'error' && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl p-4 flex items-center gap-3 mb-5">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">कृपया नाम र सन्देश अनिवार्य भर्नुहोस्।</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-white/60 mb-1.5">नाम * (Name)</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="तपाईंको नाम"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/20 focus:outline-none focus:border-emerald-500/50 focus:bg-white/8 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/60 mb-1.5">फोन (Phone)</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="९८xxxxxxxx"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/20 focus:outline-none focus:border-emerald-500/50 focus:bg-white/8 transition"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-white/60 mb-1.5">इमेल (Email)</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/20 focus:outline-none focus:border-emerald-500/50 focus:bg-white/8 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-white/60 mb-1.5">सन्देश * (Message)</label>
                <textarea
                  name="message"
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="तपाईंको सन्देश वा प्रश्न यहाँ लेख्नुहोस्..."
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/20 focus:outline-none focus:border-emerald-500/50 focus:bg-white/8 transition resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    पठाइँदैछ...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    सन्देश पठाउनुहोस् (Send Message)
                  </>
                )}
              </button>
            </form>
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
