import React, { useState, useEffect } from 'react';
import api from '../../api/axiosInstance';
import { useLanguage } from '../../context/LanguageContext';
import { DistributionRegisterPrint } from '../../components/register/DistributionRegisterPrint';
import {
  FileSpreadsheet,
  Search,
  Filter,
  Download,
  Printer,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';

export const SalesRegisterPage = () => {
  const { t } = useLanguage();
  const [entries, setEntries] = useState([]);
  const [orgSettings, setOrgSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [farmer, setFarmer] = useState('');
  const [fertilizerType, setFertilizerType] = useState('all');
  const [cropType, setCropType] = useState('all');

  useEffect(() => {
    fetchRegister();
  }, [farmer, fertilizerType, cropType]);

  const fetchRegister = async () => {
    try {
      setLoading(true);
      const params = {};
      if (farmer) params.farmer = farmer;
      if (fertilizerType !== 'all') params.fertilizerType = fertilizerType;
      if (cropType !== 'all') params.cropType = cropType;

      const res = await api.get('/register', { params });
      if (res.data.success) {
        setEntries(res.data.entries || []);
        setOrgSettings(res.data.orgSettings || null);
      }
    } catch (err) {
      console.error('Error loading distribution register:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (entries.length === 0) return;

    const headers = [
      'सि.नं.',
      'कृषकको नाम',
      'परिचय पत्र नं.',
      'ठेगाना',
      'सम्पर्क फोन नं.',
      'क्षेत्रफल (रोपनी/कठ्ठा)',
      'मलको प्रकार',
      'परिमाण',
      'एकाइ',
      'बिक्री मूल्य रु.',
      'बिल नं.',
      'बिल मिति (BS)',
      'बालीको प्रकार',
      'चलानी नं.'
    ];

    const rows = entries.map((e, idx) => [
      idx + 1,
      `"${e.farmerName}"`,
      `"${e.idCardNo || ''}"`,
      `"${e.address || ''}"`,
      `"${e.phone || ''}"`,
      `"${e.areaRopaniKatta || ''}"`,
      `"${e.fertilizerType || ''}"`,
      e.quantity,
      `"${e.unit || 'बोरा'}"`,
      e.salePrice,
      e.billNo,
      `"${e.billDateBS || ''}"`,
      `"${e.cropType || ''}"`,
      `"${e.dispatchNo || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `मल_बिक्री_वितरण_अनुसूची_३_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xl shadow-xs">
            <FileSpreadsheet className="w-6 h-6 text-emerald-700" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">
              मलको बिक्री वितरण विवरण (अनुसूची-३)
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              नेपाल सरकार र सहकारी ऐन २०४८ बमोजिमको आधिकारिक रासायनिक मलखाद वितरण खाता
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs py-2 px-3.5 rounded-xl shadow transition flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>CSV डाउनलोड (Excel)</span>
          </button>
          <button
            onClick={() => window.print()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-3.5 rounded-xl shadow transition flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>प्रिन्ट (Print Form 3)</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 no-print">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={farmer}
            onChange={(e) => setFarmer(e.target.value)}
            placeholder="कृषकको नाम, नागरिकता नं. वा फोन खोज्नुहोस्..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={fertilizerType}
            onChange={(e) => setFertilizerType(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">सबै मलखाद (All Fertilizers)</option>
            <option value="डिएपि">डिएपि (DAP)</option>
            <option value="युरिया">युरिया (Urea)</option>
            <option value="पोटास">पोटास (Potash)</option>
            <option value="जिंक">जिंक सल्फेट (Zinc)</option>
          </select>

          <select
            value={cropType}
            onChange={(e) => setCropType(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">सबै बाली (All Crops)</option>
            <option value="धान">धान (Paddy)</option>
            <option value="गहुँ">गहुँ (Wheat)</option>
            <option value="उखु">उखु (Sugarcane)</option>
            <option value="तरकारी">तरकारी (Vegetables)</option>
          </select>
        </div>
      </div>

      {/* Main Form-3 Printable Sheet Component */}
      <DistributionRegisterPrint
        entries={entries}
        orgSettings={orgSettings}
        onPrint={() => window.print()}
        onExportCSV={handleExportCSV}
      />
    </div>
  );
};
