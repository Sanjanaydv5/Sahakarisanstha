import React, { useState, useEffect } from 'react';
import api from '../../api/axiosInstance';
import { useLanguage } from '../../context/LanguageContext';
import { toDevanagari, formatNPR, getCurrentBSDateString } from '../../utils/nepaliConverter';
import {
  CreditCard,
  Search,
  HandCoins,
  History,
  CheckCircle,
  X,
  Printer,
  Calendar,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const DuesPage = () => {
  const { t } = useLanguage();

  const [customers, setCustomers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [activeTab, setActiveTab] = useState('dues'); // 'dues' or 'history'
  const [totalOutstanding, setTotalOutstanding] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Payment Collection Modal State
  const [collectingCustomer, setCollectingCustomer] = useState(null);
  const [amountPaid, setAmountPaid] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [lastPaymentReceipt, setLastPaymentReceipt] = useState(null);

  useEffect(() => {
    fetchDues();
    if (activeTab === 'history') {
      fetchPayments();
    }
  }, [activeTab, search]);

  const fetchDues = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;

      const res = await api.get('/dues', { params });
      if (res.data.success) {
        setCustomers(res.data.customers || []);
        setTotalOutstanding(res.data.totalOutstandingDues || 0);
      }
    } catch (err) {
      console.error('Error loading dues:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPayments = async () => {
    try {
      const res = await api.get('/dues/payments');
      if (res.data.success) {
        setPayments(res.data.payments || []);
      }
    } catch (err) {
      console.error('Error fetching payments:', err);
    }
  };

  const handleOpenCollect = (cust) => {
    setCollectingCustomer(cust);
    setAmountPaid(cust.outstandingBalance || '');
    setPaymentMethod('cash');
    setNotes('');
    setError('');
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!amountPaid || Number(amountPaid) <= 0) return;

    try {
      setSubmitting(true);
      setError('');
      const res = await api.post('/dues/pay', {
        customerId: collectingCustomer._id,
        amountPaid: Number(amountPaid),
        paymentMethod,
        notes
      });

      if (res.data.success) {
        setLastPaymentReceipt(res.data.payment);
        setCollectingCustomer(null);
        confetti({ particleCount: 60, spread: 50 });
        fetchDues();
        if (activeTab === 'history') fetchPayments();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'भुक्तानी प्रविष्टि गर्न असफल भयो');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-red-600" />
            <span>उधारो तथा बाँकी रकम व्यवस्थापन (Credit & Dues Ledger)</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            कृषकहरूबाट असुल गर्न बाँकी रकम र किस्ताबन्दी भुक्तानीको हिसाब
          </p>
        </div>

        <div className="bg-red-50 text-red-900 border border-red-200 rounded-2xl px-5 py-2.5 text-right">
          <span className="text-[10px] font-bold uppercase tracking-wider block text-red-700">
            कुल उठाउन बाँकी उधारो (Total Dues)
          </span>
          <span className="text-xl font-extrabold text-red-700">
            {formatNPR(totalOutstanding, true)}
          </span>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setActiveTab('dues')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'dues' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            बाँकी उधारो खाता (Outstanding Dues)
          </button>
          <button
            onClick={() => {
              setActiveTab('history');
              fetchPayments();
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'history' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>भुक्तानी रसिद इतिहास (Repayment History)</span>
          </button>
        </div>

        {activeTab === 'dues' && (
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="कृषकको नाम वा फोन खोज्नुहोस्..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        )}
      </div>

      {/* Main Table View */}
      {activeTab === 'dues' ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-100/70 text-slate-700 font-bold border-b border-slate-200">
                  <th className="py-3 px-4">सि.नं.</th>
                  <th className="py-3 px-4">कृषकको नाम</th>
                  <th className="py-3 px-4">सम्पर्क फोन</th>
                  <th className="py-3 px-4">ठेगाना</th>
                  <th className="py-3 px-4">जग्गा क्षेत्रफल</th>
                  <th className="py-3 px-4 text-right">कुल खरिद</th>
                  <th className="py-3 px-4 text-right">बाँकी उधारो रकम</th>
                  <th className="py-3 px-4 text-center">कार्य</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      उधारो विवरण लोड हुँदैछ...
                    </td>
                  </tr>
                ) : customers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-emerald-600 font-bold">
                      ✓ बधाई छ ! हाल कुनै पनि कृषकको उधारो बाँकी छैन ।
                    </td>
                  </tr>
                ) : (
                  customers.map((cust, idx) => (
                    <tr key={cust._id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4 font-bold text-slate-500">{toDevanagari(idx + 1)}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{cust.name}</td>
                      <td className="py-3 px-4 font-mono font-medium text-slate-700">{cust.phone || '—'}</td>
                      <td className="py-3 px-4 text-slate-600">{cust.address}</td>
                      <td className="py-3 px-4 font-semibold text-emerald-800">{cust.area || '—'}</td>
                      <td className="py-3 px-4 text-right font-medium text-slate-700">
                        {formatNPR(cust.totalPurchases || 0, true)}
                      </td>
                      <td className="py-3 px-4 text-right font-extrabold text-sm text-red-600">
                        {formatNPR(cust.outstandingBalance, true)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleOpenCollect(cust)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-1.5 px-3 rounded-xl shadow-xs transition flex items-center gap-1.5 mx-auto"
                        >
                          <HandCoins className="w-3.5 h-3.5" />
                          <span>रकम भुक्तानी लिनुहोस्</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Payment History Table */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="py-3 px-4">रसिद नं.</th>
                  <th className="py-3 px-4">मिति (B.S.)</th>
                  <th className="py-3 px-4">कृषकको नाम</th>
                  <th className="py-3 px-4">भुक्तानी माध्यम</th>
                  <th className="py-3 px-4 text-right">प्राप्त रकम</th>
                  <th className="py-3 px-4 text-right">बाँकी रकम</th>
                  <th className="py-3 px-4">प्राप्तकर्ता</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      कुनै भुक्तानी इतिहास फेला परेन ।
                    </td>
                  </tr>
                ) : (
                  payments.map((p) => (
                    <tr key={p._id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono font-bold text-emerald-800">
                        #{toDevanagari(p.receiptNo)}
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-medium">{p.nepaliDate}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{p.customer?.name || 'कृषक'}</td>
                      <td className="py-3 px-4 capitalize font-semibold text-slate-700">{p.paymentMethod}</td>
                      <td className="py-3 px-4 text-right font-extrabold text-emerald-700">
                        +{formatNPR(p.amountPaid, true)}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-slate-700">
                        {formatNPR(p.remainingDue, true)}
                      </td>
                      <td className="py-3 px-4 text-slate-500">{p.receivedBy?.name || 'Staff'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Collect Payment Modal */}
      {collectingCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <HandCoins className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    उधारो भुक्तानी रसिद (Collect Payment)
                  </h3>
                  <p className="text-xs text-slate-500">{collectingCustomer.name}</p>
                </div>
              </div>
              <button
                onClick={() => setCollectingCustomer(null)}
                className="text-slate-400 hover:bg-slate-100 p-1 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && <div className="bg-red-50 text-red-700 text-xs p-3 rounded-xl">{error}</div>}

            <div className="p-3 bg-red-50 rounded-2xl border border-red-200 flex justify-between items-center text-xs">
              <span className="font-bold text-red-900">हाल बाँकी उधारो:</span>
              <span className="font-extrabold text-base text-red-700">
                {formatNPR(collectingCustomer.outstandingBalance, true)}
              </span>
            </div>

            <form onSubmit={handlePaymentSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  अहिले प्राप्त रकम (Amount Paid रु.) *
                </label>
                <input
                  type="number"
                  min="1"
                  max={collectingCustomer.outstandingBalance}
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-base font-extrabold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  भुक्तानीको माध्यम (Method)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['cash', 'esewa', 'bank_transfer'].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPaymentMethod(m)}
                      className={`py-2 rounded-xl text-xs font-bold border transition ${
                        paymentMethod === m
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {m === 'cash' ? 'नगद (Cash)' : m === 'esewa' ? 'इ-सेवा' : 'बैंक'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  कैफियत / टिप्पणी (Notes)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="उदा. किस्ता भुक्तानी"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex justify-between items-center text-xs">
                <span className="font-bold text-slate-600">भुक्तानी पछिको बाँकी रकम:</span>
                <span className="font-extrabold text-slate-900">
                  {formatNPR(Math.max(0, collectingCustomer.outstandingBalance - (Number(amountPaid) || 0)), true)}
                </span>
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCollectingCustomer(null)}
                  className="w-1/2 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  रद्द गर्नुहोस्
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-1/2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition disabled:opacity-50"
                >
                  {submitting ? 'प्रविष्टि हुँदैछ...' : 'रकम बुझिलिनुहोस् (Collect)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
