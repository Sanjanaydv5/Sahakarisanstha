import React, { useState, useEffect } from 'react';
import api from '../../api/axiosInstance';
import { useLanguage } from '../../context/LanguageContext';
import { toDevanagari, formatNPR } from '../../utils/nepaliConverter';
import {
  Users,
  UserPlus,
  Search,
  Phone,
  MapPin,
  CreditCard,
  History,
  X,
  Save,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export const CustomersPage = () => {
  const { t } = useLanguage();

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [hasDuesOnly, setHasDuesOnly] = useState(false);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [name, setName] = useState('');
  const [idCardNo, setIdCardNo] = useState('');
  const [address, setAddress] = useState('लोहारपट्टी-२, मधेपुरा (महोत्तरी)');
  const [phone, setPhone] = useState('');
  const [area, setArea] = useState('५ कठ्ठा');
  const [cropType, setCropType] = useState('धान / गहुँ');
  const [notes, setNotes] = useState('');
  const [modalLoading, setModalLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, [search, hasDuesOnly]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (hasDuesOnly) params.hasDues = 'true';

      const res = await api.get('/customers', { params });
      if (res.data.success) {
        setCustomers(res.data.customers || []);
      }
    } catch (err) {
      console.error('Error loading customers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingCustomer(null);
    setName('');
    setIdCardNo('');
    setAddress('लोहारपट्टी-२, मधेपुरा (महोत्तरी)');
    setPhone('');
    setArea('५ कठ्ठा');
    setCropType('धान / गहुँ');
    setNotes('');
    setError('');
    setShowModal(true);
  };

  const handleOpenEdit = (c) => {
    setEditingCustomer(c);
    setName(c.name);
    setIdCardNo(c.idCardNo || '');
    setAddress(c.address || 'लोहारपट्टी-२, मधेपुरा (महोत्तरी)');
    setPhone(c.phone || '');
    setArea(c.area || '५ कठ्ठा');
    setCropType(c.cropType || 'धान / गहुँ');
    setNotes(c.notes || '');
    setError('');
    setShowModal(true);
  };

  const handleSubmitCustomer = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setModalLoading(true);
      setError('');
      const payload = { name, idCardNo, address, phone, area, cropType, notes };

      if (editingCustomer) {
        await api.put(`/customers/${editingCustomer._id}`, payload);
      } else {
        await api.post('/customers', payload);
      }

      setShowModal(false);
      fetchCustomers();
    } catch (err) {
      setError(err.response?.data?.message || 'कृषक विवरण सुरक्षित गर्न सकिएन');
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-600" />
            <span>कृषक तथा ग्राहकहरूको सूची (Farmers Directory)</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            सहकारीमा दर्ता भएका सम्पूर्ण कृषक, जग्गाको क्षेत्रफल र कारोबार स्थिति
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md transition flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ नयाँ कृषक थप्नुहोस् (Add Farmer)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="कृषकको नाम, फोन, नागरिकता वा ठेगाना खोज्नुहोस्..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
          <input
            type="checkbox"
            checked={hasDuesOnly}
            onChange={(e) => setHasDuesOnly(e.target.checked)}
            className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
          />
          <span>उधारो बाँकी रहेका मात्र (Dues Only)</span>
        </label>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100/70 text-slate-700 font-bold border-b border-slate-200">
                <th className="py-3 px-4">सि.नं.</th>
                <th className="py-3 px-4">कृषकको नाम</th>
                <th className="py-3 px-4">नागरिकता / परिचय पत्र नं.</th>
                <th className="py-3 px-4">ठेगाना</th>
                <th className="py-3 px-4">फोन नं.</th>
                <th className="py-3 px-4">जग्गा क्षेत्रफल</th>
                <th className="py-3 px-4">बाली</th>
                <th className="py-3 px-4 text-right">कुल खरिद</th>
                <th className="py-3 px-4 text-right">बाँकी उधारो</th>
                <th className="py-3 px-4 text-center">कार्य</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-400">
                    कृषक विवरण लोड हुँदैछ...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-400">
                    कुनै कृषक फेला परेन ।
                  </td>
                </tr>
              ) : (
                customers.map((cust, idx) => (
                  <tr key={cust._id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-bold text-slate-500">{toDevanagari(idx + 1)}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{cust.name}</td>
                    <td className="py-3 px-4 font-mono text-slate-600 text-[11px]">{cust.idCardNo || '—'}</td>
                    <td className="py-3 px-4 text-slate-600">{cust.address}</td>
                    <td className="py-3 px-4 font-mono font-medium text-slate-800">{cust.phone || '—'}</td>
                    <td className="py-3 px-4 font-semibold text-emerald-800">{cust.area || '५ कठ्ठा'}</td>
                    <td className="py-3 px-4 text-slate-600">{cust.cropType || 'धान'}</td>
                    <td className="py-3 px-4 text-right font-extrabold text-slate-900">
                      {formatNPR(cust.totalPurchases || 0, true)}
                    </td>
                    <td className="py-3 px-4 text-right font-extrabold text-red-600">
                      {cust.outstandingBalance > 0 ? formatNPR(cust.outstandingBalance, true) : '०'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleOpenEdit(cust)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 font-bold text-[11px] transition"
                      >
                        सच्याउनुहोस्
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Customer Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-600" />
                <span>{editingCustomer ? 'कृषक विवरण सच्याउनुहोस्' : 'नयाँ कृषक दर्ता (New Farmer)'}</span>
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 text-xs p-3 rounded-xl border border-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmitCustomer} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    कृषकको नाम * (Farmer Name)
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="उदा. राम पुकार साह"
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    सम्पर्क फोन नं. (Contact Phone)
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="98XXXXXXXX"
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    नागरिकता / परिचय पत्र नं. (ID Card No.)
                  </label>
                  <input
                    type="text"
                    value={idCardNo}
                    onChange={(e) => setIdCardNo(e.target.value)}
                    placeholder="१८-०१-७५-०२३४५"
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm font-mono focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    जग्गा क्षेत्रफल (Land Area)
                  </label>
                  <input
                    type="text"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="उदा. १० कठ्ठा"
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ठेगाना (Address)
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="लोहारपट्टी-२, मधेपुरा (महोत्तरी)"
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    खेती गरिने बाली (Main Crops)
                  </label>
                  <input
                    type="text"
                    value={cropType}
                    onChange={(e) => setCropType(e.target.value)}
                    placeholder="उदा. धान, गहुँ, उखु, तरकारी"
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                >
                  रद्द गर्नुहोस्
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="w-1/2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50"
                >
                  {modalLoading ? 'सुरक्षित हुँदैछ...' : 'सुरक्षित गर्नुहोस् (Save)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
