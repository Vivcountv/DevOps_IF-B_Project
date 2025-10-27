// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../services/api';
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
  FilePenLine,
  Trash2,
  ClipboardList,
  CheckCircle,
  XCircle,
} from 'lucide-react';


function AdminDashboard() {
  const [beasiswaList, setBeasiswaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getUserFromToken());
    fetchBeasiswa();
  }, []);

  const fetchBeasiswa = async () => {
    try { setLoading(true); const response = await apiClient.get('/beasiswa'); setBeasiswaList(response.data); setError(null); } catch (err) { console.error("Gagal mengambil beasiswa:", err); setError("Gagal memuat daftar beasiswa."); } finally { setLoading(false); }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/admin/login';
  };

  const handleDelete = async (uuid) => {
    // ... (fungsi handleDelete tidak berubah) ...
    if (window.confirm("Yakin hapus?")) { try { await apiClient.delete(`/beasiswa/${uuid}`); setBeasiswaList(currentList => currentList.filter(b => b.uuid !== uuid)); } catch (err) { alert("Gagal hapus."); } }
  };

  // --- STYLING UTAMA DIMULAI DARI SINI ---
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 text-gray-900">
      
      {/* Sidebar Modern (Light Theme) */}
      <aside className="w-64 bg-white p-6 shadow-lg flex flex-col border-r border-gray-200">
        <h2 className="text-2xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
          <LayoutDashboard className="text-blue-600" />
          Portal Admin
        </h2>
        
        <nav className="flex flex-col space-y-2">
          <Link 
            to="/admin/dashboard" 
            className="flex items-center rounded-xl px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 font-bold shadow-sm border border-blue-100" // Current Page Highlight
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
              <Link 
                to="/admin/admins" 
                className="flex items-center rounded-xl px-4 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
              >
                <Shield className="h-5 w-5 mr-3" /> Manajemen Admin
              </Link>
            </>
          )}
        </nav>
        
        {/* Tombol Logout di bawah */}
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
          {/* Header Konten */}
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl font-bold">Manajemen Beasiswa</h1>
            {user && (
              <span className="text-base text-gray-600 hidden sm:block">
                Halo, <span className="font-semibold">{user.nama}</span> ({user.role})
              </span>
            )}
          </div>

          {/* Notifikasi Error Hapus */}
          {deleteError && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-700 border border-red-200">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span>{deleteError}</span>
            </div>
          )}

          {/* Kartu Tabel Beasiswa (Modern Style) */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-lg shadow-blue-100/50">
            {/* Header Kartu + Tombol Tambah */}
            <div className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 p-2 shadow-lg">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Daftar Beasiswa</h2>
                  <p className="text-sm text-gray-600">Kelola semua beasiswa yang ada.</p>
                </div>
              </div>
              <Link
                to="/admin/beasiswa/baru"
                className="mt-4 sm:mt-0 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/40"
              >
                <Plus className="h-5 w-5" />
                <span>Tambah Beasiswa</span>
              </Link>
            </div>
            
            {/* Loading / Error Utama */}
            {loading && (
              <div className="flex flex-col items-center justify-center p-12">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                <p className="mt-3 text-sm text-gray-500">Memuat beasiswa...</p>
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

            {/* Tabel (Light Theme) */}
            {!loading && !error && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Nama Beasiswa</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Kategori</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Batas Penutupan</th>
                      <th className="relative px-6 py-3"><span className="sr-only">Aksi</span></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {beasiswaList.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                          Belum ada beasiswa yang ditambahkan.
                        </td>
                      </tr>
                    ) : (
                      beasiswaList.map((beasiswa, index) => (
                        <tr key={beasiswa.uuid} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50 hover:bg-gray-50'}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{beasiswa.nama_beasiswa}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              beasiswa.status_pendaftaran === 'Dibuka' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                            }`}>
                              {beasiswa.status_pendaftaran === 'Dibuka' ? (
                                <CheckCircle className="h-3 w-3" />
                              ) : (
                                <XCircle className="h-3 w-3" />
                              )}
                              {beasiswa.status_pendaftaran}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{beasiswa.kategori}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {new Date(beasiswa.tgl_penutupan).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                            <Link 
                              to={`/admin/beasiswa/${beasiswa.uuid}/pendaftar`} 
                              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-100 px-3 py-2 text-xs font-semibold text-blue-700 transition-all hover:bg-blue-200"
                            >
                              <ClipboardList className="h-4 w-4" />
                              <span>Pendaftar</span>
                            </Link>
                            <Link 
                              to={`/admin/beasiswa/edit/${beasiswa.uuid}`} 
                              className="inline-flex items-center gap-1.5 rounded-lg bg-yellow-100 px-3 py-2 text-xs font-semibold text-yellow-800 transition-all hover:bg-yellow-200"
                            >
                              <FilePenLine className="h-4 w-4" />
                              <span>Edit</span>
                            </Link>
                            <button 
                              onClick={() => handleDelete(beasiswa.uuid)} 
                              className="inline-flex items-center gap-1.5 rounded-lg bg-red-100 px-3 py-2 text-xs font-semibold text-red-700 transition-all hover:bg-red-200"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span>Hapus</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
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

export default AdminDashboard;
