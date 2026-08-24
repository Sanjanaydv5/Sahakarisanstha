import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import api from '../../api/axiosInstance';
import { useLanguage } from '../../context/LanguageContext';
import { toDevanagari, formatNPR } from '../../utils/nepaliConverter';
import {
  TrendingUp,
  Receipt,
  Boxes,
  CreditCard,
  Zap,
  Users,
  AlertTriangle,
  ArrowUpRight,
  PlusCircle,
  FileSpreadsheet,
  CheckCircle2
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar
} from 'recharts';

export const AdminDashboard = () => {
  const { t } = useLanguage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/reports/admin-dashboard');
      if (res.data.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Error loading admin dashboard stats:', err);
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
  const charts = data?.charts || {};
  const lowStockAlerts = data?.lowStockAlerts || [];
  const recentBills = data?.recentBills || [];

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-emerald-800 to-slate-900 rounded-3xl p-6 text-white shadow-xl">
        <div>
          <span className="bg-emerald-500/30 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-400/30 uppercase tracking-wider">
            प्रशासक नियन्त्रण कक्ष (Admin Control Room)
          </span>
          <h2 className="text-2xl font-extrabold mt-2 tracking-tight">
            जनता सहयोगी कृषि सहकारी संस्था
          </h2>
          <p className="text-xs text-emerald-100/80 mt-1">
            मलखाद बिक्री, वित्तीय सेवा, मौज्दात र उधारो व्यवस्थापनको विस्तृत सारांश
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <NavLink
            to="/billing/new"
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-lg transition flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ नयाँ बिल काट्नुहोस् (POS)</span>
          </NavLink>
          <NavLink
            to="/register"
            className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs py-2.5 px-4 rounded-xl backdrop-blur-md transition flex items-center gap-2 border border-white/20"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>अनुसूची-३ रजिस्टर</span>
          </NavLink>
        </div>
      </div>

      {/* Primary KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">कुल बिक्री आम्दानी</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">
              {formatNPR(stats.totalSalesRevenue, true)}
            </div>
            <p className="text-[11px] font-semibold text-emerald-600 mt-0.5">
              आजको बिक्री: {formatNPR(stats.todaySalesRevenue, true)}
            </p>
          </div>
        </div>

        {/* Stock Valuation */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">भण्डार सामानको मूल्य</span>
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Boxes className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">
              {formatNPR(stats.totalStockValue, true)}
            </div>
            <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
              मल तथा बीउबिजन मौज्दात
            </p>
          </div>
        </div>

        {/* Total Dues / Credit */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">उठाउन बाँकी उधारो</span>
            <div className="w-9 h-9 rounded-xl bg-red-100 text-red-700 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-red-600">
              {formatNPR(stats.totalDuesOutstanding, true)}
            </div>
            <p className="text-[11px] font-semibold text-red-500 mt-0.5">
              {toDevanagari(stats.customersWithDues)} जना कृषकको बाँकी
            </p>
          </div>
        </div>

        {/* Service Commissions */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">सेवा कमिसन नाफा</span>
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">
              {formatNPR(stats.totalServiceCommissions, true)}
            </div>
            <p className="text-[11px] font-semibold text-amber-600 mt-0.5">
              इ-सेवा / विद्युत / मनी ट्रान्सफर / फोटोकपी
            </p>
          </div>
        </div>
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 7 Days Revenue Trend */}
        <div className="lg:col-span-2 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">
                पछिल्लो ७ दिनको दैनिक बिक्री प्रवृत्ति (Daily Sales Trend)
              </h3>
              <p className="text-xs text-slate-500">मलखाद बिक्री तथा सेवा कमिसनको दैनिक विश्लेषण</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.salesTrend || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val) => [`रु. ${Number(val).toLocaleString()}`, 'रकम']}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#salesGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">
              धेरै बिक्री भएका मलखाद (Top Products)
            </h3>
            <p className="text-xs text-slate-500">आम्दानीको आधारमा उत्कृष्ट उत्पादन</p>
          </div>

          <div className="space-y-3">
            {(charts.topProducts || []).map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="text-xs font-bold text-slate-800 truncate max-w-[140px]">{item.name}</p>
                    <p className="text-[10px] text-slate-500">{toDevanagari(item.quantity)} परिमाण बिक्री</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-extrabold text-emerald-700">{formatNPR(item.revenue, true)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Low Stock Warning & Recent Bills Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Low Stock Warnings */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5 text-amber-600">
              <AlertTriangle className="w-4 h-4" />
              <span>न्यून मौज्दात सचेतना (Low Stock Alerts)</span>
            </h3>
            <NavLink to="/inventory" className="text-xs font-bold text-emerald-600 hover:underline">
              सबै हेर्नुहोस्
            </NavLink>
          </div>

          <div className="space-y-2.5">
            {lowStockAlerts.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">सबै सामान पर्याप्त मौज्दातमा छ ।</p>
            ) : (
              lowStockAlerts.map((prod) => (
                <div key={prod._id} className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900">{prod.name}</p>
                    <p className="text-[10px] text-amber-700 font-semibold">
                      पुन: अर्डर बिन्दु: {toDevanagari(prod.reorderLevel)} {prod.unit}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="bg-amber-500 text-white text-xs font-extrabold px-2.5 py-1 rounded-lg">
                      बाँकी: {toDevanagari(prod.currentStock)} {prod.unit}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Bills Table */}
        <div className="lg:col-span-2 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900">
              हालै जारी गरिएका बिलहरू (Recent Sales Bills)
            </h3>
            <NavLink to="/billing" className="text-xs font-bold text-emerald-600 hover:underline">
              सबै बिल सूची &rarr;
            </NavLink>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                  <th className="py-2.5 px-3">बिल नं.</th>
                  <th className="py-2.5 px-3">क्रेताको नाम</th>
                  <th className="py-2.5 px-3">मिति</th>
                  <th className="py-2.5 px-3 text-right">रकम</th>
                  <th className="py-2.5 px-3 text-center">अवस्था</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentBills.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50 transition">
                    <td className="py-2.5 px-3 font-bold font-mono text-emerald-700">
                      #{toDevanagari(b.billNo) || b.billNo}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{b.buyerName}</td>
                    <td className="py-2.5 px-3 text-slate-500">{b.nepaliDate}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                      {formatNPR(b.totalAmount, true)}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        b.status === 'paid' ? 'bg-emerald-100 text-emerald-800' :
                        b.status === 'partial' ? 'bg-amber-100 text-amber-800' :
                        b.status === 'due' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {b.status === 'paid' ? 'चुक्ता' : b.status === 'partial' ? 'आंशिक' : b.status === 'due' ? 'उधारो' : 'रद्द'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
