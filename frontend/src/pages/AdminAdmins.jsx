// src/pages/AdminAdmins.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../services/api';
import { jwtDecode } from 'jwt-decode';
import { getUserFromToken } from '../services/auth';
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  Shield,
  LogOut,
  Loader2,
  AlertCircle,
  Plus,
  CheckCircle,
  XCircle,
  User as UserIcon,
  Mail,
  Lock,
  UserPlus,
  UserCheck,
  UserX
} from 'lucide-react';

// --- Impor Ikon ---
const BeasiswaIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline-block" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>;
const MahasiswaIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline-block" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>;
const AdminIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline-block" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0012 11z" clipRule="evenodd" /></svg>;
// --------------------

function AdminAdmins() {
  const [adminList, setAdminList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ nama_admin: '', email: '', password: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);
  const [statusError, setStatusError] = useState(null);
  const [currentAdminId, setCurrentAdminId] = useState(null);
  const [user, setUser] = useState(null); // State untuk user admin

  useEffect(() => {
    setUser(getUserFromToken()); // Ambil data user
    try {
      const token = localStorage.getItem('token');
      const decoded = jwtDecode(token);
      setCurrentAdminId(decoded.id_admin);
    } catch (err) { console.error("Token tidak valid"); }
    fetchAdmins();
  }, []);

 const fetchAdmins = async () => {
    try {
      setLoading(true);
      setError(null);
      setStatusError(null);
      const response = await apiClient.get('/admin/admins');
      setAdminList(response.data);
    } catch (err) {
      setError("Gagal memuat data admin.");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setFormError(null);
    setFormSuccess(null);
    setStatusError(null);
    try {
      await apiClient.post('/admin/admins', formData);
      setFormSuccess("Admin baru berhasil ditambahkan!");
      setFormData({ nama_admin: '', email: '', password: '' });
      fetchAdmins(); // Muat ulang daftar admin
    } catch (err) {
      setFormError(err.response?.data?.message || "Gagal menambahkan admin.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormError(null);
    setFormSuccess(null);
  };

  const handleStatusChange = async (id_admin, newStatus) => {
    try {
      setStatusError(null); // Reset error
      await apiClient.put(`/admin/admins/${id_admin}/status`, { status: newStatus });
      // Perbarui state secara optimis
      setAdminList(currentList =>
        currentList.map(admin =>
          admin.id_admin === id_admin ? { ...admin, status: newStatus } : admin
        )
      );
    } catch (err) {
      // [MODERN] Ganti alert() dengan state error
      setStatusError(err.response?.data?.message || "Gagal mengubah status admin.");
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/admin/login';
  };


 return (
    // [MODERN] Tema terang
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 text-gray-900">
      
      {/* --- Sidebar (Sama seperti Dashboard) --- */}
      <aside className="w-64 bg-white p-6 shadow-lg flex flex-col border-r border-gray-200">
        <h2 className="text-2xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
          <LayoutDashboard className="text-blue-600" />
          Portal Admin
        </h2>
        
        <nav className="flex flex-col space-y-2">
          <Link 
            to="/admin/dashboard" 
            className="flex items-center rounded-xl px-4 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
          >
            <GraduationCap className="h-5 w-5 mr-3" /> Manajemen Beasiswa
          </Link>
          
          {user && user.role === 'Super Admin' && (
            <>
              <Link 
                to="/admin/mahasiswa" 
                className="flex items-center rounded-xl px-4 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
              >
                <Users className="h-5 w-5 mr-3" /> Manajemen Mahasiswa
              </Link>
              {/* [MODERN] Highlight halaman aktif */}
              <Link 
                to="/admin/admins" 
                className="flex items-center rounded-xl px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 font-bold shadow-sm border border-blue-100"
              > 
                <Shield className="h-5 w-5 mr-3" /> Manajemen Admin
              </Link>
            </>
          )}
        </nav>
        
        <button
          onClick={handleLogout}
          className="mt-auto flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors duration-200"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </aside>

      {/* Konten Utama */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Manajemen Admin</h1>

          {/* [MODERN] Form Tambah Admin */}
          <form onSubmit={handleFormSubmit} className="mb-8 overflow-hidden rounded-2xl bg-white shadow-lg shadow-blue-100/50">
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
               <div className="flex items-center gap-3">
                 <div className="rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 p-2 shadow-lg">
                  <UserPlus className="h-5 w-5 text-white" />
                 </div>
                 <div>
                  <h2 className="text-lg font-bold text-gray-900">Tambah Admin Baru</h2>
                  <p className="text-sm text-gray-600">Buat akun admin beasiswa baru</p>
                 </div>
               </div>
            </div>

            {/* Notifikasi Form */}
            {formSuccess && (
              <div className="flex items-center gap-2 rounded-xl bg-green-50 p-4 text-sm text-green-700 border border-green-200 m-6 mb-0">
                <CheckCircle className="h-5 w-5 flex-shrink-0" />
                <span>{formSuccess}</span>
              </div>
            )}
            {formError && (
              <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-700 border border-red-200 m-6 mb-0">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}
            
            <div className="p-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* [MODERN] Input Nama */}
              <div>
                <label htmlFor="nama_admin" className="block text-sm font-semibold text-gray-700 mb-2">Nama Lengkap</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input type="text" name="nama_admin" id="nama_admin" required value={formData.nama_admin} onChange={handleChange} className="block w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                </div>
              </div>
              {/* [MODERN] Input Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                 <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input type="email" name="email" id="email" required value={formData.email} onChange={handleChange} className="block w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                </div>
              </div>
              {/* [MODERN] Input Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                 <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input type="password" name="password" id="password" required value={formData.password} onChange={handleChange} className="block w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 px-6 py-4 text-right rounded-b-2xl">
              <button 
                type="submit" 
                disabled={isSaving} 
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    <span>Tambah Admin</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* [MODERN] Notifikasi Status Error */}
          {statusError && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-700 border border-red-200">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span>{statusError}</span>
            </div>
          )}

          {/* [MODERN] Tabel Daftar Admin */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-lg shadow-blue-100/50">
             <div className="p-6 border-b border-gray-100">
               <div className="flex items-center gap-3">
                 <div className="rounded-lg bg-gradient-to-br from-indigo-500 to-blue-500 p-2 shadow-lg">
                  <Shield className="h-5 w-5 text-white" />
                 </div>
                 <div>
                  <h2 className="text-lg font-bold text-gray-900">Daftar Admin Terdaftar</h2>
                 </div>
               </div>
            </div>
          
            {loading && (
              <div className="flex flex-col items-center justify-center p-12">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                <p className="mt-3 text-sm text-gray-500">Memuat data admin...</p>
              </div>
            )}
            {error && (
              <div className="flex flex-col items-center justify-center p-12">
                 <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                <p className="mt-3 text-base font-medium text-red-600">{error}</p>
              </div>
            )}
            
            {!loading && !error && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Nama</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                      <th className="relative px-6 py-3"><span className="sr-only">Aksi</span></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {adminList.map((admin, index) => (
                      <tr key={admin.id_admin} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50 hover:bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{admin.nama_admin}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{admin.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            admin.status === 'Aktif' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                          }`}>
                            {admin.status === 'Aktif' ? (
                              <CheckCircle className="h-3 w-3" />
                            ) : (
                              <XCircle className="h-3 w-3" />
                            )}
                            {admin.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {admin.id_admin === currentAdminId ? (
                            <span className="text-sm text-gray-400 italic px-3">(Akun Anda)</span>
                          ) : admin.status === 'Aktif' ? (
                            <button
                              onClick={() => handleStatusChange(admin.id_admin, 'Tidak Aktif')}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-red-100 px-3 py-2 text-xs font-semibold text-red-700 transition-all hover:bg-red-200"
                            >
                              <UserX className="h-4 w-4" />
                              <span>Nonaktifkan</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStatusChange(admin.id_admin, 'Aktif')}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-green-100 px-3 py-2 text-xs font-semibold text-green-700 transition-all hover:bg-green-200"
                            >
                              <UserCheck className="h-4 w-4" />
                              <span>Aktifkan</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminAdmins;
