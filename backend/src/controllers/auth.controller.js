// src/controllers/auth.controller.js (BACKEND)
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Mahasiswa from '../models/mahasiswa.model.js';
import Administrator from '../models/administrator.model.js';

// Fungsi Register (tidak berubah)
export const register = async (req, res) => {
  try {
    const { nim, nama_lengkap, email, password } = req.body;
    if (!nim || !nama_lengkap || !email || !password) {
      return res.status(400).json({
        message: "NIM, nama lengkap, email, dan password harus diisi",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newMahasiswa = { nim, nama_lengkap, email, password: hashedPassword };
    await Mahasiswa.create(newMahasiswa);
    res.status(201).json({ message: "Registrasi berhasil!" });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: "NIM atau Email sudah terdaftar." });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// --- FUNGSI LOGIN MAHASISWA (DIPERBAIKI) ---
export const login = async (req, res) => {
  try {
    // 1. Pindahkan destructuring KE DALAM try...catch
    const { email, password } = req.body;

    // 2. Validasi
    if (!email || !password) {
      return res.status(400).json({ message: "Email dan password harus diisi" });
    }

    const mahasiswa = await Mahasiswa.findByEmail(email);
    if (!mahasiswa) {
      return res.status(404).json({ message: "Email tidak ditemukan" });
    }

    if (mahasiswa.status === 'Tidak Aktif') {
      return res.status(403).json({ message: "Akun Anda telah dinonaktifkan." });
    }

    const isPasswordCorrect = await bcrypt.compare(password, mahasiswa.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Password salah" });
    }

    const tokenPayload = {
      nim: mahasiswa.nim,
      email: mahasiswa.email,
      nama: mahasiswa.nama_lengkap
    };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({ message: "Login berhasil!", token: token });

  } catch (error) {
    // 3. Sekarang error (seperti req.body undefined) akan TERTANGKAP
    console.error("Login Mahasiswa Gagal:", error);
    res.status(500).json({
      message: "Terjadi kesalahan pada server saat login.",
      error: error.message,
    });
  }
};

// --- FUNGSI LOGIN ADMIN (DIPERBAIKI) ---
export const adminLogin = async (req, res) => {
  try {
    // 1. Pindahkan destructuring KE DALAM try...catch
    const { email, password } = req.body;

    // 2. Validasi
    if (!email || !password) {
      return res.status(400).json({ message: "Email dan password harus diisi" });
    }

    const admin = await Administrator.findByEmail(email);
    if (!admin) {
      return res.status(404).json({ message: "Akun admin tidak ditemukan" });
    }

    if (admin.status === 'Tidak Aktif') {
      return res.status(403).json({ message: "Akun admin Anda telah dinonaktifkan." });
    }

    const isPasswordCorrect = await bcrypt.compare(password, admin.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Password salah" });
    }

    const tokenPayload = {
      id_admin: admin.id_admin,
      email: admin.email,
      nama: admin.nama_admin,
      role: admin.role
    };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({ message: "Login admin berhasil!", token: token });

  } catch (error) {
    // 3. Sekarang error akan TERTANGKAP
    console.error("Login Admin Gagal:", error);
    res.status(500).json({
      message: "Terjadi kesalahan pada server saat login admin.",
      error: error.message
    });
  }
};