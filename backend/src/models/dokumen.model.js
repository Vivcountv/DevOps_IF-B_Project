// src/models/dokumen.model.js
import pool from '../configs/database.js';

const Dokumen = {
  create: async (dokumenData) => {
    const { nim_mahasiswa, jenis_dokumen, nama_file, path_file } = dokumenData;

    const sql = `
      INSERT INTO dokumen_mahasiswa (nim_mahasiswa, jenis_dokumen, nama_file, path_file)
      VALUES (?, ?, ?, ?)
    `;

    await pool.query(sql, [nim_mahasiswa, jenis_dokumen, nama_file, path_file]);
  },
  findAllByNim: async (nim) => {
    const sql = `
      SELECT id_dokumen, jenis_dokumen, nama_file, path_file, tgl_unggah
      FROM dokumen_mahasiswa
      WHERE nim_mahasiswa = ?
      ORDER BY tgl_unggah DESC
    `;
    const [rows] = await pool.query(sql, [nim]);
    return rows;
  },
  findByIdAndNim: async (id_dokumen, nim) => {
    const sql = `
      SELECT * FROM dokumen_mahasiswa
      WHERE id_dokumen = ? AND nim_mahasiswa = ?
    `;
    const [rows] = await pool.query(sql, [id_dokumen, nim]);
    return rows[0]; // Kembalikan 1 data
  },
  
  // --- FUNGSI BARU: Hapus dokumen berdasarkan ID-nya ---
  deleteById: async (id_dokumen) => {
    const sql = `DELETE FROM dokumen_mahasiswa WHERE id_dokumen = ?`;
    await pool.query(sql, [id_dokumen]);
  }
};



export default Dokumen;