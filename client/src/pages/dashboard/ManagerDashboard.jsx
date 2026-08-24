import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import api from '../../api/axiosInstance';
import { useLanguage } from '../../context/LanguageContext';
import { toDevanagari, formatNPR } from '../../utils/nepaliConverter';
import {
  Boxes,
  TrendingUp,
  Receipt,
  CreditCard,
  AlertTriangle,
  PlusCircle,
  FileSpreadsheet,
  ArrowDownToLine
} from 'lucide-react';

export const ManagerDashboard = () => {
  const { t } = useLanguage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/reports/manager-dashboard');
      if (res.data.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Error loading manager dashboard:', err);
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

  const inventorySummary = data?.inventorySummary || {};
  const todayActivity = data?.todayActivity || {};
  const duesOverview = data?.duesOverview || {};

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 text-white shadow-xl">
        <div>
          <span className="bg-blue-500/30 text-blue-300 text-xs font-bold px-3 py-1 rounded-full border border-blue-400/30 uppercase tracking-wider">
            व्यवस्थापक नियन्त्रण कक्ष (Manager Portal)
          </span>
          <h2 className="text-2xl font-extrabold mt-2 tracking-tight">
            भण्डार तथा मल बिक्री सुपरिवेक्षण
          </h2>
          <p className="text-xs text-blue-100/80 mt-1">
            मौज्दात स्तर, कृषक विवरण र दैनिक बिक्री रजिस्टरको प्रत्यक्ष निगरानी
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <NavLink
            to="/inventory"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-lg transition flex items-center gap-2"
          >
            <ArrowDownToLine className="w-4 h-4" />
            <span>+ नयाँ मौज्दात दाखिला (Stock In)</span>
          </NavLink>
          <NavLink
            to="/register"
            className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs py-2.5 px-4 rounded-xl backdrop-blur-md transition flex items-center gap-2 border border-white/20"
          >
            <FileSpreadsheet className="w-4 h-4 text-blue-400" />
            <span>अनुसूची-३ रजिस्टर</span>
          </NavLink>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Today's Sales */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">आजको कुल बिक्री</span>
          <div className="text-2xl font-extrabold text-slate-900">
            {formatNPR(todayActivity.todaySales, true)}
          </div>
          <p className="text-xs font-semibold text-emerald-600">
            आज जारी बिल संख्या: {toDevanagari(todayActivity.todayBillsCount || 0)}
          </p>
        </div>

        {/* Total Products in Catalog */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">कुल मलखाद/बीउ उत्पादन</span>
          <div className="text-2xl font-extrabold text-slate-900">
            {toDevanagari(inventorySummary.totalProducts || 0)} वटा
          </div>
          <p className="text-xs font-semibold text-blue-600">
            डीएपी, युरिया, पोटास, जिंक, बीउबिजन
          </p>
        </div>

        {/* Outstanding Dues */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">कृषकहरूको कुल बाँकी उधारो</span>
          <div className="text-2xl font-extrabold text-red-600">
            {formatNPR(duesOverview.totalDue, true)}
          </div>
          <p className="text-xs font-semibold text-red-500">
            {toDevanagari(duesOverview.farmersCount || 0)} जना कृषकहरू
          </p>
        </div>
      </div>

      {/* Inventory Health & Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Attention */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2 text-amber-600">
              <AlertTriangle className="w-5 h-5" />
              <span>तत्काल पुनः खरिद गर्नुपर्ने मलखाद (Reorder Required)</span>
            </h3>
            <NavLink to="/inventory" className="text-xs font-bold text-blue-600 hover:underline">
              भण्डार व्यवस्थापन &rarr;
            </NavLink>
          </div>

          <div className="space-y-3">
            {(inventorySummary.lowStockList || []).map((prod) => (
              <div key={prod._id} className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{prod.name}</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    दर: {formatNPR(prod.pricePerUnit, true)} / {prod.unit}
                  </p>
                </div>
                <div className="text-right">
                  <span className="bg-amber-600 text-white font-extrabold text-xs px-3 py-1.5 rounded-xl shadow-xs">
                    मौज्दात: {toDevanagari(prod.currentStock)} {prod.unit}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Sales Activities */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900">
              आजको काउन्टर बिक्री कारोबार (Today's Transactions)
            </h3>
            <NavLink to="/billing" className="text-xs font-bold text-blue-600 hover:underline">
              सबै बिल हेर्नुहोस् &rarr;
            </NavLink>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                  <th className="py-2.5 px-3">बिल नं.</th>
                  <th className="py-2.5 px-3">कृषक</th>
                  <th className="py-2.5 px-3 text-right">रकम</th>
                  <th className="py-2.5 px-3 text-center">जारीकर्ता</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(todayActivity.bills || []).map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-bold font-mono text-blue-700">
                      #{toDevanagari(b.billNo) || b.billNo}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{b.buyerName}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900">{formatNPR(b.totalAmount, true)}</td>
                    <td className="py-2.5 px-3 text-center text-slate-500">{b.createdBy?.name || 'Staff'}</td>
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
