// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import apiClient from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  LogOut, 
  User, 
  Award, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  FileText,
  TrendingUp,
  Sparkles
} from 'lucide-react';

function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [beasiswaList, setBeasiswaList] = useState([]);
  const [riwayatAplikasi, setRiwayatAplikasi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null); 
        const profilePromise = apiClient.get('/mahasiswa/profile');
        const beasiswaPromise = apiClient.get('/beasiswa');
        const riwayatPromise = apiClient.get('/aplikasi/saya');
        const [profileResponse, beasiswaResponse, riwayatResponse] = await Promise.all([
          profilePromise, beasiswaPromise, riwayatPromise
        ]);
        setProfile(profileResponse.data);
        setBeasiswaList(beasiswaResponse.data);
        setRiwayatAplikasi(riwayatResponse.data);
      } catch (err) {
        console.error("Gagal mengambil data:", err);
        setError("Gagal memuat data dashboard. Coba refresh halaman atau login kembali.");
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          handleLogout(); // Paksa logout jika token tidak valid
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/'); 
  };

   // Tampilan Loading dengan animasi modern
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="relative mx-auto mb-4 h-16 w-16">
            <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-blue-600"></div>
          </div>
          <p className="text-sm font-medium text-gray-600">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  // Tampilan Error
  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
        <div className="rounded-2xl bg-white p-8 shadow-xl max-w-md text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-6 w-6 text-red-600" />
          </div>
          <p className="mb-6 text-lg font-medium text-gray-900">{error}</p>
          <button
            onClick={handleLogout}
            className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Kembali ke Login
          </button>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Diterima': return <CheckCircle className="h-4 w-4" />;
      case 'Ditolak': return <XCircle className="h-4 w-4" />;
      case 'Ditinjau': return <Clock className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  // Tampilan Dashboard Utama
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header Modern dengan Glassmorphism */}
      <header className="sticky top-0 z-50 border-b border-white/20 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 p-2 shadow-lg">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Dashboard Beasiswa
                </h1>
                <p className="text-xs text-gray-500">Kelola beasiswa Anda</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="group flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 shadow-sm transition-all hover:border-red-300 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Konten Utama */}
      <main className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            
            {/* Kolom Kiri: Profil & Riwayat */}
            <div className="lg:col-span-1 space-y-6">
              {/* Kartu Profil Modern */}
              {profile && (
                <div className="group overflow-hidden rounded-2xl bg-white shadow-lg shadow-blue-100/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-200/50">
                  {/* Header dengan Gradient */}
                  <div className="h-24 bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.1)_50%,transparent_75%,transparent_100%)]"></div>
                  </div>
                  
                  <div className="relative px-6 pb-6">
                    {/* Foto Profil */}
                    <div className="flex justify-center -mt-12 mb-4">
                      <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-blue-400 blur-xl opacity-40 animate-pulse"></div>
                        <img
                          className="relative h-24 w-24 rounded-full border-4 border-white object-cover shadow-xl"
                          src={profile.foto_profil ? `http://localhost:5000${profile.foto_profil}` : 'https://ui-avatars.com/api/?name=' + encodeURIComponent(profile.nama_lengkap) + '&background=8B5CF6&color=fff&size=200'}
                          alt="Foto Profil"
                        />
                      </div>
                    </div>

                    {/* Info Profil */}
                    <div className="text-center mb-4">
                      <h2 className="text-lg font-bold text-gray-900 mb-1">
                        {profile.nama_lengkap}
                      </h2>
                      <p className="text-sm font-medium text-blue-600">{profile.nim}</p>
                      <p className="text-xs text-gray-500 mt-1">{profile.email}</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-3 text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <TrendingUp className="h-4 w-4 text-blue-600" />
                          <span className="text-xs font-medium text-gray-600">IPK</span>
                        </div>
                        <p className="text-xl font-bold text-blue-600">{profile.ipk || '-'}</p>
                      </div>
                      <div className="rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 p-3 text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Award className="h-4 w-4 text-indigo-600" />
                          <span className="text-xs font-medium text-gray-600">Jenjang</span>
                        </div>
                        <p className="text-xl font-bold text-indigo-600">{profile.jenjang_studi || '-'}</p>
                      </div>
                    </div>

                    {/* Button Edit */}
                    <a
                      href="/profile"
                      className="group/btn flex items-center justify-center gap-2 w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-[1.02]"
                    >
                      <User className="h-4 w-4" />
                      <span>Edit Profil & Dokumen</span>
                      <svg className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                </div>
              )}

              {/* Kartu Riwayat Modern */}
              <div className="overflow-hidden rounded-2xl bg-white shadow-lg shadow-blue-100/50">
                <div className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <h2 className="text-base font-bold text-gray-900">
                      Riwayat Pendaftaran
                    </h2>
                  </div>
                </div>
                <div className="p-6">
                  {riwayatAplikasi.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                        <FileText className="h-6 w-6 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-600">Belum ada riwayat pendaftaran</p>
                    </div>
                  ) : (
                    <ul className="space-y-3">
                      {riwayatAplikasi.map((app) => (
                        <li key={app.uuid_aplikasi}>
                          <a 
                            href={`/beasiswa/${app.uuid_beasiswa}`}
                            className="block rounded-xl border border-gray-100 bg-gradient-to-br from-gray-50 to-white p-4 transition-all duration-300 hover:border-blue-200 hover:shadow-md hover:shadow-blue-100/50"
                          >
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
                                {app.nama_beasiswa}
                              </h3>
                              <span className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ${
                                app.status_aplikasi === 'Diterima' ? 'bg-green-100 text-green-700' :
                                app.status_aplikasi === 'Ditolak' ? 'bg-red-100 text-red-700' :
                                app.status_aplikasi === 'Ditinjau' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-blue-100 text-blue-700'}`}
                              >
                                {getStatusIcon(app.status_aplikasi)}
                                {app.status_aplikasi}
                              </span>
                            </div>
                            <p className="flex items-center gap-1.5 text-xs text-gray-500">
                              <Calendar className="h-3 w-3" />
                              {new Date(app.tgl_pengajuan).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'})}
                            </p>
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {/* Kolom Kanan: Daftar Beasiswa */}
            <div className="lg:col-span-2">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-blue-600" />
                    Beasiswa Tersedia
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">Temukan beasiswa yang sesuai untuk Anda</p>
                </div>
              </div>

              {beasiswaList.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white p-12 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                    <Award className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-600">Belum ada beasiswa tersedia</p>
                  <p className="text-xs text-gray-500 mt-1">Cek kembali nanti</p>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
                  {beasiswaList.map((beasiswa) => (
                    <div 
                      key={beasiswa.uuid} 
                      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-lg shadow-blue-100/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-200/50 hover:-translate-y-1"
                    >
                      {/* Header Card dengan Gradient */}
                      <div className="relative h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600">
                        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,.3)_50%,transparent_100%)] animate-shimmer"></div>
                      </div>

                      <div className="flex-1 p-6">
                        {/* Badge & Status */}
                        <div className="flex items-center justify-between mb-3">
                          <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                            beasiswa.kategori === 'Akademik' ? 'bg-blue-100 text-blue-700' :
                            beasiswa.kategori === 'Non-Akademik' ? 'bg-green-100 text-green-700' :
                            'bg-yellow-100 text-yellow-700'}`}
                          >
                            <Award className="h-3 w-3" />
                            {beasiswa.kategori}
                          </span>
                          <span className={`flex items-center gap-1 text-xs font-bold ${
                            beasiswa.status_pendaftaran === 'Dibuka' ? 'text-green-600' : 'text-red-600'}`}
                          >
                            <div className={`h-2 w-2 rounded-full ${
                              beasiswa.status_pendaftaran === 'Dibuka' ? 'bg-green-600 animate-pulse' : 'bg-red-600'}`}
                            ></div>
                            {beasiswa.status_pendaftaran}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {beasiswa.nama_beasiswa}
                        </h3>
                        
                        <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                          {beasiswa.deskripsi}
                        </p>

                        {/* Deadline */}
                        <div className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-2">
                          <Clock className="h-4 w-4 text-blue-600" />
                          <span className="text-xs font-medium text-gray-700">
                            Batas: {new Date(beasiswa.tgl_penutupan).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </span>
                        </div>
                      </div>

                      {/* Footer Button */}
                      <div className="border-t border-gray-100 bg-gradient-to-br from-gray-50 to-white p-4">
                        <a
                          href={`/beasiswa/${beasiswa.uuid}`}
                          className="group/btn flex items-center justify-center gap-2 w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/40"
                        >
                          <span>Lihat Detail & Daftar</span>
                          <svg className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;