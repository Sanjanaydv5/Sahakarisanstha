import React, { useState, useEffect } from 'react';
import api from '../../api/axiosInstance';
import { useLanguage } from '../../context/LanguageContext';
import { toDevanagari, formatNPR, getCurrentBSDateString } from '../../utils/nepaliConverter';
import {
  BarChart3,
  Calendar,
  Wallet,
  Receipt,
  Zap,
  CreditCard,
  Printer,
  Download,
  CheckCircle2,
  DollarSign
} from 'lucide-react';

export const ReportsPage = () => {
  const { t } = useLanguage();

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [closingData, setClosingData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClosing();
  }, [date]);

  const fetchClosing = async () => {
    try {
      setLoading(true);
      const res = await api.get('/reports/daily-closing', { params: { date } });
      if (res.data.success) {
        setClosingData(res.data);
      }
    } catch (err) {
      console.error('Error loading daily closing report:', err);
    } finally {
      setLoading(false);
    }
  };

  const summary = closingData?.summary || {};
  const breakdown = closingData?.breakdown || {};
  const bills = closingData?.bills || [];
  const services = closingData?.services || [];
  const repayments = closingData?.repayments || [];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-600" />
            <span>दैनिक नगद क्लोजिङ तथा वित्तीय प्रतिवेदन (Daily Closing & Reports)</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            दिनभरिको नगद दराज मिलान, मलखाद बिक्री, वित्तीय सेवा र ऋण असुलीको हिसाब
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
            <Calendar className="w-4 h-4 text-slate-400" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 outline-none"
            />
          </div>

          <button
            onClick={() => window.print()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-4 rounded-xl shadow-md transition flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>क्लोजिङ रिपोर्ट प्रिन्ट गर्नुहोस् (Print)</span>
          </button>
        </div>
      </div>

      {/* Main Closing Sheet */}
      <div className="print-area bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
        {/* Printable Header */}
        <div className="text-center border-b-2 border-slate-900 pb-4">
          <h2 className="text-xl font-extrabold text-slate-950 font-devanagari">
            जनता सहयोगी कृषि सहकारी संस्था लिमिटेड
          </h2>
          <p className="text-xs font-bold text-slate-700 mt-0.5">
            लोहारपट्टी-२, मधेपुरा (महोत्तरी) • स्थायी लेखा नं. (PAN): ६१४२५५४०१
          </p>
          <div className="inline-block mt-2 px-4 py-1 bg-slate-100 rounded-lg border border-slate-300">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase">
              दैनिक नगद दराज मिलान प्रतिवेदन (Daily Cash Closing Report)
            </h3>
          </div>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            कारोबार मिति: <strong>{date} ({getCurrentBSDateString()} B.S.)</strong>
          </p>
        </div>

        {/* Total Cash In Hand Banner */}
        <div className="bg-emerald-50 border-2 border-emerald-500 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
              दराजमा हुनुपर्ने कुल नगद रकम (Total Cash In Drawer)
            </span>
            <div className="text-3xl font-extrabold text-emerald-900 mt-1">
              {formatNPR(summary.totalCashInDrawer || 0, true)}
            </div>
          </div>
          <div className="text-xs text-emerald-800 space-y-1 text-right">
            <p>बिक्री बिल: <strong>{toDevanagari(breakdown.billsCount || 0)} वटा</strong></p>
            <p>सेवा कारोबार: <strong>{toDevanagari(breakdown.servicesCount || 0)} पटक</strong></p>
            <p>उधारो असुली: <strong>{toDevanagari(breakdown.repaymentsCount || 0)} रसिद</strong></p>
          </div>
        </div>

        {/* 3 Source Revenue Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase">१. मलखाद बिक्रीबाट नगद</span>
            <p className="text-xl font-extrabold text-slate-900">{formatNPR(summary.cashFromSales, true)}</p>
            <p className="text-[10px] text-slate-500">उधारो बिक्री: {formatNPR(summary.creditFromSales, true)}</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase">२. वित्तीय/डिजिटल सेवाबाट नगद</span>
            <p className="text-xl font-extrabold text-slate-900">{formatNPR(summary.cashFromServices, true)}</p>
            <p className="text-[10px] text-emerald-700 font-bold">सेवा कमिसन नाफा: +{formatNPR(summary.serviceCommissions, true)}</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase">३. पुरानो उधारो असुलीबाट नगद</span>
            <p className="text-xl font-extrabold text-slate-900">{formatNPR(summary.cashFromRepayments, true)}</p>
            <p className="text-[10px] text-slate-500">ऋण तथा किस्ता भुक्तानी</p>
          </div>
        </div>

        {/* Verification Signatures */}
        <div className="pt-8 border-t-2 border-slate-800 grid grid-cols-3 gap-6 text-xs text-center font-semibold">
          <div>
            <div className="h-12 border-b border-dotted border-slate-400"></div>
            <p className="mt-2">तयार गर्ने (लेखापाल / काउन्टर)</p>
          </div>
          <div>
            <div className="h-12 border-b border-dotted border-slate-400"></div>
            <p className="mt-2">जाँच गर्ने (व्यवस्थापक)</p>
          </div>
          <div>
            <div className="h-12 border-b border-dotted border-slate-400"></div>
            <p className="mt-2">प्रमाणित गर्ने (अध्यक्ष)</p>
          </div>
        </div>
      </div>
    </div>
  );
};
