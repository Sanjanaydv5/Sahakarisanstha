import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';
import { useLanguage } from '../../context/LanguageContext';
import { toDevanagari, formatNPR, numberToWordsNepali, getCurrentBSDateString } from '../../utils/nepaliConverter';
import { BillVoucherPrint } from '../../components/billing/BillVoucherPrint';
import {
  Plus,
  Trash2,
  Printer,
  Save,
  User,
  Phone,
  MapPin,
  CreditCard,
  Sparkles,
  Search,
  CheckCircle,
  AlertCircle,
  Eye,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const NewBillPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Products and Customers for quick selection
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orgSettings, setOrgSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [buyerAddress, setBuyerAddress] = useState('लोहारपट्टी-२, मधेपुरा (महोत्तरी)');
  const [buyerIdCardNo, setBuyerIdCardNo] = useState('');
  const [areaRopaniKatta, setAreaRopaniKatta] = useState('५ कठ्ठा');
  const [cropType, setCropType] = useState('धान / गहुँ');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [advancePaid, setAdvancePaid] = useState('');
  const [notes, setNotes] = useState('');

  // Line items
  const [items, setItems] = useState([
    { product: '', description: '', quantity: 1, unit: 'बोरा', rate: 0, amount: 0 }
  ]);

  // UI state
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [createdBill, setCreatedBill] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [prodRes, custRes, setRes] = useState();
      const res1 = await api.get('/products');
      const res2 = await api.get('/customers');
      const res3 = await api.get('/settings');

      if (res1.data.success) setProducts(res1.data.products || []);
      if (res2.data.success) setCustomers(res2.data.customers || []);
      if (res3.data.success) setOrgSettings(res3.data.settings || null);
    } catch (err) {
      console.error('Error loading initial billing data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Farmer Auto-fill handler
  const handleSelectCustomer = (customerId) => {
    const cust = customers.find(c => c._id === customerId);
    if (cust) {
      setBuyerName(cust.name);
      setBuyerPhone(cust.phone || '');
      setBuyerAddress(cust.address || 'लोहारपट्टी-२, मधेपुरा (महोत्तरी)');
      setBuyerIdCardNo(cust.idCardNo || '');
      setAreaRopaniKatta(cust.area || '५ कठ्ठा');
      setCropType(cust.cropType || 'धान / गहुँ');
    }
  };

  // Product Selection handler
  const handleProductSelect = (index, productId) => {
    const prod = products.find(p => p._id === productId);
    const newItems = [...items];
    if (prod) {
      newItems[index] = {
        product: prod._id,
        description: prod.name,
        quantity: 1,
        unit: prod.unit || 'बोरा',
        rate: prod.pricePerUnit,
        amount: prod.pricePerUnit * 1
      };
    } else {
      newItems[index] = { product: '', description: '', quantity: 1, unit: 'बोरा', rate: 0, amount: 0 };
    }
    setItems(newItems);
  };

  // Item field change
  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;

    if (field === 'quantity' || field === 'rate') {
      const qty = Number(newItems[index].quantity) || 0;
      const rate = Number(newItems[index].rate) || 0;
      newItems[index].amount = qty * rate;
    }
    setItems(newItems);
  };

  // Add Item Row
  const handleAddItem = () => {
    setItems([...items, { product: '', description: '', quantity: 1, unit: 'बोरा', rate: 0, amount: 0 }]);
  };

  // Remove Item Row
  const handleRemoveItem = (index) => {
    if (items.length === 1) return;
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  // Calculations
  const grandTotal = items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const advance = advancePaid === '' ? (paymentMethod === 'credit' ? 0 : grandTotal) : Number(advancePaid);
  const balanceDue = Math.max(0, grandTotal - advance);
  const wordsInNepali = numberToWordsNepali(grandTotal);

  // Submit Bill
  const handleSubmitBill = async (e) => {
    if (e) e.preventDefault();
    if (!buyerName.trim()) {
      setError('कृपया क्रेता वा कृषकको नाम प्रविष्ट गर्नुहोस् ।');
      return;
    }

    const validItems = items.filter(it => it.description.trim() && it.quantity > 0);
    if (validItems.length === 0) {
      setError('कम्तीमा एक मलखाद वा सामानको विवरण प्रविष्ट गर्नुहोस् ।');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      const payload = {
        buyerName,
        buyerAddress,
        buyerPhone,
        buyerIdCardNo,
        areaRopaniKatta,
        cropType,
        paymentMethod,
        items: validItems,
        advancePaid: advance,
        notes
      };

      const res = await api.post('/bills', payload);
      if (res.data.success) {
        setCreatedBill(res.data.bill);
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'बिल तयार गर्न असफल भयो । मौज्दात वा इनपुट जाँच गर्नुहोस् ।');
    } finally {
      setSubmitting(false);
    }
  };

  // Success View after generating bill
  if (createdBill) {
    return (
      <div className="space-y-6">
        <div className="bg-emerald-600 rounded-3xl p-6 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 no-print">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white text-emerald-600 flex items-center justify-center font-bold text-2xl shadow-md">
              ✓
            </div>
            <div>
              <h2 className="text-xl font-extrabold">
                बिल #{toDevanagari(createdBill.billNo) || createdBill.billNo} सफलतापूर्वक जारी गरियो !
              </h2>
              <p className="text-xs text-emerald-100 mt-0.5">
                भौचर प्रिन्ट गर्नुहोस् वा नयाँ बिल काट्नुहोस्
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="bg-white text-emerald-900 hover:bg-emerald-50 font-extrabold text-xs py-2.5 px-4 rounded-xl shadow transition flex items-center gap-2"
            >
              <Printer className="w-4 h-4 text-emerald-600" />
              <span>प्रिन्ट गर्नुहोस् (Print)</span>
            </button>
            <button
              onClick={() => {
                setCreatedBill(null);
                setBuyerName('');
                setBuyerPhone('');
                setAdvancePaid('');
                setItems([{ product: '', description: '', quantity: 1, unit: 'बोरा', rate: 0, amount: 0 }]);
              }}
              className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition"
            >
              + अर्को बिल काट्नुहोस्
            </button>
          </div>
        </div>

        {/* Printable Physical Yellow Voucher */}
        <BillVoucherPrint bill={createdBill} orgSettings={orgSettings} onPrint={() => window.print()} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">
              काउन्टर बिलिङ डेस्क (New Sales Bill)
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              मलखाद, रासायनिक मल र बीउबिजनको आधिकारिक बिक्री बिल
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-slate-100 text-slate-700 font-bold px-3 py-1.5 rounded-xl border border-slate-200">
            मिति: {getCurrentBSDateString()} (B.S.)
          </span>
          <span className="text-xs bg-emerald-50 text-emerald-800 font-extrabold px-3 py-1.5 rounded-xl border border-emerald-200">
            अर्को बिल नं.: #{toDevanagari(orgSettings?.nextBillNumber || 251)}
          </span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 text-xs p-4 rounded-2xl border border-red-200 flex items-center gap-2.5 animate-shake">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <span className="font-semibold">{error}</span>
        </div>
      )}

      {/* Main Billing Form */}
      <form onSubmit={handleSubmitBill} className="space-y-6">
        {/* Buyer / Farmer Information Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-600" />
              <span>१. क्रेता / कृषकको विवरण (Buyer / Farmer Details)</span>
            </h3>

            {/* Registered Farmer Quick Selector */}
            {customers.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">दर्ता भएका कृषक:</span>
                <select
                  onChange={(e) => handleSelectCustomer(e.target.value)}
                  defaultValue=""
                  className="text-xs bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">-- कृषक छान्नुहोस् (Auto-Fill) --</option>
                  {customers.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name} ({c.phone || c.area || 'मधेपुरा'})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                क्रेता/कृषकको नाम * (Buyer Name)
              </label>
              <input
                type="text"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                placeholder="उदा. राम सेवक यादव"
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                सम्पर्क मोबाइल नं. (Contact Mobile)
              </label>
              <input
                type="text"
                value={buyerPhone}
                onChange={(e) => setBuyerPhone(e.target.value)}
                placeholder="98XXXXXXXX"
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ठेगाना (Address)
              </label>
              <input
                type="text"
                value={buyerAddress}
                onChange={(e) => setBuyerAddress(e.target.value)}
                placeholder="लोहारपट्टी-२, मधेपुरा"
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                परिचय पत्र नं. / नागरिकता नं. (ID / Citizenship)
              </label>
              <input
                type="text"
                value={buyerIdCardNo}
                onChange={(e) => setBuyerIdCardNo(e.target.value)}
                placeholder="१८-०१-७५-०२३४५"
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                जग्गा क्षेत्रफल (Land Area: कठ्ठा/रोपनी)
              </label>
              <input
                type="text"
                value={areaRopaniKatta}
                onChange={(e) => setAreaRopaniKatta(e.target.value)}
                placeholder="उदा. ५ कठ्ठा"
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                लगाइने बाली (Crop Type)
              </label>
              <input
                type="text"
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
                placeholder="उदा. धान, गहुँ, उखु"
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Line Items Table Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-extrabold text-slate-900">
              २. मलखाद तथा सामान विवरण (Line Items & Quantities)
            </h3>
            <button
              type="button"
              onClick={handleAddItem}
              className="bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold text-xs px-3 py-1.5 rounded-xl border border-emerald-300 transition flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ थप सामान थप्नुहोस् (Add Row)</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="py-2.5 px-2 w-10 text-center">सि.नं.</th>
                  <th className="py-2.5 px-3 min-w-[200px]">सामान छान्नुहोस् / विवरण</th>
                  <th className="py-2.5 px-3 w-28 text-center">परिमाण (Qty)</th>
                  <th className="py-2.5 px-3 w-24">एकाइ (Unit)</th>
                  <th className="py-2.5 px-3 w-28">दर (Rate रु.)</th>
                  <th className="py-2.5 px-3 w-32 text-right">रकम रु. (Total)</th>
                  <th className="py-2.5 px-2 w-10 text-center">हटाउनुहोस्</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70">
                    <td className="py-2.5 px-2 text-center font-bold text-slate-500">
                      {toDevanagari(idx + 1)}
                    </td>

                    <td className="py-2.5 px-3">
                      <div className="space-y-1">
                        <select
                          value={item.product || ''}
                          onChange={(e) => handleProductSelect(idx, e.target.value)}
                          className="w-full text-xs font-semibold bg-white border border-slate-300 rounded-lg p-2 focus:ring-1 focus:ring-emerald-500"
                        >
                          <option value="">-- छिटो छान्नुहोस् (Product) --</option>
                          {products.map((p) => (
                            <option key={p._id} value={p._id}>
                              {p.name} (मौज्दात: {p.currentStock} {p.unit} - रु. {p.pricePerUnit})
                            </option>
                          ))}
                        </select>
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                          placeholder="विवरण (उदा. डिएपि मल)"
                          className="w-full px-2 py-1 border border-slate-200 rounded text-xs"
                          required
                        />
                      </div>
                    </td>

                    <td className="py-2.5 px-3">
                      <input
                        type="number"
                        min="0.1"
                        step="any"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                        className="w-full text-center px-2 py-1.5 border border-slate-300 rounded-lg text-sm font-bold text-slate-900 focus:ring-1 focus:ring-emerald-500"
                        required
                      />
                    </td>

                    <td className="py-2.5 px-3">
                      <input
                        type="text"
                        value={item.unit}
                        onChange={(e) => handleItemChange(idx, 'unit', e.target.value)}
                        className="w-full text-center px-2 py-1.5 border border-slate-300 rounded-lg text-xs font-medium"
                      />
                    </td>

                    <td className="py-2.5 px-3">
                      <input
                        type="number"
                        min="0"
                        value={item.rate}
                        onChange={(e) => handleItemChange(idx, 'rate', e.target.value)}
                        className="w-full text-center px-2 py-1.5 border border-slate-300 rounded-lg text-sm font-bold text-slate-900 focus:ring-1 focus:ring-emerald-500"
                        required
                      />
                    </td>

                    <td className="py-2.5 px-3 text-right font-extrabold text-sm text-emerald-800">
                      {formatNPR(item.amount, true)}
                    </td>

                    <td className="py-2.5 px-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        disabled={items.length === 1}
                        className="text-slate-400 hover:text-red-600 disabled:opacity-30 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment and Totals Summary Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Payment Method & Notes */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  भुक्तानीको तरिका (Payment Method)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'cash', label: 'नगद (Cash)' },
                    { id: 'credit', label: 'उधारो (Credit)' },
                    { id: 'cheque', label: 'चेक (Cheque)' },
                    { id: 'other', label: 'अन्य (Other)' }
                  ].map((pm) => (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => {
                        setPaymentMethod(pm.id);
                        if (pm.id === 'credit') setAdvancePaid('0');
                        if (pm.id === 'cash') setAdvancePaid(grandTotal);
                      }}
                      className={`py-2 px-1 rounded-xl text-xs font-bold border text-center transition ${
                        paymentMethod === pm.id
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {pm.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  कैफियत / टिप्पणी (Notes)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="कुनै अतिरिक्त विवरण भए यहाँ लेख्नुहोस्..."
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-xs focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* Amount in Nepali Words Live Preview */}
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs">
                <span className="font-bold text-amber-900">अक्षरेपी रु. : </span>
                <span className="font-extrabold text-amber-950 underline decoration-dotted">
                  {wordsInNepali}
                </span>
              </div>
            </div>

            {/* Right: Calculations Box */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex justify-between items-center text-sm font-bold text-slate-700">
                <span>कुल जम्मा (Total Amount):</span>
                <span className="text-xl font-extrabold text-slate-900">
                  {formatNPR(grandTotal, true)}
                </span>
              </div>

              <div className="flex justify-between items-center text-sm font-bold text-slate-700">
                <span>पेश्की / भुक्तान रकम (Advance Paid):</span>
                <div className="w-36">
                  <input
                    type="number"
                    min="0"
                    max={grandTotal}
                    value={advancePaid}
                    onChange={(e) => setAdvancePaid(e.target.value)}
                    placeholder={paymentMethod === 'credit' ? '0' : String(grandTotal)}
                    className="w-full text-right px-3 py-1.5 border border-slate-300 rounded-xl font-extrabold text-sm text-slate-900 bg-white"
                  />
                </div>
              </div>

              <div className="border-t border-slate-200 pt-2 flex justify-between items-center text-base font-extrabold">
                <span className={balanceDue > 0 ? 'text-red-700' : 'text-emerald-700'}>
                  बाँकी उधारो रकम (Balance Due):
                </span>
                <span className={balanceDue > 0 ? 'text-red-700' : 'text-emerald-700'}>
                  {formatNPR(balanceDue, true)}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/billing')}
                  className="w-1/3 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition"
                >
                  रद्द गर्नुहोस् (Cancel)
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-2/3 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <span>बिल बन्दैछ...</span>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>बिल जारी गरी प्रिन्ट गर्नुहोस् (Save & Print)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
