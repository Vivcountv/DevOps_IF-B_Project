import pool from '../configs/database.js';

const Mahasiswa = {
  create: async (mahasiswaData) => {
    const { nim, nama_lengkap, email, password } = mahasiswaData;

    const sql = `
      INSERT INTO mahasiswa (nim, nama_lengkap, email, password)
      VALUES (?, ?, ?, ?)
    `;
    await pool.query(sql, [nim, nama_lengkap, email, password]);
  },
  findByEmail: async (email) => {
    const sql = 'SELECT * FROM mahasiswa WHERE email = ?';
    const [rows] = await pool.query(sql, [email]);
    return rows[0];
  },
  findByNim: async (nim) => {
    const sql = `
    SELECT
      nim, nama_lengkap, email, no_hp, alamat, tgl_lahir, agama, -- <-- Tambah di sini
      foto_profil, ipk, jenjang_studi, fakultas, prestasi, organisasi, status
    FROM mahasiswa
    WHERE nim = ?
  `;
    const [rows] = await pool.query(sql, [nim]);
    return rows[0];
  },
  updateFotoProfil: async (nim, filePath) => {
    const sql = `UPDATE mahasiswa SET foto_profil = ? WHERE nim = ?`;
    await pool.query(sql, [filePath, nim]);
  },
  updateProfileData: async (nim, dataToUpdate) => {
    // Ambil key (nama kolom) dan value (nilai) dari data
    const fields = Object.keys(dataToUpdate);
    const values = Object.values(dataToUpdate);

    // Jika tidak ada data yang dikirim, tidak usah lakukan apa-apa
    if (fields.length === 0) {
      return;
    }

    // Buat 'SET' clause secara dinamis
    // Contoh: 'ipk = ?, jenjang_studi = ?, prestasi = ?'
    const setClause = fields.map(field => `${field} = ?`).join(', ');

    const sql = `UPDATE mahasiswa SET ${setClause} WHERE nim = ?`;

    // Kirim nilai dan NIM sebagai parameter query
    await pool.query(sql, [...values, nim]);
  },
  findAll: async () => {
    const sql = `
      SELECT nim, nama_lengkap, email, fakultas, status
      FROM mahasiswa
      ORDER BY nama_lengkap ASC
    `;
    const [rows] = await pool.query(sql);
    return rows;
  },

  // --- FUNGSI BARU: Update status mahasiswa (untuk Admin) ---
  updateStatus: async (nim, status) => {
    const sql = `UPDATE mahasiswa SET status = ? WHERE nim = ?`;
    const [result] = await pool.query(sql, [status, nim]);
    return result;
  }
};



export default Mahasiswa;