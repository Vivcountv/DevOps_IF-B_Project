// src/pages/AdminMahasiswa.jsx
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
  CheckCircle,
  XCircle,
  UserCheck,
  UserX
} from 'lucide-react';



function AdminMahasiswa() {
  const [mahasiswaList, setMahasiswaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [statusError, setStatusError] = useState(null); 


  useEffect(() => {
    setUser(getUserFromToken()); // Ambil data user
    fetchMahasiswa();
  }, []);

  const fetchMahasiswa = async () => {
    try {
      setLoading(true);
      setError(null);
      setStatusError(null);
      const response = await apiClient.get('/admin/mahasiswa');
      setMahasiswaList(response.data);
    } catch (err) {
      console.error("Gagal ambil data:", err);
      setError("Gagal memuat data mahasiswa.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (nim, newStatus) => {
    try {
      setStatusError(null); // Reset error
      await apiClient.put(`/admin/mahasiswa/${nim}/status`, { status: newStatus });
      // Perbarui state
      setMahasiswaList(currentList =>
        currentList.map(mhs =>
          mhs.nim === nim ? { ...mhs, status: newStatus } : mhs
        )
      );
    } catch (err) {
      // [MODERN] Ganti alert() dengan state error
      setStatusError(err.response?.data?.message || "Gagal mengubah status mahasiswa.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/admin/login';
  };

  return (

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
              {/* [MODERN] Highlight halaman aktif */}
              <Link
                to="/admin/mahasiswa"
                className="flex items-center rounded-xl px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 font-bold shadow-sm border border-blue-100"
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
          <h1 className="text-3xl font-bold mb-6">Manajemen Mahasiswa</h1>

          {/* [MODERN] Notifikasi Status Error */}
          {statusError && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-700 border border-red-200">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span>{statusError}</span>
            </div>
          )}

          {/* [MODERN] Kartu Tabel Mahasiswa */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-lg shadow-blue-100/50">
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 p-2 shadow-lg">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Daftar Mahasiswa</h2>
                  <p className="text-sm text-gray-600">Kelola akun mahasiswa yang terdaftar.</p>
                </div>
              </div>
            </div>

            {loading && (
              <div className="flex flex-col items-center justify-center p-12">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                <p className="mt-3 text-sm text-gray-500">Memuat data mahasiswa...</p>
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
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Nama Lengkap</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">NIM</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                      <th className="relative px-6 py-3"><span className="sr-only">Aksi</span></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {mahasiswaList.map((mhs, index) => (
                      <tr key={mhs.nim} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50 hover:bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{mhs.nama_lengkap}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{mhs.nim}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{mhs.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {/* [MODERN] Status badge */}
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${mhs.status === 'Aktif'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                            }`}>
                            {mhs.status === 'Aktif' ? (
                              <CheckCircle className="h-3 w-3" />
                            ) : (
                              <XCircle className="h-3 w-3" />
                            )}
                            {mhs.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {/* [MODERN] Tombol aksi */}
                          {mhs.status === 'Aktif' ? (
                            <button
                              onClick={() => handleStatusChange(mhs.nim, 'Tidak Aktif')}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-red-100 px-3 py-2 text-xs font-semibold text-red-700 transition-all hover:bg-red-200"
                            >
                              <UserX className="h-4 w-4" />
                              <span>Nonaktifkan</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStatusChange(mhs.nim, 'Aktif')}
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

export default AdminMahasiswa;
