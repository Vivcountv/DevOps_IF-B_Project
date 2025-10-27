// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../services/api';
import {
  ArrowLeft,
  Camera,
  User,
  GraduationCap,
  FileText,
  Upload,
  Trash2,
  CheckCircle,
  AlertCircle,
  Phone,
  Calendar,
  MapPin,
  Award,
  Users,
  Download,
  Sparkles, 
  Save,
  Mail,     
  IdCard,   
} from 'lucide-react';

const InputField = ({ id, label, icon: Icon, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-2">
      {label}
    </label>
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />}
      <input
        id={id}
        {...props}
        className={`block w-full ${Icon ? 'pl-10' : 'px-4'} pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all`}
      />
    </div>
  </div>
);

const TextareaField = ({ id, label, icon: Icon, ...props }) => (
  <div>
    <label htmlFor={id} className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
      {Icon && <Icon className="h-4 w-4 text-indigo-600" />}
      {label}
    </label>
    <div className="relative">
      {Icon && !props.rows && <Icon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />}
      <textarea
        id={id}
        {...props}
        className={`block w-full ${Icon && !props.rows ? 'pl-10' : 'px-4'} pr-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none`}
      />
    </div>
  </div>
);


function Profile() {
  // --- STATE ---
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({ /* ... (data teks) */ });
  
  // State Foto
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);

  // State Dokumen (BARU)
  const [dokumenList, setDokumenList] = useState([]);
  const [docFile, setDocFile] = useState(null);
  const [jenisDokumen, setJenisDokumen] = useState('');
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const [docError, setDocError] = useState(null);
  const [docSuccess, setDocSuccess] = useState(null);
  
  // State Umum
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // --- EFEK (FETCH DATA) ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Ambil profil DAN daftar dokumen secara bersamaan
        const profilePromise = apiClient.get('/mahasiswa/profile');
        const dokumenPromise = apiClient.get('/mahasiswa/dokumen');
        
        const [profileRes, dokumenRes] = await Promise.all([profilePromise, dokumenPromise]);
        
        const data = profileRes.data;
        setProfile(data);
        setDokumenList(dokumenRes.data); // Simpan daftar dokumen
        
        // Isi form data teks
        setFormData({
          ipk: data.ipk || '',
          jenjang_studi: data.jenjang_studi || '',
          fakultas: data.fakultas || '',
          prestasi: data.prestasi || '',
          organisasi: data.organisasi || ''
        });
        
      } catch (err) {
        console.error("Gagal mengambil data:", err);
        setError("Gagal memuat data profil.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- HANDLER DATA TEKS ---
  const handleChange = (e) => {
    setSuccess(null); setError(null);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true); setError(null); setSuccess(null);
    try {
      await apiClient.put('/mahasiswa/profile', formData);
      setSuccess("Profil berhasil diperbarui!");
    } catch (err) { setError("Gagal menyimpan perubahan."); }
    finally { setIsSaving(false); }
  };

  // --- HANDLER FOTO PROFIL ---
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile); setPreview(URL.createObjectURL(selectedFile));
      setUploadError(null); setUploadSuccess(null);
    }
  };
  const handleFotoSubmit = async (e) => {
    e.preventDefault();
    if (!file) { setUploadError("Silakan pilih file."); return; }
    setIsUploading(true); setUploadError(null); setUploadSuccess(null);
    const fileFormData = new FormData();
    fileFormData.append('foto', file);
    try {
      const res = await apiClient.put('/mahasiswa/profile/foto', fileFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUploadSuccess("Foto profil berhasil diperbarui!");
      setProfile({ ...profile, foto_profil: res.data.filePath });
      setFile(null); setPreview(null);
    } catch (err) {
      setUploadError(err.response?.data?.message || "Upload gagal.");
    } finally { setIsUploading(false); }
  };

  // --- HANDLER DOKUMEN (BARU) ---
  const handleDocFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setDocFile(selectedFile);
      setDocError(null); setDocSuccess(null);
    }
  };

  const handleDocSubmit = async (e) => {
    e.preventDefault();
    if (!docFile || !jenisDokumen) {
      setDocError("Silakan pilih file dan isi jenis dokumen.");
      return;
    }
    setIsUploadingDoc(true); setDocError(null); setDocSuccess(null);
    const docFormData = new FormData();
    docFormData.append('dokumen', docFile);
    docFormData.append('jenis_dokumen', jenisDokumen);
    try {
      await apiClient.post('/mahasiswa/dokumen', docFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setDocSuccess("Dokumen berhasil di-upload!");
      // Reset form & re-fetch list
      setDocFile(null); setJenisDokumen('');
      const dokumenRes = await apiClient.get('/mahasiswa/dokumen');
      setDokumenList(dokumenRes.data);
    } catch (err) {
      setDocError(err.response?.data?.message || "Upload gagal.");
    } finally { setIsUploadingDoc(false); }
  };

  const handleDeleteDokumen = async (id_dokumen) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus dokumen ini?")) return;
    try {
      await apiClient.delete(`/mahasiswa/dokumen/${id_dokumen}`);
      // Hapus dari state
      setDokumenList(dokumenList.filter(doc => doc.id_dokumen !== id_dokumen));
    } catch (err) {
      console.error("Gagal hapus dokumen:", err);
      alert("Gagal menghapus dokumen.");
    }
  };
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="relative mx-auto mb-4 h-16 w-16">
            <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-blue-600"></div>
          </div>
          <p className="text-sm font-medium text-gray-600">Memuat profil...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
        <div className="rounded-2xl bg-white p-8 shadow-xl max-w-md text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <p className="mb-6 text-lg font-medium text-gray-900">{error}</p>
          <a
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Dashboard
          </a>
        </div>
      </div>
    );
  }

  // Main Profile Page
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header Modern */}
      <header className="sticky top-0 z-50 border-b border-white/20 bg-white/80 backdrop-blur-xl shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <a
                href="/dashboard"
                className="flex items-center justify-center h-10 w-10 rounded-xl bg-white border border-gray-200 text-gray-600 shadow-sm transition-all hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
              >
                <ArrowLeft className="h-5 w-5" />
              </a>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-500" />
                  Profil Saya
                </h1>
                <p className="text-xs text-gray-500">Kelola informasi pribadi Anda</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">

          {/* [BARU] Card Info Pengguna */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-lg shadow-blue-100/50">
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <img
                  className="relative h-20 w-20 rounded-full border-4 border-white object-cover shadow-xl"
                  src={profile?.foto_profil ? `http://localhost:5000${profile.foto_profil}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.nama_lengkap || 'User')}&background=8B5CF6&color=fff&size=200`}
                  alt="Foto Profil"
                />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{profile.nama_lengkap}</h2>
                  <p className="text-sm text-gray-500">{profile.jenjang_studi}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3 rounded-xl bg-blue-50 p-3">
                  <IdCard className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <div>
                    <span className="text-xs font-semibold text-blue-800">NIM</span>
                    <p className="text-sm font-medium text-gray-700">{profile.nim}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-indigo-50 p-3">
                  <Mail className="h-5 w-5 text-indigo-600 flex-shrink-0" />
                  <div>
                    <span className="text-xs font-semibold text-indigo-800">Email</span>
                    <p className="text-sm font-medium text-gray-700">{profile.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Card Upload Foto - Modern */}
          <form onSubmit={handleFotoSubmit} className="overflow-hidden rounded-2xl bg-white shadow-lg shadow-blue-100/50">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-5 border-b border-blue-100">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 p-2 shadow-lg">
                  <Camera className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Foto Profil</h2>
                  <p className="text-sm text-gray-600">Ganti foto profil Anda (JPG/PNG, maks 2MB)</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {uploadSuccess && (
                <div className="mb-4 flex items-center gap-2 rounded-xl bg-green-50 p-4 text-sm text-green-700 border border-green-200">
                  <CheckCircle className="h-5 w-5 flex-shrink-0" />
                  <span>{uploadSuccess}</span>
                </div>
              )}
              {uploadError && (
                <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-700 border border-red-200">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative group">
                  <div className="absolute -inset-2 rounded-full bg-blue-400 blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                  <img
                    className="relative h-32 w-32 rounded-full border-4 border-white object-cover shadow-xl"
                    src={preview || (profile?.foto_profil ? `http://localhost:5000${profile.foto_profil}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.nama_lengkap || 'User')}&background=8B5CF6&color=fff&size=200`)}
                    alt="Foto Profil"
                  />
                  <div className="absolute bottom-1 right-1 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 p-2 shadow-lg ring-2 ring-white">
                    <Camera className="h-4 w-4 text-white" />
                  </div>
                </div>

                <div className="flex-1 space-y-3 w-full">
                  <label className="group/btn cursor-pointer flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-white px-6 py-4 text-sm font-medium text-gray-700 transition-all hover:border-blue-400 hover:bg-blue-50">
                    <Upload className="h-5 w-5 text-gray-400 group-hover/btn:text-blue-600 transition-colors" />
                    <span className="group-hover/btn:text-blue-600 transition-colors">
                      {file ? 'Ganti File' : 'Pilih Foto Baru'}
                    </span>
                    <input
                      type="file"
                      className="sr-only"
                      accept="image/png, image/jpeg, image/jpg"
                      onChange={handleFileChange}
                    />
                  </label>
                  {file && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 px-4 py-2 rounded-lg">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <span className="truncate">{file.name}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-gray-50 to-blue-50/30 px-6 py-4 flex justify-end">
              <button
                type="submit"
                disabled={isUploading || !file}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
              >
                {isUploading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span>Mengupload...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    <span>Upload Foto</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Card Data Diri - Modern */}
          <form onSubmit={handleSubmit} className="overflow-hidden rounded-2xl bg-white shadow-lg shadow-blue-100/50">
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-5 border-b border-indigo-100">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-gradient-to-br from-indigo-600 to-blue-600 p-2 shadow-lg">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Data Diri</h2>
                  <p className="text-sm text-gray-600">Perbarui informasi pribadi dan akademik Anda</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-8">
              {success && (
                <div className="flex items-center gap-2 rounded-xl bg-green-50 p-4 text-sm text-green-700 border border-green-200">
                  <CheckCircle className="h-5 w-5 flex-shrink-0" />
                  <span>{success}</span>
                </div>
              )}
              {error && (
                <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-700 border border-red-200">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Data Pribadi Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b-2 border-blue-100">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <h3 className="text-base font-bold text-gray-900">Data Pribadi</h3>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <InputField
                    label="Nomor HP"
                    id="no_hp"
                    name="no_hp"
                    type="tel"
                    icon={Phone}
                    value={formData.no_hp}
                    onChange={handleChange}
                    placeholder="08..."
                  />
                  <InputField
                    label="Tanggal Lahir"
                    id="tgl_lahir"
                    name="tgl_lahir"
                    type="date"
                    icon={Calendar}
                    value={formData.tgl_lahir}
                    onChange={handleChange}
                  />
                  <InputField
                    label="Agama"
                    id="agama"
                    name="agama"
                    type="text"
                    value={formData.agama}
                    onChange={handleChange}
                    placeholder="Contoh: Islam"
                  />
                  <div className="sm:col-span-2">
                     <TextareaField
                        label="Alamat Lengkap"
                        id="alamat"
                        name="alamat"
                        icon={MapPin}
                        rows={3}
                        value={formData.alamat}
                        onChange={handleChange}
                        placeholder="Jalan, Nomor, Kelurahan, Kecamatan, Kota/Kab, Provinsi, Kode Pos"
                        className="block w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Data Akademik Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b-2 border-indigo-100">
                  <GraduationCap className="h-5 w-5 text-indigo-600" />
                  <h3 className="text-base font-bold text-gray-900">Data Akademik & Organisasi</h3>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <InputField
                    label="IPK"
                    id="ipk"
                    name="ipk"
                    type="number"
                    step="0.01"
                    value={formData.ipk}
                    onChange={handleChange}
                    placeholder="Contoh: 3.75"
                    className="block w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                  <InputField
                    label="Jenjang Studi"
                    id="jenjang_studi"
                    name="jenjang_studi"
                    type="text"
                    value={formData.jenjang_studi}
                    onChange={handleChange}
                    placeholder="Contoh: S1 Teknik Informatika"
                    className="block w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                  <div className="sm:col-span-2">
                    <InputField
                      label="Fakultas"
                      id="fakultas"
                      name="fakultas"
                      type="text"
                      value={formData.fakultas}
                      onChange={handleChange}
                      placeholder="Contoh: Fakultas Teknologi dan Desain"
                      className="block w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <TextareaField
                      label="Prestasi (Non-Akademik)"
                      id="prestasi"
                      name="prestasi"
                      icon={Award}
                      rows={3}
                      value={formData.prestasi}
                      onChange={handleChange}
                      placeholder="Tuliskan prestasi Anda..."
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <TextareaField
                      label="Pengalaman Organisasi"
                      id="organisasi"
                      name="organisasi"
                      icon={Users}
                      rows={3}
                      value={formData.organisasi}
                      onChange={handleChange}
                      placeholder="Tuliskan pengalaman organisasi Anda..."
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-gray-50 to-indigo-50/30 px-6 py-4 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Simpan Perubahan</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Card Manajemen Dokumen - Modern */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-lg shadow-blue-100/50">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-5 border-b border-green-100">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-gradient-to-br from-green-600 to-emerald-600 p-2 shadow-lg">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Manajemen Dokumen</h2>
                  <p className="text-sm text-gray-600">Upload CV, Transkrip, Sertifikat (PDF, DOC, DOCX - maks 5MB)</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleDocSubmit} className="p-6 border-b border-gray-100">
              {docSuccess && (
                <div className="mb-4 flex items-center gap-2 rounded-xl bg-green-50 p-4 text-sm text-green-700 border border-green-200">
                  <CheckCircle className="h-5 w-5 flex-shrink-0" />
                  <span>{docSuccess}</span>
                </div>
              )}
              {docError && (
                <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-700 border border-red-200">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <span>{docError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <input
                  type="text"
                  name="jenis_dokumen"
                  id="jenis_dokumen"
                  value={jenisDokumen}
                  onChange={(e) => {
                    setJenisDokumen(e.target.value);
                    setDocError(null);
                    setDocSuccess(null);
                  }}
                  placeholder="Jenis Dokumen (Contoh: CV)"
                  className="block w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
                />

                <div className="sm:col-span-2">
                   <label className="group/btn cursor-pointer w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 transition-all hover:border-green-400 hover:bg-green-50">
                    <Upload className="h-5 w-5 text-gray-400 group-hover/btn:text-green-600 transition-colors" />
                    <span className={`group-hover/btn:text-green-600 transition-colors ${docFile ? 'text-green-700' : ''}`}>
                      {docFile ? docFile.name : 'Pilih File Dokumen'}
                    </span>
                    <input
                      type="file"
                      id="dokumen"
                      className="sr-only"
                      accept=".pdf,.doc,.docx"
                      onChange={handleDocFileChange}
                    />
                  </label>
                </div>
              </div>
               <div className="flex justify-end mt-4">
                 <button
                    type="submit"
                    disabled={isUploadingDoc || !docFile || !jenisDokumen}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-green-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUploadingDoc ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        <span>Mengupload...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4" />
                        <span>Upload Dokumen</span>
                      </>
                    )}
                  </button>
               </div>
            </form>
            
            {/* [BARU] Daftar Dokumen Terupload */}
            <div className="p-6">
               <h3 className="text-base font-bold text-gray-900 mb-4">Dokumen Tersimpan</h3>
               {dokumenList.length === 0 ? (
                 <p className="text-center text-sm text-gray-500 py-4">Belum ada dokumen yang diupload.</p>
               ) : (
                 <ul className="space-y-3">
                  {dokumenList.map((doc) => (
                    <li key={doc.id_dokumen} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-sm transition-all">
                      <div className="flex items-center gap-3">
                        <FileText className="h-6 w-6 text-green-600 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{doc.jenis_dokumen}</p>
                          <p className="text-xs text-gray-500">{doc.nama_file}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto">
                        <a
                          href={doc.path_file}
                          download
                          className="flex-1 sm:flex-none w-full flex items-center justify-center gap-2 rounded-lg bg-green-100 px-4 py-2 text-xs font-semibold text-green-700 transition-all hover:bg-green-200"
                        >
                          <Download className="h-4 w-4" />
                          <span>Download</span>
                        </a>
                        <button
                          onClick={() => handleDeleteDokumen(doc.id_dokumen)}
                          className="flex-1 sm:flex-none w-full flex items-center justify-center gap-2 rounded-lg bg-red-100 px-4 py-2 text-xs font-semibold text-red-700 transition-all hover:bg-red-200"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </li>
                  ))}
                 </ul>
               )}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

export default Profile;
