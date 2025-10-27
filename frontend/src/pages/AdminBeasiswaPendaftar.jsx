// src/pages/AdminBeasiswaPendaftar.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CSVLink } from 'react-csv'; 
import apiClient from '../services/api';
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  Shield,
  LogOut,
  Loader2,
  AlertCircle,
  Download,
  ArrowLeft,
  ClipboardList,
  CheckCircle,
  XCircle,
  Clock,
  FileCheck,
  FileClock,
  Check,
  ClipboardCheck,
} from 'lucide-react';

const getUserFromToken = () => {
  return { nama: 'Admin Utama', role: 'Super Admin' };
};

function AdminBeasiswaPendaftar() {
  const [pendaftarList, setPendaftarList] = useState([]);
  const [beasiswaNama, setBeasiswaNama] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusError, setStatusError] = useState(null); 
  const [user, setUser] = useState(null); 
  
  
  const { uuid } = useParams(); 

 useEffect(() => {
    setUser(getUserFromToken()); // [BARU]
    
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        setStatusError(null);
        
        const pendaftarPromise = apiClient.get(`/aplikasi/beasiswa/${uuid}`);
        const beasiswaPromise = apiClient.get(`/beasiswa/${uuid}`);

        const [pendaftarResponse, beasiswaResponse] = await Promise.all([
          pendaftarPromise,
          beasiswaPromise
        ]);
        
        setPendaftarList(pendaftarResponse.data);
        setBeasiswaNama(beasiswaResponse.data.nama_beasiswa);

      } catch (err) {
        console.error("Gagal mengambil data pendaftar:", err);
        setError("Gagal memuat data pendaftar.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [uuid]);

  const handleStatusChange = async (uuid_aplikasi, status_baru) => {
    try {
      setStatusError(null); // [BARU]
      await apiClient.put(`/aplikasi/${uuid_aplikasi}/status`, { status_baru });
      setPendaftarList(currentList =>
        currentList.map(pendaftar =>
          pendaftar.uuid_aplikasi === uuid_aplikasi
            ? { ...pendaftar, status_aplikasi: status_baru }
            : pendaftar
        )
      );
    } catch (err) {
      console.error("Gagal update status:", err);
      // [MODERN] Ganti alert() dengan state error
      setStatusError(err.response?.data?.message || "Gagal memperbarui status.");
    }
  };

  // [BARU]
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/admin/login';
  };

  // --- PERSIAPAN DATA UNTUK CSV ---
  const csvHeaders = [
    { label: "NIM", key: "nim" },
    { label: "Nama Lengkap", key: "nama_lengkap" },
    { label: "Email", key: "email" },
    { label: "IPK", key: "ipk" },
    { label: "Jenjang Studi", key: "jenjang_studi" },
    { label: "Fakultas", key: "fakultas" },
    { label: "Status Aplikasi", key: "status_aplikasi" },
    { label: "Tanggal Pengajuan", key: "tgl_pengajuan_formatted" }
  ];

  const csvData = pendaftarList.map(pendaftar => ({
    ...pendaftar,
    ipk: pendaftar.ipk || '-',
    jenjang_studi: pendaftar.jenjang_studi || '-',
    fakultas: pendaftar.fakultas || '-',
    tgl_pengajuan_formatted: new Date(pendaftar.tgl_pengajuan).toLocaleString('id-ID')
  }));
  // ------------------------------------

  // [BARU] Fungsi untuk ekspor CSV manual
  const handleExportCSV = () => {
    // 1. Buat Header
    const headerRow = csvHeaders.map(h => `"${h.label}"`).join(',');

    // 2. Buat Baris Data
    const dataRows = csvData.map(row => 
      csvHeaders.map(header => `"${(row[header.key] || '').toString().replace(/"/g, '""')}"`).join(',')
    );

    // 3. Gabungkan jadi satu string CSV
    const csvString = [headerRow, ...dataRows].join('\n');

    // 4. Buat Blob
    // Tambahkan BOM (Byte Order Mark) untuk memastikan Excel membuka UTF-8 dengan benar
    const blob = new Blob(['\uFEFF' + csvString], { type: 'text/csv;charset=utf-8;' });
    
    // 5. Buat Link Download
    const link = document.createElement('a');
    if (link.download !== undefined) { // Cek dukungan browser
      const url = URL.createObjectURL(blob);
      const filename = `Pendaftar-${beasiswaNama.replace(/\s+/g, '_')}-${new Date().toLocaleDateString('id-ID')}.csv`;
      
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };


  // [BARU] Helper untuk styling select
  const getStatusClasses = (status) => {
    const baseStyle = "w-full rounded-lg border-2 py-2 px-3 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1 transition-colors";
    switch (status) {
      case 'Terkirim':
        return `${baseStyle} bg-blue-100 text-blue-800 border-blue-200`;
      case 'Ditinjau':
        return `${baseStyle} bg-yellow-100 text-yellow-800 border-yellow-200`;
      case 'Lolos Administrasi':
        return `${baseStyle} bg-cyan-100 text-cyan-800 border-cyan-200`;
      case 'Diterima':
        return `${baseStyle} bg-green-100 text-green-800 border-green-200`;
      case 'Ditolak':
        return `${baseStyle} bg-red-100 text-red-800 border-red-200`;
      default:
        return `${baseStyle} bg-gray-100 text-gray-800 border-gray-200`;
    }
  };


  return (
    // [MODERN] Layout dengan Sidebar
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 text-gray-900">
      
      {/* --- Sidebar (Sama seperti Dashboard) --- */}
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
        <div className="max-w-7xl mx-auto">
          
          {/* [MODERN] Tombol kembali */}
          <div className="mb-4">
            <Link 
              to="/admin/dashboard" 
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Kembali ke Dashboard</span>
            </Link>
          </div>

          {/* [MODERN] Header Halaman + Tombol Export */}
          <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-3xl font-bold">Pendaftar Beasiswa</h1>
              <h2 className="mt-1 text-xl font-medium text-purple-600">{beasiswaNama}</h2>
            </div>
            
            {!loading && pendaftarList.length > 0 && (
              <button
                onClick={handleExportCSV}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-green-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/40"
              >
                <Download className="h-5 w-5" />
                <span>Export ke CSV</span>
              </button>
            )}
          </div>

          {/* [MODERN] Notifikasi Status Error */}
          {statusError && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-700 border border-red-200">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span>{statusError}</span>
            </div>
          )}

          {/* [MODERN] Kartu Tabel Pendaftar */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-lg shadow-purple-100/50">
             <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-indigo-50">
               <div className="flex items-center gap-3">
                 <div className="rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 p-2 shadow-lg">
                  <ClipboardList className="h-5 w-5 text-white" />
                 </div>
                 <div>
                  <h2 className="text-lg font-bold text-gray-900">Daftar Pendaftar</h2>
                  <p className="text-sm text-gray-600">Kelola status aplikasi mahasiswa.</p>
                 </div>
               </div>
            </div>
          
            {loading && (
              <div className="flex flex-col items-center justify-center p-12">
                <Loader2 className="h-10 w-10 animate-spin text-purple-600" />
                <p className="mt-3 text-sm text-gray-500">Memuat data pendaftar...</p>
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
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">IPK</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Tgl Daftar</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Status Aplikasi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {pendaftarList.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                          Belum ada pendaftar untuk beasiswa ini.
                        </td>
                      </tr>
                    ) : (
                      pendaftarList.map((pendaftar, index) => (
                        <tr key={pendaftar.uuid_aplikasi} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50 hover:bg-gray-50'}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{pendaftar.nama_lengkap}</td>
                          <td className="px-6 py-4 whitespace-nowGrap text-sm text-gray-600">{pendaftar.nim}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-purple-700">{pendaftar.ipk || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {new Date(pendaftar.tgl_pengajuan).toLocaleDateString('id-ID', {
                              day: 'numeric', month: 'short', year: 'numeric'
                            })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {/* [MODERN] Select yang di-style */}
                            <select
                              value={pendaftar.status_aplikasi}
                              onChange={(e) => handleStatusChange(pendaftar.uuid_aplikasi, e.target.value)}
                              className={getStatusClasses(pendaftar.status_aplikasi)}
                            >
                              <option value="Terkirim">Terkirim</option>
                              <option value="Ditinjau">Ditinjau</option>
                              <option value="Lolos Administrasi">Lolos Administrasi</option>
                              <option value="Diterima">Diterima</option>
                              <option value="Ditolak">Ditolak</option>
                            </select>
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

export default AdminBeasiswaPendaftar;

