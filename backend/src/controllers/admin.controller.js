// src/controllers/admin.controller.js
import Mahasiswa from '../models/mahasiswa.model.js';
import Administrator from '../models/administrator.model.js';
import bcrypt from 'bcryptjs';

// Mengambil semua data mahasiswa
export const getAllMahasiswa = async (req, res) => {
  try {
    const mahasiswaList = await Mahasiswa.findAll();
    res.status(200).json(mahasiswaList);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Mengubah status seorang mahasiswa
export const updateMahasiswaStatus = async (req, res) => {
  try {
    const { nim } = req.params;
    const { status } = req.body; // status akan 'Aktif' atau 'Tidak Aktif'

    // Validasi input
    if (status !== 'Aktif' && status !== 'Tidak Aktif') {
      return res.status(400).json({ message: "Status tidak valid." });
    }

    const result = await Mahasiswa.updateStatus(nim, status);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Mahasiswa tidak ditemukan." });
    }

    res.status(200).json({ message: `Status mahasiswa ${nim} berhasil diubah menjadi ${status}` });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const getAllAdmins = async (req, res) => {
  try {
    const adminList = await Administrator.findAll();
    res.status(200).json(adminList);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Membuat admin baru
export const createAdmin = async (req, res) => {
  try {
    const { nama_admin, email, password } = req.body;

    if (!nama_admin || !email || !password) {
      return res.status(400).json({ message: "Nama, email, dan password harus diisi." });
    }

    // Hash password sebelum disimpan
    const hashedPassword = await bcrypt.hash(password, 10);

    await Administrator.create({
      nama_admin,
      email,
      password: hashedPassword
    });

    res.status(201).json({ message: "Admin baru berhasil dibuat." });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: "Email sudah terdaftar." });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Mengubah status seorang admin
export const updateAdminStatus = async (req, res) => {
  try {
    const { id_admin } = req.params;
    const { status } = req.body;

    // Ambil ID admin yang sedang login dari token
    const loggedInAdminId = req.user.id_admin;

    // --- FITUR KEAMANAN PENTING ---
    // Mencegah admin menonaktifkan dirinya sendiri
    if (parseInt(id_admin) === loggedInAdminId) {
      return res.status(403).json({ message: "Anda tidak dapat menonaktifkan akun Anda sendiri." });
    }
    // ---------------------------------

    if (status !== 'Aktif' && status !== 'Tidak Aktif') {
      return res.status(400).json({ message: "Status tidak valid." });
    }

    const result = await Administrator.updateStatus(id_admin, status);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Admin tidak ditemukan." });
    }

    res.status(200).json({ message: `Status admin berhasil diubah menjadi ${status}` });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};