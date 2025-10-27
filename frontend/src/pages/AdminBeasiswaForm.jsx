import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
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
  ArrowLeft,
  Save,
  Text,
  FileText,
  ListTree,
  Users as UsersIcon, 
  DollarSign,
  Sigma,
  ToggleLeft,
  CalendarDays
} from 'lucide-react';



const formatISODate = (dateString) => {
  if (!dateString) return '';
  try {
    return new Date(dateString).toISOString().split('T')[0];
  } catch (e) { return ''; }
};

function AdminBeasiswaForm() {
  const [formData, setFormData] = useState({
    nama_beasiswa: '', deskripsi: '', kriteria: '', kuota: '',
    jenis_pembiayaan: 'Penuh', kategori: 'Akademik', tgl_pembukaan: '',
    tgl_penutupan: '', status_pendaftaran: 'Ditutup'
  });
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [pageTitle, setPageTitle] = useState('Tambah Beasiswa Baru');
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const { uuid } = useParams();
  const isEditMode = Boolean(uuid);

  const getUserFromToken = () => {
    return { nama: 'Admin Utama', role: 'Super Admin' };
  };

  useEffect(() => {
    setUser(getUserFromToken());

    if (isEditMode) {
      setPageTitle('Edit Beasiswa');
      setLoadingData(true);
      setError(null);

      apiClient.get(`/beasiswa/${uuid}`)
        .then(response => {
          const data = response.data;
          setFormData({
            nama_beasiswa: data.nama_beasiswa || '',
            deskripsi: data.deskripsi || '',
            kriteria: data.kriteria || '',
            kuota: data.kuota || '',
            jenis_pembiayaan: data.jenis_pembiayaan || 'Penuh',
            kategori: data.kategori || 'Akademik',
            tgl_pembukaan: formatISODate(data.tgl_pembukaan),
            tgl_penutupan: formatISODate(data.tgl_penutupan),
            status_pendaftaran: data.status_pendaftaran || 'Ditutup'
          });
        })
        .catch(err => {
          console.error("Gagal ambil data beasiswa:", err);
          setError("Gagal memuat data beasiswa. Pastikan ID valid atau cek koneksi backend.");
        })
        .finally(() => {
          setLoadingData(false);
        });
    }

  }, [uuid, isEditMode]);

  const handleChange = (e) => {
    setError(null);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    const dataToSend = { ...formData, kuota: parseInt(formData.kuota, 10) || 0 };
    try {
      if (isEditMode) {
        await apiClient.put(`/beasiswa/${uuid}`, dataToSend);
      } else {
        await apiClient.post('/beasiswa', dataToSend);
      }
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || "Gagal menyimpan.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/admin/login';
  };


  return (
    // [MODERN] Tema terang
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 text-gray-900">

      {/* --- Sidebar (Modern & Light) --- */}
      <aside className="w-64 bg-white p-6 shadow-lg flex flex-col border-r border-gray-200">
        <h2 className="text-2xl font-bold mb-8 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
          <LayoutDashboard className="text-purple-600" />
          Portal Admin
        </h2>

        <nav className="flex flex-col space-y-2">
          {/* [MODERN] Highlight halaman aktif */}
          <Link
            to="/admin/dashboard"
            className="flex items-center rounded-xl px-4 py-3 bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-700 font-bold shadow-sm border border-purple-100"
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
        <div className="max-w-4xl mx-auto">
          {/* [MODERN] Tombol Kembali */}
          <div className="mb-4">
            <Link
              to="/admin/dashboard"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Kembali ke Dashboard</span>
            </Link>
          </div>
          <h1 className="text-3xl font-bold mb-6">{pageTitle}</h1>

          {/* [MODERN] Loading Indicator */}
          {loadingData && (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl shadow-lg shadow-purple-100/50">
              <Loader2 className="h-10 w-10 animate-spin text-purple-600" />
              <p className="mt-3 text-sm text-gray-500">Memuat data beasiswa...</p>
            </div>
          )}

          {/* [MODERN] Fetch Error Message */}
          {error && !loadingData && (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl shadow-lg shadow-purple-100/50">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <p className="mt-3 text-base font-medium text-red-600">{error}</p>
            </div>
          )}

          {/* [MODERN] Form Card */}
          {!loadingData && (
            <form onSubmit={handleSubmit} className="overflow-hidden rounded-2xl bg-white shadow-lg shadow-purple-100/50">
              {/* Header Form */}
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-indigo-50">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 p-2 shadow-lg">
                    <GraduationCap className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">{pageTitle}</h2>
                    <p className="text-sm text-gray-600">Isi detail beasiswa di bawah ini</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6 p-6">
                {error && (
                  <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-700 border border-red-200">
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Grid Input Fields */}
                <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">

                  {/* Nama Beasiswa */}
                  <div className="sm:col-span-6">
                    <label htmlFor="nama_beasiswa" className="block text-sm font-semibold text-gray-700 mb-1.5">Nama Beasiswa</label>
                    <div className="relative">
                      <Text className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input type="text" name="nama_beasiswa" id="nama_beasiswa" required value={formData.nama_beasiswa} onChange={handleChange} className="block w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all" />
                    </div>
                  </div>

                  {/* Deskripsi */}
                  <div className="sm:col-span-6">
                    <label htmlFor="deskripsi" className="block text-sm font-semibold text-gray-700 mb-1.5">Deskripsi</label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                      <textarea name="deskripsi" id="deskripsi" rows={4} required value={formData.deskripsi} onChange={handleChange} className="block w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all resize-none" />
                    </div>
                  </div>

                  {/* Kriteria */}
                  <div className="sm:col-span-6">
                    <label htmlFor="kriteria" className="block text-sm font-semibold text-gray-700 mb-1.5">Kriteria</label>
                    <div className="relative">
                      <ListTree className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                      <textarea name="kriteria" id="kriteria" rows={4} required value={formData.kriteria} onChange={handleChange} className="block w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all resize-none" />
                    </div>
                  </div>

                  {/* Kuota */}
                  <div className="sm:col-span-2">
                    <label htmlFor="kuota" className="block text-sm font-semibold text-gray-700 mb-1.5">Kuota</label>
                    <div className="relative">
                      <UsersIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input type="number" name="kuota" id="kuota" required value={formData.kuota} onChange={handleChange} className="block w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all" />
                    </div>
                  </div>

                  {/* Jenis Pembiayaan */}
                  <div className="sm:col-span-2">
                    <label htmlFor="jenis_pembiayaan" className="block text-sm font-semibold text-gray-700 mb-1.5">Jenis Pembiayaan</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <select name="jenis_pembiayaan" id="jenis_pembiayaan" required value={formData.jenis_pembiayaan} onChange={handleChange} className="block w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all appearance-none">
                        <option>Penuh</option>
                        <option>Parsial</option>
                      </select>
                    </div>
                  </div>

                  {/* Kategori */}
                  <div className="sm:col-span-2">
                    <label htmlFor="kategori" className="block text-sm font-semibold text-gray-700 mb-1.5">Kategori</label>
                    <div className="relative">
                      <Sigma className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <select name="kategori" id="kategori" required value={formData.kategori} onChange={handleChange} className="block w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all appearance-none">
                        <option>Akademik</option>
                        <option>Non-Akademik</option>
                        <option>Bantuan Finansial</option>
                      </select>
                    </div>
                  </div>

                  {/* Status Pendaftaran */}
                  <div className="sm:col-span-2">
                    <label htmlFor="status_pendaftaran" className="block text-sm font-semibold text-gray-700 mb-1.5">Status Pendaftaran</label>
                    <div className="relative">
                      <ToggleLeft className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <select name="status_pendaftaran" id="status_pendaftaran" required value={formData.status_pendaftaran} onChange={handleChange} className="block w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all appearance-none">
                        <option>Ditutup</option>
                        <option>Dibuka</option>
                      </select>
                    </div>
                  </div>

                  {/* Tgl Pembukaan */}
                  <div className="sm:col-span-2">
                    <label htmlFor="tgl_pembukaan" className="block text-sm font-semibold text-gray-700 mb-1.5">Tgl Pembukaan</label>
                    <div className="relative">
                      <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input type="date" name="tgl_pembukaan" id="tgl_pembukaan" required value={formData.tgl_pembukaan} onChange={handleChange} className="block w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all" />
                    </div>
                  </div>

                  {/* Tgl Penutupan */}
                  <div className="sm:col-span-2">
                    <label htmlFor="tgl_penutupan" className="block text-sm font-semibold text-gray-700 mb-1.5">Tgl Penutupan</label>
                    <div className="relative">
                      <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input type="date" name="tgl_penutupan" id="tgl_penutupan" required value={formData.tgl_penutupan} onChange={handleChange} className="block w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Form */}
              <div className="bg-gradient-to-r from-gray-50 to-indigo-50/30 px-6 py-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>{isEditMode ? 'Simpan Perubahan' : 'Simpan Beasiswa'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminBeasiswaForm;

