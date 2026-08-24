import React, { useState, useEffect } from 'react';
import api from '../../api/axiosInstance';
import { useLanguage } from '../../context/LanguageContext';
import {
  Settings,
  Save,
  CheckCircle,
  Building,
  Phone,
  Hash,
  Calendar,
  AlertCircle
} from 'lucide-react';

export const SettingsPage = () => {
  const { t } = useLanguage();

  const [settings, setSettings] = useState(null);
  const [nameNepali, setNameNepali] = useState('');
  const [nameEnglish, setNameEnglish] = useState('');
  const [addressNepali, setAddressNepali] = useState('');
  const [addressEnglish, setAddressEnglish] = useState('');
  const [phones, setPhones] = useState('');
  const [registrationNo, setRegistrationNo] = useState('');
  const [panNo, setPanNo] = useState('');
  const [establishedYearBS, setEstablishedYearBS] = useState('२०६७');
  const [establishedUnder, setEstablishedUnder] = useState('सहकारी ऐन २०४८ नियम २०४९ अन्तर्गत स्थापित');
  const [nextBillNumber, setNextBillNumber] = useState(251);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/settings');
      if (res.data.success) {
        const s = res.data.settings || {};
        setSettings(s);
        setNameNepali(s.nameNepali || 'जनता सहयोगी कृषि सहकारी संस्था लिमिटेड');
        setNameEnglish(s.nameEnglish || 'Janata Sahayogi Krishi Sahakari Sanstha Limited');
        setAddressNepali(s.addressNepali || 'लोहारपट्टी-२, मधेपुरा (महोत्तरी)');
        setAddressEnglish(s.addressEnglish || 'Lohaspatti-2, Madhepura, Mahottari');
        setPhones(s.phones?.join(', ') || '9844111621, 9814850746');
        setRegistrationNo(s.registrationNo || '६८८/०६७/०६८');
        setPanNo(s.panNo || '६१४२५५४०१');
        setEstablishedYearBS(s.establishedYearBS || '२०६७');
        setEstablishedUnder(s.establishedUnder || 'सहकारी ऐन २०४८ नियम २०४९ अन्तर्गत स्थापित');
        setNextBillNumber(s.nextBillNumber || 251);
      }
    } catch (err) {
      console.error('Error loading settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const phoneArray = phones.split(',').map(p => p.trim()).filter(Boolean);

      const res = await api.put('/settings', {
        nameNepali,
        nameEnglish,
        addressNepali,
        addressEnglish,
        phones: phoneArray,
        registrationNo,
        panNo,
        establishedYearBS,
        establishedUnder,
        nextBillNumber: Number(nextBillNumber)
      });

      if (res.data.success) {
        setSuccess('संस्थाको सेटिङ तथा विवरण सफलतापूर्वक अद्यावधिक गरियो !');
        setTimeout(() => setSuccess(''), 3500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'सेटिङ सुरक्षित गर्न सकिएन');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-emerald-600" />
            <span>सहकारी संस्था सेटिङ (Organization Settings)</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            भौतिक बिल, लेटरप्याड र दर्ता प्रमाणपत्र विवरणहरू सम्पादन गर्नुहोस्
          </p>
        </div>
      </div>

      {success && (
        <div className="bg-emerald-50 text-emerald-800 text-xs p-4 rounded-2xl border border-emerald-200 flex items-center gap-2.5 font-bold">
          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-700 text-xs p-4 rounded-2xl border border-red-200 flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6 text-xs">
        {/* Basic Organization Details */}
        <div className="space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-2">
            १. सहकारी संस्थाको नाम र ठेगाना (Legal Details)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                संस्थाको नाम (नेपालीमा) *
              </label>
              <input
                type="text"
                value={nameNepali}
                onChange={(e) => setNameNepali(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Organization Name (in English) *
              </label>
              <input
                type="text"
                value={nameEnglish}
                onChange={(e) => setNameEnglish(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                ठेगाना (नेपालीमा) *
              </label>
              <input
                type="text"
                value={addressNepali}
                onChange={(e) => setAddressNepali(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Address (in English) *
              </label>
              <input
                type="text"
                value={addressEnglish}
                onChange={(e) => setAddressEnglish(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Legal Identifiers */}
        <div className="space-y-4 pt-2 border-t border-slate-100">
          <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-2">
            २. दर्ता प्रमाणपत्र र कर विवरण (Registration & PAN)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                स्थायी लेखा नम्बर (PAN No.) *
              </label>
              <input
                type="text"
                value={panNo}
                onChange={(e) => setPanNo(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-mono font-bold"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                प्रमाणपत्र दर्ता नं. (Reg No.) *
              </label>
              <input
                type="text"
                value={registrationNo}
                onChange={(e) => setRegistrationNo(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-mono font-bold"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                स्थापना वर्ष (Estd Year B.S.)
              </label>
              <input
                type="text"
                value={establishedYearBS}
                onChange={(e) => setEstablishedYearBS(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                सम्पर्क फोन नम्बरहरू (Commas separated)
              </label>
              <input
                type="text"
                value={phones}
                onChange={(e) => setPhones(e.target.value)}
                placeholder="9844111621, 9814850746"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                अर्को जारी हुने बिल नम्बर (Next Bill Sequence No.)
              </label>
              <input
                type="number"
                value={nextBillNumber}
                onChange={(e) => setNextBillNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-mono font-extrabold text-emerald-800"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-3 px-6 rounded-xl shadow-lg transition flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'सुरक्षित हुँदैछ...' : 'सेटिङ अद्यावधिक गर्नुहोस् (Save Settings)'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
