import pool from '../configs/database.js';

const Beasiswa = {
  create: async (beasiswaData) => {
    const sql = `
      INSERT INTO beasiswa (uuid, nama_beasiswa, deskripsi, kriteria, kuota, jenis_pembiayaan, kategori, tgl_pembukaan, tgl_penutupan, status_pendaftaran, id_admin_pembuat)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await pool.query(sql, [
      beasiswaData.uuid,
      beasiswaData.nama_beasiswa,
      beasiswaData.deskripsi,
      beasiswaData.kriteria,
      beasiswaData.kuota,
      beasiswaData.jenis_pembiayaan,
      beasiswaData.kategori,
      beasiswaData.tgl_pembukaan,
      beasiswaData.tgl_penutupan,
      beasiswaData.status_pendaftaran,
      beasiswaData.id_admin_pembuat
    ]);
  },

  findAll: async () => {
    const sql = `
      SELECT uuid, nama_beasiswa, deskripsi, jenis_pembiayaan, kategori, tgl_penutupan, status_pendaftaran
      FROM beasiswa
      ORDER BY tgl_penutupan DESC
    `;
    const [rows] = await pool.query(sql);
    return rows;
  },
  findByUuid: async (uuid) => {

    const sql = `SELECT * FROM beasiswa WHERE uuid = ?`;
    const [rows] = await pool.query(sql, [uuid]);
    return rows[0]; 
  },
  updateByUuid: async (uuid, beasiswaData) => {
    const fields = Object.keys(beasiswaData);
    const values = Object.values(beasiswaData);
    
   
    const setClause = fields.map(field => `${field} = ?`).join(', ');

    const sql = `UPDATE beasiswa SET ${setClause} WHERE uuid = ?`;


    const [result] = await pool.query(sql, [...values, uuid]);
    return result;
  },
  deleteByUuid: async (uuid) => {
    const sql = `DELETE FROM beasiswa WHERE uuid = ?`;
    const [result] = await pool.query(sql, [uuid]);
    return result;
  }
};

export default Beasiswa;