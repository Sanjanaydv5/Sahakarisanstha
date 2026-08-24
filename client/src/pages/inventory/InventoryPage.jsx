import React, { useState, useEffect } from 'react';
import api from '../../api/axiosInstance';
import { useLanguage } from '../../context/LanguageContext';
import { toDevanagari, formatNPR } from '../../utils/nepaliConverter';
import {
  Boxes,
  PlusCircle,
  ArrowDownToLine,
  ArrowUpFromLine,
  History,
  AlertTriangle,
  Search,
  X,
  Save,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export const InventoryPage = () => {
  const { t } = useLanguage();

  const [products, setProducts] = useState([]);
  const [ledgerEntries, setLedgerEntries] = useState([]);
  const [activeTab, setActiveTab] = useState('products'); // 'products' or 'ledger'
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [lowStockOnly, setLowStockOnly] = useState(false);

  // Stock-In Modal
  const [showStockInModal, setShowStockInModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [supplierName, setSupplierName] = useState('कृषि सामग्री कम्पनी लिमिटेड');
  const [supplierInvoiceNo, setSupplierInvoiceNo] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [notes, setNotes] = useState('');

  // New Product Modal
  const [showNewProductModal, setShowNewProductModal] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdNameEn, setNewProdNameEn] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('fertilizer');
  const [newProdUnit, setNewProdUnit] = useState('बोरा (50 kg)');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdCost, setNewProdCost] = useState('');
  const [newProdStock, setNewProdStock] = useState('');
  const [newProdReorder, setNewProdReorder] = useState('10');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
    if (activeTab === 'ledger') {
      fetchLedger();
    }
  }, [activeTab, lowStockOnly, search]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (lowStockOnly) params.lowStock = 'true';

      const res = await api.get('/products', { params });
      if (res.data.success) {
        setProducts(res.data.products || []);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLedger = async () => {
    try {
      const res = await api.get('/inventory/ledger');
      if (res.data.success) {
        setLedgerEntries(res.data.entries || []);
      }
    } catch (err) {
      console.error('Error fetching stock ledger:', err);
    }
  };

  const handleStockInSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct || !stockQuantity || Number(stockQuantity) <= 0) return;

    try {
      setSubmitting(true);
      setError('');
      await api.post('/inventory/stock-in', {
        productId: selectedProduct,
        quantity: stockQuantity,
        unitPrice,
        supplierName,
        supplierInvoiceNo,
        notes
      });
      setShowStockInModal(false);
      setStockQuantity('');
      fetchProducts();
      if (activeTab === 'ledger') fetchLedger();
    } catch (err) {
      setError(err.response?.data?.message || 'मौज्दात दाखिला गर्न असफल भयो');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateProductSubmit = async (e) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice) return;

    try {
      setSubmitting(true);
      setError('');
      await api.post('/products', {
        name: newProdName,
        nameEnglish: newProdNameEn,
        category: newProdCategory,
        unit: newProdUnit,
        pricePerUnit: newProdPrice,
        costPrice: newProdCost || 0,
        initialStock: newProdStock || 0,
        reorderLevel: newProdReorder || 10
      });
      setShowNewProductModal(false);
      setNewProdName('');
      setNewProdPrice('');
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'उत्पादन थप्न असफल भयो');
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
            <Boxes className="w-5 h-5 text-emerald-600" />
            <span>मलखाद तथा भण्डार व्यवस्थापन (Inventory & Stock)</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            डीएपी, युरिया, पोटास, बीउबिजनको मौज्दात र खरिद दाखिला
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowStockInModal(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md transition flex items-center gap-2"
          >
            <ArrowDownToLine className="w-4 h-4" />
            <span>+ मौज्दात दाखिला (Stock In)</span>
          </button>

          <button
            onClick={() => setShowNewProductModal(true)}
            className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md transition flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            <span>+ नयाँ वस्तु दर्ता (New Product)</span>
          </button>
        </div>
      </div>

      {/* Tabs & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Navigation Tabs */}
        <div className="flex gap-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'products' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            मौज्दात सूची (Current Stock)
          </button>
          <button
            onClick={() => {
              setActiveTab('ledger');
              fetchLedger();
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'ledger' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>मौज्दात खाता (Stock Ledger)</span>
          </button>
        </div>

        {activeTab === 'products' && (
          <div className="flex items-center gap-3">
            <div className="relative min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="उत्पादन खोज्नुहोस्..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-slate-700 bg-amber-50 text-amber-900 px-3 py-1.5 rounded-xl border border-amber-200">
              <input
                type="checkbox"
                checked={lowStockOnly}
                onChange={(e) => setLowStockOnly(e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded"
              />
              <span>न्यून मौज्दात मात्र (Low Stock)</span>
            </label>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {activeTab === 'products' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((prod) => {
            const isLow = prod.currentStock <= prod.reorderLevel;
            const progress = Math.min(100, Math.round((prod.currentStock / (prod.reorderLevel * 4 || 50)) * 100));

            return (
              <div
                key={prod._id}
                className={`bg-white p-5 rounded-3xl border shadow-xs space-y-4 transition ${
                  isLow ? 'border-amber-300 ring-2 ring-amber-100' : 'border-slate-200 hover:shadow-md'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-slate-100 text-slate-600">
                      {prod.category}
                    </span>
                    <h3 className="font-extrabold text-slate-900 text-base mt-1 leading-snug">
                      {prod.name}
                    </h3>
                  </div>

                  {isLow ? (
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2 py-1 rounded-lg border border-amber-300 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-amber-600" />
                      न्यून मौज्दात
                    </span>
                  ) : (
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-1 rounded-lg">
                      उपलब्ध
                    </span>
                  )}
                </div>

                {/* Current Stock Metric */}
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">हालको मौज्दात</p>
                    <p className="text-xl font-extrabold text-slate-900 mt-0.5">
                      {toDevanagari(prod.currentStock)} <span className="text-xs font-semibold text-slate-600">{prod.unit}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-500 uppercase">बिक्री दर</p>
                    <p className="text-base font-extrabold text-emerald-700 mt-0.5">
                      {formatNPR(prod.pricePerUnit, true)}
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-semibold text-slate-500">
                    <span>मौज्दात स्तर</span>
                    <span>पुनः अर्डर: {toDevanagari(prod.reorderLevel)} {prod.unit}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${isLow ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">खरिद दर: {formatNPR(prod.costPrice, true)}</span>
                  <button
                    onClick={() => {
                      setSelectedProduct(prod._id);
                      setUnitPrice(prod.costPrice || '');
                      setShowStockInModal(true);
                    }}
                    className="text-emerald-700 hover:text-emerald-800 font-bold hover:underline"
                  >
                    + थप मौज्दात दाखिला
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Stock Ledger Table */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="py-3 px-4">मिति (B.S.)</th>
                  <th className="py-3 px-4">उत्पादन / मलखाद</th>
                  <th className="py-3 px-4 text-center">प्रकार (Type)</th>
                  <th className="py-3 px-4 text-center">परिमाण</th>
                  <th className="py-3 px-4 text-center">अघिल्लो &rarr; पछिल्लो मौज्दात</th>
                  <th className="py-3 px-4">सन्दर्भ / आपूर्तिकर्ता</th>
                  <th className="py-3 px-4">प्रविष्टि गर्ने</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ledgerEntries.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      कुनै मौज्दात कारोबार फेला परेन ।
                    </td>
                  </tr>
                ) : (
                  ledgerEntries.map((entry) => (
                    <tr key={entry._id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-medium text-slate-600">{entry.nepaliDate}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{entry.product?.name || 'सामान'}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                          entry.type === 'in' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {entry.type === 'in' ? 'दाखिला (In)' : 'बिक्री (Out)'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-extrabold text-slate-900">
                        {entry.type === 'in' ? '+' : '-'}{toDevanagari(entry.quantity)} {entry.product?.unit || 'बोरा'}
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-slate-600">
                        {toDevanagari(entry.previousStock)} &rarr; <strong className="text-slate-900">{toDevanagari(entry.newStock)}</strong>
                      </td>
                      <td className="py-3 px-4 text-slate-700">{entry.reference || entry.supplierName}</td>
                      <td className="py-3 px-4 text-slate-500">{entry.performedBy?.name || 'Staff'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Stock In Modal */}
      {showStockInModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <ArrowDownToLine className="w-5 h-5 text-emerald-600" />
                <span>नयाँ मौज्दात दाखिला (Stock In / Restock)</span>
              </h3>
              <button onClick={() => setShowStockInModal(false)} className="text-slate-400 hover:bg-slate-100 p-1 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && <div className="bg-red-50 text-red-700 text-xs p-3 rounded-xl">{error}</div>}

            <form onSubmit={handleStockInSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  उत्पादन छान्नुहोस् * (Product)
                </label>
                <select
                  value={selectedProduct}
                  onChange={(e) => {
                    setSelectedProduct(e.target.value);
                    const prod = products.find(p => p._id === e.target.value);
                    if (prod) setUnitPrice(prod.costPrice || '');
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500"
                  required
                >
                  <option value="">-- सामान छान्नुहोस् --</option>
                  {products.map(p => (
                    <option key={p._id} value={p._id}>
                      {p.name} (हालको मौज्दात: {p.currentStock} {p.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    दाखिला परिमाण * (Quantity)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(e.target.value)}
                    placeholder="उदा. ५०"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    खरिद मूल्य प्रति एकाइ (Cost Rate रु.)
                  </label>
                  <input
                    type="number"
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(e.target.value)}
                    placeholder="रु."
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  आपूर्तिकर्ता संस्था (Supplier Name)
                </label>
                <input
                  type="text"
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                  placeholder="उदा. कृषि सामग्री कम्पनी / साल्ट ट्रेडिङ"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  खरिद बीजक / चलानी नं. (Supplier Invoice No.)
                </label>
                <input
                  type="text"
                  value={supplierInvoiceNo}
                  onChange={(e) => setSupplierInvoiceNo(e.target.value)}
                  placeholder="उदा. KSCL-2080-991"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowStockInModal(false)}
                  className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                >
                  रद्द गर्नुहोस्
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-1/2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50"
                >
                  {submitting ? 'दाखिला हुँदैछ...' : 'मौज्दात दाखिला गर्नुहोस्'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Product Modal */}
      {showNewProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-emerald-600" />
                <span>नयाँ वस्तु दर्ता (Register New Product)</span>
              </h3>
              <button onClick={() => setShowNewProductModal(false)} className="text-slate-400 hover:bg-slate-100 p-1 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProductSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  उत्पादनको नाम (नेपालीमा) *
                </label>
                <input
                  type="text"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="उदा. सुपर फस्फेट मल"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">वर्ग (Category)</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-medium"
                  >
                    <option value="fertilizer">रासायनिक मल (Fertilizer)</option>
                    <option value="seed">उन्नत बीउ (Seed)</option>
                    <option value="pesticide">कीटनाशक विषादी (Pesticide)</option>
                    <option value="equipment">कृषि औजार (Equipment)</option>
                    <option value="general">अन्य (General)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">एकाइ (Unit)</label>
                  <input
                    type="text"
                    value={newProdUnit}
                    onChange={(e) => setNewProdUnit(e.target.value)}
                    placeholder="बोरा (50 kg)"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-medium"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">बिक्री दर (रु.) *</label>
                  <input
                    type="number"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    placeholder="रु."
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">खरिद दर (रु.)</label>
                  <input
                    type="number"
                    value={newProdCost}
                    onChange={(e) => setNewProdCost(e.target.value)}
                    placeholder="रु."
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">सुरुवाती मौज्दात</label>
                  <input
                    type="number"
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(e.target.value)}
                    placeholder="०"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">पुनः अर्डर बिन्दु (Alert Level)</label>
                  <input
                    type="number"
                    value={newProdReorder}
                    onChange={(e) => setNewProdReorder(e.target.value)}
                    placeholder="१०"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewProductModal(false)}
                  className="w-1/2 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  रद्द गर्नुहोस्
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-1/2 py-2.5 bg-slate-900 hover:bg-black text-white font-bold rounded-xl shadow-md"
                >
                  दर्ता गर्नुहोस्
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
