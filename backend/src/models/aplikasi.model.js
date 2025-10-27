import pool from '../configs/database.js';

const Aplikasi = {
  create: async (aplikasiData) => {
    const { uuid, nim_mahasiswa, id_beasiswa } = aplikasiData;

    const sql = `
      INSERT INTO aplikasi_beasiswa (uuid, nim_mahasiswa, id_beasiswa, status_aplikasi)
      VALUES (?, ?, ?, 'Terkirim')
    `;

    await pool.query(sql, [uuid, nim_mahasiswa, id_beasiswa]);
  },
  findAllByBeasiswaUuid: async (uuid_beasiswa) => {
    const sql = `
      SELECT
        a.uuid AS uuid_aplikasi,
        a.status_aplikasi,
        a.tgl_pengajuan,
        m.nim,
        m.nama_lengkap,
        m.email,
        m.ipk,
        m.jenjang_studi,
        m.fakultas
      FROM aplikasi_beasiswa AS a
      JOIN mahasiswa AS m ON a.nim_mahasiswa = m.nim
      JOIN beasiswa AS b ON a.id_beasiswa = b.id_beasiswa
      WHERE b.uuid = ?
      ORDER BY a.tgl_pengajuan ASC;
    `;
    const [rows] = await pool.query(sql, [uuid_beasiswa]);
    return rows;
  },
  findAllByNim: async (nim) => {
    const sql = `
      SELECT
        a.uuid AS uuid_aplikasi,
        a.status_aplikasi,
        a.tgl_pengajuan,
        b.nama_beasiswa,
        b.kategori,
        b.uuid AS uuid_beasiswa
      FROM aplikasi_beasiswa AS a
      JOIN beasiswa AS b ON a.id_beasiswa = b.id_beasiswa
      WHERE a.nim_mahasiswa = ?
      ORDER BY a.tgl_pengajuan DESC;
    `;
    const [rows] = await pool.query(sql, [nim]);
    return rows;
  },
  updateStatusByUuid: async (uuid_aplikasi, status_baru) => {
    const sql = `
      UPDATE aplikasi_beasiswa
      SET status_aplikasi = ?
      WHERE uuid = ?
    `;
    const [result] = await pool.query(sql, [status_baru, uuid_aplikasi]);
    return result;
  },
  

};

export default Aplikasi;