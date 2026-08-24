import React, { useState, useEffect } from 'react';
import api from '../../api/axiosInstance';
import { useLanguage } from '../../context/LanguageContext';
import { toDevanagari, formatNPR, getCurrentBSDateString } from '../../utils/nepaliConverter';
import {
  Zap,
  Smartphone,
  Lightbulb,
  Banknote,
  Copy,
  Printer,
  PlusCircle,
  Search,
  CheckCircle,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

export const ServicesPage = () => {
  const { t } = useLanguage();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serviceTypeFilter, setServiceTypeFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Form State
  const [activeFormType, setActiveFormType] = useState('esewa');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [accountOrConsumerNo, setAccountOrConsumerNo] = useState('');
  const [pagesOrQuantity, setPagesOrQuantity] = useState('1');
  const [amount, setAmount] = useState('');
  const [serviceCharge, setServiceCharge] = useState('10');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, [serviceTypeFilter, search]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const params = {};
      if (serviceTypeFilter !== 'all') params.serviceType = serviceTypeFilter;
      if (search) params.search = search;

      const res = await api.get('/services', { params });
      if (res.data.success) {
        setTransactions(res.data.transactions || []);
      }
    } catch (err) {
      console.error('Error fetching service transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!customerName || amount === '') return;

    try {
      setSubmitting(true);
      setError('');
      const res = await api.post('/services', {
        serviceType: activeFormType,
        customerName,
        customerPhone,
        accountOrConsumerNo,
        pagesOrQuantity: Number(pagesOrQuantity) || 1,
        amount: Number(amount),
        serviceCharge: Number(serviceCharge) || 0,
        notes
      });

      if (res.data.success) {
        setSuccess('सेवा कारोबार सफलतापूर्वक दर्ता गरियो !');
        setCustomerName('');
        setCustomerPhone('');
        setAccountOrConsumerNo('');
        setAmount('');
        setNotes('');
        setTimeout(() => setSuccess(''), 3000);
        fetchTransactions();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'सेवा दर्ता गर्न असफल भयो');
    } finally {
      setSubmitting(false);
    }
  };

  const serviceIcons = {
    esewa: Smartphone,
    electricity: Lightbulb,
    moneyTransfer: Banknote,
    photocopy: Copy,
    printout: Printer
  };

  const totalCollected = transactions.reduce((sum, t) => sum + (t.totalCollected || 0), 0);
  const totalCommissions = transactions.reduce((sum, t) => sum + (t.serviceCharge || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            <span>वित्तीय तथा डिजिटल सेवाहरू (Financial & Utility Services)</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            इ-सेवा, विद्युत महसुल, मनी ट्रान्सफर, फोटोकपी र प्रिन्ट सेवाको दैनिक अभिलेख
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-amber-50 text-amber-900 border border-amber-200 rounded-2xl px-4 py-2 text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider block text-amber-700">कुल सेवा कमिसन</span>
            <span className="text-base font-extrabold">{formatNPR(totalCommissions, true)}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Form, Right Transactions Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Transaction Entry Form */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <PlusCircle className="w-4 h-4 text-emerald-600" />
            <span>नयाँ सेवा प्रविष्टि (Record Service)</span>
          </h3>

          {/* Service Type Switcher Buttons */}
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-2xl">
            {[
              { id: 'esewa', label: 'इ-सेवा', icon: Smartphone },
              { id: 'electricity', label: 'विद्युत', icon: Lightbulb },
              { id: 'moneyTransfer', label: 'रेमिट्यान्स', icon: Banknote },
              { id: 'photocopy', label: 'फोटोकपी', icon: Copy },
              { id: 'printout', label: 'प्रिन्ट आउट', icon: Printer }
            ].map((st) => {
              const Icon = st.icon;
              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => {
                    setActiveFormType(st.id);
                    if (st.id === 'photocopy' || st.id === 'printout') {
                      setServiceCharge('10');
                      setAmount('10');
                    } else {
                      setServiceCharge('20');
                    }
                  }}
                  className={`p-2 rounded-xl text-xs font-bold transition flex flex-col items-center gap-1 ${
                    activeFormType === st.id
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="text-[11px]">{st.label}</span>
                </button>
              );
            })}
          </div>

          {error && <div className="bg-red-50 text-red-700 text-xs p-3 rounded-xl">{error}</div>}
          {success && <div className="bg-emerald-50 text-emerald-700 text-xs p-3 rounded-xl font-bold">{success}</div>}

          <form onSubmit={handleFormSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                सेवाग्राही / ग्राहकको नाम *
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="उदा. श्याम सुन्दर साह"
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm font-semibold"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                सम्पर्क फोन नं.
              </label>
              <input
                type="text"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="98XXXXXXXX"
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {activeFormType === 'esewa' ? 'e-Sewa ID / मोबाइल नं.' :
                 activeFormType === 'electricity' ? 'विद्युत ग्राहक नं. / SC No.' :
                 activeFormType === 'moneyTransfer' ? 'कन्ट्रोल नं. / MTCN' : 'प्रति संख्या / विवरण'}
              </label>
              <input
                type="text"
                value={accountOrConsumerNo}
                onChange={(e) => setAccountOrConsumerNo(e.target.value)}
                placeholder="विवरण वा टोकन प्रविष्ट गर्नुहोस्..."
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  कारोबार रकम (Amount रु.) *
                </label>
                <input
                  type="number"
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="रु."
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm font-extrabold text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  सेवा शुल्क / कमिसन (Fee रु.)
                </label>
                <input
                  type="number"
                  min="0"
                  value={serviceCharge}
                  onChange={(e) => setServiceCharge(e.target.value)}
                  placeholder="रु."
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm font-bold text-emerald-700"
                />
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex justify-between items-center text-xs font-bold text-emerald-950">
              <span>ग्राहकबाट प्राप्त नगद:</span>
              <span className="text-base font-extrabold text-emerald-800">
                {formatNPR((Number(amount) || 0) + (Number(serviceCharge) || 0), true)}
              </span>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition disabled:opacity-50"
            >
              {submitting ? 'दर्ता हुँदैछ...' : 'सेवा कारोबार दर्ता गर्नुहोस्'}
            </button>
          </form>
        </div>

        {/* Transactions Register Table */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-sm text-slate-900">
              सेवा कारोबार अभिलेख खाता (Services Ledger)
            </h3>

            <div className="flex items-center gap-2">
              <select
                value={serviceTypeFilter}
                onChange={(e) => setServiceTypeFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold"
              >
                <option value="all">सबै सेवाहरू (All)</option>
                <option value="esewa">इ-सेवा (e-Sewa)</option>
                <option value="electricity">विद्युत (NEA)</option>
                <option value="moneyTransfer">रेमिट्यान्स</option>
                <option value="photocopy">फोटोकपी</option>
                <option value="printout">प्रिन्ट</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="py-3 px-3">मिति (B.S.)</th>
                  <th className="py-3 px-3">सेवाको प्रकार</th>
                  <th className="py-3 px-3">सेवाग्राहीको नाम</th>
                  <th className="py-3 px-3">खाता / SC No.</th>
                  <th className="py-3 px-3 text-right">रकम रु.</th>
                  <th className="py-3 px-3 text-right">कमिसन</th>
                  <th className="py-3 px-3 text-center">दर्ता गर्ने</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      कुनै सेवा कारोबार फेला परेन ।
                    </td>
                  </tr>
                ) : (
                  transactions.map((txn) => (
                    <tr key={txn._id} className="hover:bg-slate-50">
                      <td className="py-3 px-3 text-slate-600 font-medium">{txn.nepaliDate}</td>
                      <td className="py-3 px-3 font-bold text-slate-800 uppercase text-[10px]">
                        <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                          {txn.serviceType}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-900">
                        {txn.customerName}
                        <span className="block text-[10px] text-slate-500 font-normal">{txn.customerPhone}</span>
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-600 text-[11px]">
                        {txn.accountOrConsumerNo || '—'}
                      </td>
                      <td className="py-3 px-3 text-right font-extrabold text-slate-900">
                        {formatNPR(txn.amount, true)}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-emerald-600">
                        +{formatNPR(txn.serviceCharge, true)}
                      </td>
                      <td className="py-3 px-3 text-center text-slate-500">{txn.createdBy?.name || 'Staff'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
