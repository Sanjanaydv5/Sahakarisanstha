import React, { useState, useEffect } from 'react';
import api from '../../api/axiosInstance';
import { useLanguage } from '../../context/LanguageContext';
import {
  UserCog,
  UserPlus,
  KeyRound,
  ShieldCheck,
  Search,
  CheckCircle,
  X,
  Lock,
  Phone,
  Mail,
  AlertCircle
} from 'lucide-react';

export const UserManagementPage = () => {
  const { t } = useLanguage();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // New User Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('staff');
  const [phone, setPhone] = useState('');
  const [modalLoading, setModalLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Reset Password Modal
  const [resettingUser, setResettingUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (roleFilter !== 'all') params.role = roleFilter;

      const res = await api.get('/users', { params });
      if (res.data.success) {
        setUsers(res.data.users || []);
      }
    } catch (err) {
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!name || !username || !email || !password) return;

    try {
      setModalLoading(true);
      setError('');
      const res = await api.post('/users', { name, username, email, password, role, phone });
      if (res.data.success) {
        setShowCreateModal(false);
        setName('');
        setUsername('');
        setEmail('');
        setPassword('');
        setPhone('');
        fetchUsers();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'प्रयोगकर्ता सिर्जना गर्न सकिएन');
    } finally {
      setModalLoading(false);
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      await api.put(`/users/${user._id}`, { isActive: !user.isActive });
      fetchUsers();
    } catch (err) {
      console.error('Error toggling status:', err);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) return;

    try {
      setResetLoading(true);
      setError('');
      await api.post(`/users/${resettingUser._id}/reset-password`, { newPassword });
      setResettingUser(null);
      setNewPassword('');
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'पासवर्ड रिसेट गर्न सकिएन');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <UserCog className="w-5 h-5 text-emerald-600" />
            <span>कर्मचारी तथा प्रयोगकर्ता व्यवस्थापन (User Management)</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            प्रशासक, व्यवस्थापक तथा लेखापाल कर्मचारीहरूको खाता तथा पहुँच नियन्त्रण (RBAC)
          </p>
        </div>

        <button
          onClick={() => {
            setShowCreateModal(true);
            setError('');
          }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md transition flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ नयाँ कर्मचारी थप्नुहोस् (Create User)</span>
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
            placeholder="नाम, युजरनेम, वा ईमेल खोज्नुहोस्..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-emerald-500"
        >
          <option value="all">सबै भूमिकाहरू (All Roles)</option>
          <option value="admin">Admin (प्रशासक)</option>
          <option value="manager">Manager (व्यवस्थापक)</option>
          <option value="staff">Staff (लेखापाल/काउन्टर)</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <th className="py-3 px-4">नाम</th>
                <th className="py-3 px-4">युजरनेम / ईमेल</th>
                <th className="py-3 px-4">सम्पर्क फोन</th>
                <th className="py-3 px-4 text-center">भूमिका (Role)</th>
                <th className="py-3 px-4 text-center">अवस्था (Status)</th>
                <th className="py-3 px-4 text-center">कार्य (Actions)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    प्रयोगकर्ताहरू लोड हुँदैछ...
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-bold text-slate-900">{u.name}</td>
                    <td className="py-3 px-4 text-slate-600 font-mono">
                      <span className="font-bold text-slate-800">@{u.username}</span>
                      <span className="block text-[11px] text-slate-500">{u.email}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700">{u.phone || '—'}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase ${
                        u.role === 'admin' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                        u.role === 'manager' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                        'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleToggleStatus(u)}
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full transition ${
                          u.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-300' : 'bg-red-50 text-red-700 border border-red-300'
                        }`}
                      >
                        {u.isActive ? 'सक्रिय (Active)' : 'निष्क्रिय (Inactive)'}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => {
                          setResettingUser(u);
                          setNewPassword('');
                          setError('');
                        }}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-800 font-bold text-[11px] transition flex items-center gap-1 mx-auto"
                        title="पासवर्ड रिसेट गर्नुहोस्"
                      >
                        <KeyRound className="w-3.5 h-3.5" />
                        <span>पासवर्ड रिसेट</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-600" />
                <span>नयाँ कर्मचारी खाता (Create User)</span>
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:bg-slate-100 p-1 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && <div className="bg-red-50 text-red-700 text-xs p-3 rounded-xl border border-red-200">{error}</div>}

            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">पूरा नाम (Full Name) *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="उदा. रमेश कुमार यादव"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">युजरनेम (Username) *</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="ramesh"
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-mono lowercase"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">भूमिका (Role) *</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl font-bold"
                  >
                    <option value="staff">Staff (लेखापाल / काउन्टर)</option>
                    <option value="manager">Manager (व्यवस्थापक)</option>
                    <option value="admin">Admin (प्रशासक)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ईमेल (Email) *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ramesh@janatasahakari.org"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">सुरुवाती पासवर्ड *</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 chars"
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">सम्पर्क फोन नं.</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="98XXXXXXXX"
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="w-1/2 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  रद्द गर्नुहोस्
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="w-1/2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition"
                >
                  {modalLoading ? 'सिर्जना हुँदैछ...' : 'खाता सिर्जना गर्नुहोस्'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {resettingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-amber-600" />
                <span>पासवर्ड रिसेट: {resettingUser.name}</span>
              </h3>
              <button onClick={() => setResettingUser(null)} className="text-slate-400 hover:bg-slate-100 p-1 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && <div className="bg-red-50 text-red-700 text-xs p-3 rounded-xl border border-red-200">{error}</div>}

            <form onSubmit={handleResetPassword} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  नयाँ पासवर्ड (New Password - Min 6 chars) *
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold"
                  required
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setResettingUser(null)}
                  className="w-1/2 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  रद्द गर्नुहोस्
                </button>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-1/2 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-md transition"
                >
                  {resetLoading ? 'रिसेट हुँदैछ...' : 'पासवर्ड रिसेट गर्नुहोस्'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
