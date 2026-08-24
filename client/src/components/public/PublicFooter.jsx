import React from 'react';
import { Sprout, Phone, MapPin, Facebook, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PublicFooter = () => (
  <footer className="bg-slate-950 border-t border-white/10 text-white/70">
    <div className="max-w-6xl mx-auto px-5 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
      {/* Brand */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <Sprout className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-extrabold text-sm">जनता सहयोगी कृषि सहकारी</p>
            <p className="text-emerald-400 text-[10px] font-semibold tracking-wider uppercase">Sahakari Sanstha Ltd.</p>
          </div>
        </div>
        <p className="text-sm leading-relaxed">
          नेपाल सरकार दर्ता संस्था — सहकारी ऐन २०४८ अन्तर्गत स्थापित। किसान र ग्रामीण समुदायको आर्थिक सशक्तीकरणका लागि समर्पित।
        </p>
        <div className="flex gap-3">
          <a href="#" className="w-8 h-8 rounded-lg bg-white/10 hover:bg-emerald-500/20 flex items-center justify-center transition">
            <Facebook className="w-4 h-4" />
          </a>
          <a href="mailto:admin@janatasahakari.org" className="w-8 h-8 rounded-lg bg-white/10 hover:bg-emerald-500/20 flex items-center justify-center transition">
            <Mail className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Links */}
      <div className="space-y-3">
        <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Quick Links</h4>
        {[
          { to: '/', label: 'गृहपृष्ठ (Home)' },
          { to: '/about', label: 'हाम्रोबारे (About)' },
          { to: '/services', label: 'सेवाहरू (Services)' },
          { to: '/contact', label: 'सम्पर्क (Contact)' },
          { to: '/login', label: 'लगइन (Login)' },
        ].map(l => (
          <Link key={l.to} to={l.to} className="block text-sm hover:text-emerald-400 transition">
            {l.label}
          </Link>
        ))}
      </div>

      {/* Contact */}
      <div className="space-y-3">
        <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">सम्पर्क ठेगाना</h4>
        <div className="flex items-start gap-3 text-sm">
          <MapPin className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
          <span>लोहारपट्टी-२, मधेपुरा (महोत्तरी), नेपाल</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>९८४४-१११६२१ / ९८१४-८५०७४६</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>admin@janatasahakari.org</span>
        </div>
        <div className="mt-4 pt-4 border-t border-white/10 text-xs space-y-1">
          <p>दर्ता नं: ६८८/०६७/०६८</p>
          <p>PAN: ६१४२५५४०१ (614255401)</p>
          <p>स्थापना: २०६७ साल</p>
        </div>
      </div>
    </div>

    <div className="border-t border-white/5 py-5 text-center text-xs text-white/30">
      © {new Date().getFullYear()} जनता सहयोगी कृषि सहकारी संस्था लिमिटेड — All rights reserved.
    </div>
  </footer>
);
