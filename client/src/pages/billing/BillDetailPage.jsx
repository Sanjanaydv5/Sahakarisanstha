import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';
import { BillVoucherPrint } from '../../components/billing/BillVoucherPrint';
import { ArrowLeft, Printer, AlertCircle } from 'lucide-react';

export const BillDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [bill, setBill] = useState(null);
  const [orgSettings, setOrgSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBill();
  }, [id]);

  const fetchBill = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/bills/${id}`);
      if (res.data.success) {
        setBill(res.data.bill);
        setOrgSettings(res.data.orgSettings);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'बिल लोड गर्न असफल भयो ।');
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

  if (error || !bill) {
    return (
      <div className="bg-red-50 p-6 rounded-3xl border border-red-200 text-center space-y-3">
        <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
        <h3 className="text-base font-bold text-red-800">{error || 'बिल फेला परेन'}</h3>
        <button
          onClick={() => navigate('/billing')}
          className="bg-red-600 text-white font-bold text-xs py-2 px-4 rounded-xl shadow"
        >
          बिल सूचीमा फर्कनुहोस्
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Navigation & Controls */}
      <div className="flex items-center justify-between no-print">
        <button
          onClick={() => navigate('/billing')}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>बिल सूचीमा फर्कनुहोस् (Back to Bills)</span>
        </button>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-4 rounded-xl shadow-md transition"
        >
          <Printer className="w-4 h-4" />
          <span>भौचर प्रिन्ट गर्नुहोस् (Print)</span>
        </button>
      </div>

      {/* Printable Physical Voucher Replica */}
      <BillVoucherPrint bill={bill} orgSettings={orgSettings} onPrint={() => window.print()} />
    </div>
  );
};
