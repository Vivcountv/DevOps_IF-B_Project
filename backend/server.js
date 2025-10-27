// server.js (BACKEND)
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; // <-- PASTIKAN INI ADA
import path from 'path';
import { fileURLToPath } from 'url';

// Impor Rute
import pool from './src/configs/database.js';
import authRoutes from './src/routes/auth.routes.js';
import mahasiswaRoutes from './src/routes/mahasiswa.routes.js';
import beasiswaRoutes from './src/routes/beasiswa.routes.js';
import aplikasiRoutes from './src/routes/aplikasi.routes.js';
import adminRoutes from './src/routes/admin.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- MIDDLEWARE PENTING ---
// Keduanya harus ada di sini, SEBELUM rute
app.use(cors()); // <-- Izinkan koneksi dari frontend
app.use(express.json()); // <-- Izinkan server membaca JSON dari req.body
// -------------------------

// Menangani path untuk ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rute dasar
app.get('/', (req, res) => {
  res.send('<h1>🎉 Scholarship API Server is running!</h1>');
});

// --- Rute API ---
// Ini semua harus setelah middleware di atas
app.use('/api/auth', authRoutes);
app.use('/api/mahasiswa', mahasiswaRoutes);
app.use('/api/beasiswa', beasiswaRoutes);
app.use('/api/aplikasi', aplikasiRoutes);
app.use('/api/admin', adminRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server is listening on http://localhost:${PORT}`);
});