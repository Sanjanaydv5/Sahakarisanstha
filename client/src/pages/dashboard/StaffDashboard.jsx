import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import api from '../../api/axiosInstance';
import { useLanguage } from '../../context/LanguageContext';
import { toDevanagari, formatNPR } from '../../utils/nepaliConverter';
import {
  PlusCircle,
  Receipt,
  Zap,
  CheckCircle,
  Wallet,
  Clock,
  Printer,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const StaffDashboard = () => {
  const { t } = useLanguage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/reports/staff-dashboard');
      if (res.data.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Error loading staff dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  const stats = data?.stats || {};
  const recentBills = data?.recentBills || [];
  const recentServices = data?.recentServices || [];

  return (
    <div className="space-y-6">
      {/* Top POS Action Callout */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-900 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md inline-block">
            काउन्टर बिलिङ तथा सेवा डेस्क (Counter & POS Desk)
          </span>
          <h2 className="text-2xl font-extrabold tracking-tight">
            मलखाद बिक्री र वित्तीय सेवा दर्ता
          </h2>
          <p className="text-xs text-emerald-100 max-w-lg">
            कृषकहरूलाई मलखाद, बीउबिजन बिक्री र इ-सेवा, विद्युत महसुल भुक्तानीको तत्काल बिल काट्नुहोस्
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <NavLink
            to="/billing/new"
            className="bg-white text-emerald-900 hover:bg-emerald-50 font-extrabold text-sm py-3 px-6 rounded-2xl shadow-lg transition flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-5 h-5 text-emerald-600" />
            <span>+ नयाँ बिल काट्नुहोस् (New Bill)</span>
          </NavLink>

          <NavLink
            to="/services"
            className="bg-emerald-500/40 hover:bg-emerald-500/60 text-white border border-white/30 font-bold text-xs py-3 px-4 rounded-2xl transition flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4 text-amber-300" />
            <span>इ-सेवा / विद्युत भुक्तानी</span>
          </NavLink>
        </div>
      </div>

      {/* Staff Shift KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Bills Count */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">आज मैले काटेको बिल</span>
          <div className="text-2xl font-extrabold text-emerald-700">
            {toDevanagari(stats.todayBillsCount || 0)} वटा
          </div>
          <p className="text-xs font-semibold text-slate-500">
            कुल बिक्री: {formatNPR(stats.todaySales || 0, true)}
          </p>
        </div>

        {/* Cash Collected in Counter */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">काउन्टरमा प्राप्त नगद</span>
          <div className="text-2xl font-extrabold text-slate-900">
            {formatNPR(stats.todayCashCollected || 0, true)}
          </div>
          <p className="text-xs font-semibold text-emerald-600">
            नगद दराजमा रहेको रकम
          </p>
        </div>

        {/* Today's Service Count */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">आजका सेवा कारोबार</span>
          <div className="text-2xl font-extrabold text-slate-900">
            {toDevanagari(stats.todayServicesCount || 0)} पटक
          </div>
          <p className="text-xs font-semibold text-slate-500">
            कारोबार: {formatNPR(stats.todayServicesVolume || 0, true)}
          </p>
        </div>

        {/* Service Commission */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">सेवा शुल्क/कमिसन आम्दानी</span>
          <div className="text-2xl font-extrabold text-amber-600">
            {formatNPR(stats.todayServicesCommission || 0, true)}
          </div>
          <p className="text-xs font-semibold text-amber-700">
            सहकारीको खुद सेवा आम्दानी
          </p>
        </div>
      </div>

      {/* Two Column Layout: My Recent Bills & My Recent Utility Services */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Recent Bills */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-emerald-600" />
              <span>आज मैले जारी गरेका बिलहरू (My Bills)</span>
            </h3>
            <NavLink to="/billing" className="text-xs font-bold text-emerald-600 hover:underline">
              सबै बिल हेर्नुहोस् &rarr;
            </NavLink>
          </div>

          <div className="space-y-2.5">
            {recentBills.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                आज अहिलेसम्म कुनै बिल जारी गरिएको छैन ।
              </div>
            ) : (
              recentBills.map((b) => (
                <div key={b._id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between hover:bg-emerald-50/50 transition">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-emerald-800 font-mono">
                        #{toDevanagari(b.billNo) || b.billNo}
                      </span>
                      <span className="font-bold text-xs text-slate-900">{b.buyerName}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">{b.nepaliDate} • {b.items?.length || 1} सामान</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-xs font-extrabold text-slate-900">{formatNPR(b.totalAmount, true)}</p>
                      <p className={`text-[10px] font-bold ${b.status === 'paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {b.status === 'paid' ? 'चुक्ता' : `बाँकी: ${formatNPR(b.balanceDue, true)}`}
                      </p>
                    </div>
                    <NavLink
                      to={`/billing/${b._id}`}
                      className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 shadow-xs"
                      title="प्रिन्ट / हेर्नुहोस्"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </NavLink>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* My Recent Services */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>आजका वित्तीय तथा अन्य सेवाहरू (Services Log)</span>
            </h3>
            <NavLink to="/services" className="text-xs font-bold text-emerald-600 hover:underline">
              नयाँ सेवा दर्ता &rarr;
            </NavLink>
          </div>

          <div className="space-y-2.5">
            {recentServices.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                आज कुनै सेवा कारोबार दर्ता भएको छैन ।
              </div>
            ) : (
              recentServices.map((s) => (
                <div key={s._id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 uppercase">
                        {s.serviceType}
                      </span>
                      <span className="font-bold text-xs text-slate-900">{s.customerName}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">{s.accountOrConsumerNo || s.notes || s.customerPhone}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-extrabold text-slate-900">{formatNPR(s.totalCollected, true)}</p>
                    <p className="text-[10px] text-emerald-600 font-bold">कमिसन: +{formatNPR(s.serviceCharge, true)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
