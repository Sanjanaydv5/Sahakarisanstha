import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import api from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { toDevanagari, formatNPR } from '../../utils/nepaliConverter';
import {
  PlusCircle,
  Receipt,
  Search,
  Printer,
  Ban,
  Eye,
  Calendar,
  CreditCard,
  AlertCircle
} from 'lucide-react';

export const BillingPage = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');

  // Voiding modal state
  const [voidingBill, setVoidingBill] = useState(null);
  const [voidReason, setVoidReason] = useState('');
  const [voidLoading, setVoidLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBills();
  }, [search, statusFilter, paymentFilter]);

  const fetchBills = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (statusFilter !== 'all') params.status = statusFilter;
      if (paymentFilter !== 'all') params.paymentMethod = paymentFilter;

      const res = await api.get('/bills', { params });
      if (res.data.success) {
        setBills(res.data.bills || []);
      }
    } catch (err) {
      console.error('Error fetching bills:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVoidSubmit = async (e) => {
    e.preventDefault();
    if (!voidReason.trim()) return;

    try {
      setVoidLoading(true);
      setError('');
      const res = await api.put(`/bills/${voidingBill._id}/void`, { reason: voidReason });
      if (res.data.success) {
        setVoidingBill(null);
        setVoidReason('');
        fetchBills();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'बिल रद्द गर्न असफल भयो ।');
    } finally {
      setVoidLoading(false);
    }
  };

  const canVoid = ['admin', 'manager'].includes(user?.role);

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-emerald-600" />
            <span>बिक्री बिलहरूको सूची (Sales Bills Register)</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            जारी गरिएका सबै भौतिक भौचर र रसिदहरूको अभिलेख
          </p>
        </div>

        <NavLink
          to="/billing/new"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md transition flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ नयाँ बिल काट्नुहोस् (New Bill)</span>
        </NavLink>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="बिल नं., कृषकको नाम, फोन वा मिति खोज्नुहोस्..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">सबै अवस्था (All Status)</option>
            <option value="paid">चुक्ता (Paid)</option>
            <option value="partial">आंशिक (Partial)</option>
            <option value="due">उधारो (Due)</option>
            <option value="void">रद्द (Void)</option>
          </select>

          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">सबै भुक्तानी विधि</option>
            <option value="cash">नगद (Cash)</option>
            <option value="credit">उधारो (Credit)</option>
            <option value="cheque">चेक (Cheque)</option>
          </select>
        </div>
      </div>

      {/* Bills Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100/70 text-slate-700 font-bold border-b border-slate-200">
                <th className="py-3 px-4">बिल नं.</th>
                <th className="py-3 px-4">मिति (B.S.)</th>
                <th className="py-3 px-4">क्रेता / कृषकको नाम</th>
                <th className="py-3 px-4">सम्पर्क फोन</th>
                <th className="py-3 px-4">भुक्तानी विधि</th>
                <th className="py-3 px-4 text-right">कुल रकम</th>
                <th className="py-3 px-4 text-right">बाँकी</th>
                <th className="py-3 px-4 text-center">अवस्था</th>
                <th className="py-3 px-4 text-center">कार्य</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    बिलहरू लोड हुँदैछ...
                  </td>
                </tr>
              ) : bills.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    कुनै बिल फेला परेन ।
                  </td>
                </tr>
              ) : (
                bills.map((bill) => (
                  <tr key={bill._id} className={`hover:bg-slate-50/80 transition ${bill.status === 'void' ? 'opacity-60 bg-red-50/30' : ''}`}>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-800">
                      #{toDevanagari(bill.billNo) || bill.billNo}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-600">{bill.nepaliDate}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {bill.buyerName}
                      <span className="block text-[10px] font-normal text-slate-500">{bill.buyerAddress}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-mono">{bill.buyerPhone || '—'}</td>
                    <td className="py-3 px-4 capitalize font-semibold text-slate-700">
                      {bill.paymentMethod === 'cash' ? 'नगद' : bill.paymentMethod === 'credit' ? 'उधारो' : bill.paymentMethod}
                    </td>
                    <td className="py-3 px-4 text-right font-extrabold text-slate-900">
                      {formatNPR(bill.totalAmount, true)}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-red-600">
                      {bill.balanceDue > 0 ? formatNPR(bill.balanceDue, true) : '०'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full ${
                        bill.status === 'paid' ? 'bg-emerald-100 text-emerald-800' :
                        bill.status === 'partial' ? 'bg-amber-100 text-amber-800' :
                        bill.status === 'due' ? 'bg-red-100 text-red-800' : 'bg-slate-200 text-slate-600 line-through'
                      }`}>
                        {bill.status === 'paid' ? 'चुक्ता' : bill.status === 'partial' ? 'आंशिक' : bill.status === 'due' ? 'उधारो' : 'रद्द'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <NavLink
                          to={`/billing/${bill._id}`}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 transition"
                          title="भौचर हेर्नुहोस् र प्रिन्ट गर्नुहोस्"
                        >
                          <Eye className="w-4 h-4" />
                        </NavLink>

                        {canVoid && bill.status !== 'void' && (
                          <button
                            onClick={() => setVoidingBill(bill)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-100 text-slate-700 hover:text-red-700 transition"
                            title="बिल रद्द गर्नुहोस् (Void Bill)"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Void Bill Confirmation Modal */}
      {voidingBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center">
                <Ban className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  बिल #{toDevanagari(voidingBill.billNo) || voidingBill.billNo} रद्द गर्नुहोस् (Void Bill)
                </h3>
                <p className="text-xs text-slate-500">
                  यो कार्यले सामानको मौज्दात पुनः भण्डारमा फर्काउनेछ ।
                </p>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 text-xs p-3 rounded-xl border border-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleVoidSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  रद्द गर्नुको अनिवार्य कारण (Reason for Voiding) *
                </label>
                <textarea
                  value={voidReason}
                  onChange={(e) => setVoidReason(e.target.value)}
                  rows={3}
                  placeholder="उदा. सामान फिर्ता भएको वा गलत प्रविष्टि सच्याउन..."
                  className="w-full p-3 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setVoidingBill(null)}
                  className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                >
                  रद्द नगर्नुहोस् (Cancel)
                </button>
                <button
                  type="submit"
                  disabled={voidLoading}
                  className="w-1/2 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50"
                >
                  {voidLoading ? 'रद्द हुँदैछ...' : 'बिल रद्द गर्नुहोस्'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
