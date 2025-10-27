import Mahasiswa from '../models/mahasiswa.model.js';
import Dokumen from '../models/dokumen.model.js';
import fs from 'fs/promises'; // <-- Impor File System (Promise version)
import path from 'path'; // <-- Impor Path
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getMyProfile = async (req, res) => {
  try {
    const nim = req.user.nim;

    const profile = await Mahasiswa.findByNim(nim);

    if (!profile) {
      return res.status(404).json({ message: "Profil tidak ditemukan." });
    }

    res.status(200).json(profile);

  } catch (error) {
    res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: error.message,
    });
  }
};

export const uploadFotoProfil = async (req, res) => {
  try {
    // 1. Cek apakah file berhasil di-upload
    if (!req.file) {
      return res.status(400).json({ message: "File tidak ter-upload." });
    }

    const filePath = `/uploads/profiles/${req.file.filename}`;

    // 3. Ambil NIM dari token
    const nim = req.user.nim;

    // 4. Simpan path file ke database
    await Mahasiswa.updateFotoProfil(nim, filePath);

    res.status(200).json({
      message: "Foto profil berhasil di-upload!",
      filePath: filePath
    });

  } catch (error) {
    res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: error.message
    });
  }
};

export const updateMyProfile = async (req, res) => {
  try {
    const nim = req.user.nim; 
    const data = req.body;

    const allowedFields = [
    'ipk', 'jenjang_studi', 'fakultas', 'prestasi', 'organisasi',
    'no_hp', 'alamat', 'tgl_lahir', 'agama' 
  ];
  const dataToUpdate = {};

  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      // Khusus untuk tanggal lahir, pastikan tidak string kosong
      if (field === 'tgl_lahir' && data[field] === '') {
          dataToUpdate[field] = null; // Kirim null jika kosong
      } else {
          dataToUpdate[field] = data[field];
      }
    }
  }

    for (const field of allowedFields) {
      // Jika field ada di body request, tambahkan ke dataToUpdate
      if (data[field] !== undefined) {
        dataToUpdate[field] = data[field];
      }
    }

    // Jika tidak ada data valid yang dikirim
    if (Object.keys(dataToUpdate).length === 0) {
      return res.status(400).json({ message: "Tidak ada data valid yang dikirim untuk di-update." });
    }

    // Panggil model untuk update
    await Mahasiswa.updateProfileData(nim, dataToUpdate);

    res.status(200).json({
      message: "Profil berhasil diperbarui!",
      updatedData: dataToUpdate
    });

  } catch (error) {
    res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: error.message
    });
  }
};
export const uploadDokumen = async (req, res) => {
  try {
    // 1. Cek file
    if (!req.file) {
      return res.status(400).json({ message: "File tidak ter-upload." });
    }

    // 2. Ambil 'jenis_dokumen' dari body
    const { jenis_dokumen } = req.body;
    if (!jenis_dokumen) {
      return res.status(400).json({ message: "Jenis dokumen harus diisi." });
    }

    // 3. Siapkan data untuk disimpan
    const dokumenData = {
      nim_mahasiswa: req.user.nim, // Ambil NIM dari token
      jenis_dokumen: jenis_dokumen, // Contoh: "CV", "Transkrip"
      nama_file: req.file.filename, // Nama file unik dari multer
      path_file: `/uploads/documents/${req.file.filename}` // Path untuk diakses web
    };

    // 4. Simpan ke tabel 'dokumen_mahasiswa'
    await Dokumen.create(dokumenData);

    res.status(201).json({
      message: "Dokumen berhasil di-upload!",
      dokumen: dokumenData
    });

  } catch (error) {
    res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: error.message
    });
  }
};

export const getAllDokumen = async (req, res) => {
  try {
    const nim = req.user.nim; // Ambil NIM dari token
    const daftarDokumen = await Dokumen.findAllByNim(nim);

    res.status(200).json(daftarDokumen);
  } catch (error) {
    res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: error.message
    });
  }
};

export const deleteDokumen = async (req, res) => {
  try {
    const { id_dokumen } = req.params; // Ambil ID dari URL
    const nim = req.user.nim; // Ambil NIM dari token

    // 1. Cek kepemilikan dan ambil data dokumen
    const dokumen = await Dokumen.findByIdAndNim(id_dokumen, nim);

    if (!dokumen) {
      return res.status(404).json({ message: "Dokumen tidak ditemukan atau Anda tidak punya akses." });
    }

    // 2. Tentukan path file fisik di server
    // doc.path_file = /uploads/documents/namafile.pdf
    // __dirname = .../beasiswa-backend/src/controllers
    // Kita perlu naik 2 level ke root folder
    const fullPath = path.join(__dirname, '..', '..', dokumen.path_file);
    
    // 3. Hapus data dari database
    await Dokumen.deleteById(id_dokumen);
    
    // 4. Hapus file fisik dari server
    try {
      await fs.unlink(fullPath); // Hapus file
    } catch (fileErr) {
      // Jika file tidak ada, tidak masalah, tapi log error-nya
      console.error("Gagal menghapus file fisik:", fileErr.message);
    }
    
    res.status(200).json({ message: "Dokumen berhasil dihapus." });

  } catch (error) {
    res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: error.message
    });
  }
};