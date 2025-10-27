// src/pages/BeasiswaDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../services/api';
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle,
  GraduationCap,
  Bookmark,
  CircleDollarSign,
  XCircle,
  FileText,
  ListChecks,
  Users,
  Calendar,
  CalendarClock,
  Send,
  Info
} from 'lucide-react';

function BeasiswaDetail() {
  const [beasiswa, setBeasiswa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State khusus untuk proses pendaftaran
  const [isApplying, setIsApplying] = useState(false);
  const [applyError, setApplyError] = useState(null);
  const [applySuccess, setApplySuccess] = useState(null);

  const { uuid } = useParams(); // Ambil UUID dari URL

  // 1. Ambil data detail beasiswa saat halaman dimuat
  useEffect(() => {
    const fetchBeasiswaDetail = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/beasiswa/${uuid}`);
        setBeasiswa(response.data);
      } catch (err) {
        console.error("Gagal mengambil detail:", err);
        setError("Gagal memuat detail beasiswa.");
      } finally {
        setLoading(false);
      }
    };

    fetchBeasiswaDetail();
  }, [uuid]); // Jalankan ulang jika uuid berubah

  // 2. Fungsi untuk menangani klik tombol "Daftar"
  const handleApply = async () => {
    setIsApplying(true);
    setApplyError(null);
    setApplySuccess(null);

    try {
      // Panggil endpoint pendaftaran
      const response = await apiClient.post(`/aplikasi/${uuid}`);
      
      // Jika sukses...
      setApplySuccess(response.data.message); // "Pengajuan beasiswa berhasil dikirim!"

    } catch (err) {
      // Jika gagal (misal: sudah terdaftar)...
      if (err.response && err.response.data) {
        setApplyError(err.response.data.message); // "Anda sudah pernah mendaftar"
      } else {
        setApplyError("Terjadi kesalahan. Silakan coba lagi.");
      }
    } finally {
      setIsApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="flex items-center space-x-2 text-gray-600">
           {/* Spinner Icon */}
           <svg className="animate-spin h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">...</svg>
           <span>Memuat detail beasiswa...</span>
        </div>
      </div>
    );
  }

  // Tampilan Error
  if (error || !beasiswa) {
     return (
       <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4 text-center">
         <p className="mb-4 text-lg font-medium text-red-600">{error || 'Beasiswa tidak ditemukan.'}</p>
         <Link to="/dashboard" className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
           Kembali ke Dashboard
         </Link>
       </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
      {/* Header Halaman Modern (seperti Profile.jsx) */}
       <header className="sticky top-0 z-50 border-b border-white/20 bg-white/80 backdrop-blur-xl shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className="flex items-center justify-center h-10 w-10 rounded-xl bg-white border border-gray-200 text-gray-600 shadow-sm transition-all hover:border-purple-300 hover:bg-purple-50 hover:text-purple-600"
            >
              {/* Ganti dengan ikon Lucide */}
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
                {/* Tambah ikon Lucide */}
                <GraduationCap className="h-5 w-5 text-purple-500" />
                Detail Beasiswa
              </h1>
              <p className="text-xs text-gray-500 truncate max-w-xs sm:max-w-md" title={beasiswa.nama_beasiswa}>
                {beasiswa.nama_beasiswa}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Konten Utama */}
      <main className="py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Kartu modern seperti Profile.jsx */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-lg shadow-purple-100/50">
            {/* Header Kartu */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-5">
              <h1 className="text-2xl font-bold text-white leading-tight">
                {beasiswa.nama_beasiswa}
              </h1>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-indigo-800 ring-1 ring-inset ring-indigo-200">
                  {/* Tambah ikon Lucide */}
                  <Bookmark className="h-3 w-3" />
                  {beasiswa.kategori}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-purple-800 ring-1 ring-inset ring-purple-200">
                  {/* Tambah ikon Lucide */}
                  <CircleDollarSign className="h-3 w-3" />
                  {beasiswa.jenis_pembiayaan}
                </span>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                  beasiswa.status_pendaftaran === 'Dibuka' 
                  ? 'bg-green-100 text-green-800 ring-1 ring-inset ring-green-200' 
                  : 'bg-red-100 text-red-800 ring-1 ring-inset ring-red-200'
                }`}>
                  {/* Tambah ikon Lucide dinamis */}
                  {beasiswa.status_pendaftaran === 'Dibuka' ? (
                    <CheckCircle className="h-3 w-3" />
                  ) : (
                    <XCircle className="h-3 w-3" />
                  )}
                  Status: {beasiswa.status_pendaftaran}
                </span>
              </div>
            </div>

            {/* Konten Detail */}
            <div className="p-6 space-y-6">
              {/* Deskripsi */}
              <div>
                <h2 className="flex items-center gap-2 text-base font-bold text-gray-900">
                  <FileText className="h-5 w-5 text-indigo-600" />
                  Deskripsi
                </h2>
                <p className="mt-2 text-sm leading-6 text-gray-700">{beasiswa.deskripsi}</p>
              </div>

              {/* Kriteria */}
              <div className="border-t border-gray-100 pt-6">
                <h2 className="flex items-center gap-2 text-base font-bold text-gray-900">
                  <ListChecks className="h-5 w-5 text-indigo-600" />
                  Kriteria & Persyaratan
                </h2>
                {/* Gunakan whitespace-pre-wrap untuk mempertahankan format (paragraf) */}
                <pre className="mt-2 whitespace-pre-wrap font-sans text-sm leading-6 text-gray-700">{beasiswa.kriteria}</pre>
              </div>

              {/* Informasi Kuota & Tanggal */}
              <div className="border-t border-gray-100 pt-6">
                 <dl className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <dt className="text-sm font-medium leading-6 text-gray-900">Kuota Tersedia</dt>
                      <dd className="text-sm leading-6 text-gray-700">{beasiswa.kuota} orang</dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <dt className="text-sm font-medium leading-6 text-gray-900">Tanggal Pembukaan</dt>
                      <dd className="text-sm leading-6 text-gray-700">
                        {new Date(beasiswa.tgl_pembukaan).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}
                      </dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 sm:col-span-2">
                    <CalendarClock className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <dt className="text-sm font-medium leading-6 text-gray-900">Batas Akhir Pendaftaran</dt>
                      <dd className="text-sm font-semibold leading-6 text-red-600">
                        {new Date(beasiswa.tgl_penutupan).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}
                      </dd>
                    </div>
                  </div>
                </dl>
              </div>
            </div>

            {/* Bagian Pendaftaran (Tombol Apply) */}
            <div className="bg-gradient-to-r from-gray-50 to-indigo-50/30 px-6 py-5 border-t border-gray-200">
              <h2 className="text-base font-semibold leading-6 text-gray-900">Ajukan Pendaftaran</h2>
              
              {/* Pesan Sukses/Error (Style dari Profile.jsx) */}
              {applySuccess && (
                <div className="mt-4 flex items-center gap-2 rounded-xl bg-green-50 p-4 text-sm text-green-700 border border-green-200">
                  <CheckCircle className="h-5 w-5 flex-shrink-0" />
                  <span>{applySuccess}</span>
                </div>
              )}
              {applyError && (
                <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-700 border border-red-200">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <span>{applyError}</span>
                </div>
              )}

              <button
                onClick={handleApply}
                disabled={isApplying || applySuccess || beasiswa.status_pendaftaran === 'Ditutup'}
                className={`mt-4 w-full inline-flex justify-center items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                  beasiswa.status_pendaftaran === 'Ditutup' 
                    ? 'bg-gray-400 shadow-gray-500/30' 
                    : applySuccess 
                    ? 'bg-green-600 shadow-green-500/30' 
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 focus:ring-indigo-500' 
                }`}
              >
                {/* Ganti dengan ikon Lucide */}
                {isApplying ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : applySuccess ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
                
                <span>
                  {beasiswa.status_pendaftaran === 'Ditutup' ? 'Pendaftaran Ditutup' :
                   applySuccess ? 'Anda Sudah Terdaftar' :
                   isApplying ? 'Mengirim Pengajuan...' : 
                   'Daftar Beasiswa Ini'}
                </span>
              </button>
              <p className="mt-3 text-xs text-gray-500 text-center flex items-center justify-center gap-1.5">
                <Info className="h-3 w-3" />
                Pastikan data profil dan dokumen Anda sudah lengkap sebelum mendaftar.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default BeasiswaDetail;
