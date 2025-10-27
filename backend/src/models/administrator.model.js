import pool from '../configs/database.js';

const Administrator = {
  findByEmail: async (email) => {
    const sql = 'SELECT * FROM administrator WHERE email = ?';
    const [rows] = await pool.query(sql, [email]);
    return rows[0];
  },
  findAll: async () => {
    const sql = `
      SELECT id_admin, nama_admin, email, status, created_at
      FROM administrator
      ORDER BY nama_admin ASC
    `;
    const [rows] = await pool.query(sql);
    return rows;
  },

  // --- FUNGSI BARU: Buat admin baru ---
  create: async (adminData) => {
    const { nama_admin, email, password } = adminData;
    const sql = `
      INSERT INTO administrator (nama_admin, email, password, status)
      VALUES (?, ?, ?, 'Aktif')
    `;
    await pool.query(sql, [nama_admin, email, password]);
  },

  // --- FUNGSI BARU: Update status admin ---
  updateStatus: async (id_admin, status) => {
    const sql = `UPDATE administrator SET status = ? WHERE id_admin = ?`;
    const [result] = await pool.query(sql, [status, id_admin]);
    return result;
  }
};

export default Administrator;