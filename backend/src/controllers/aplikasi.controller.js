// src/controllers/aplikasi.controller.js
import { v4 as uuidv4 } from 'uuid';
import Beasiswa from '../models/beasiswa.model.js';
import Aplikasi from '../models/aplikasi.model.js';

export const createAplikasi = async (req, res) => {
  try {
    const { uuid_beasiswa } = req.params;

    const nim_mahasiswa = req.user.nim;

    const beasiswa = await Beasiswa.findByUuid(uuid_beasiswa);
    if (!beasiswa) {
      return res.status(404).json({ message: "Beasiswa tidak ditemukan." });
    }
 
    const id_beasiswa = beasiswa.id_beasiswa; 

    const newAplikasi = {
      uuid: uuidv4(),
      nim_mahasiswa: nim_mahasiswa,
      id_beasiswa: id_beasiswa
    };


    await Aplikasi.create(newAplikasi);

    res.status(201).json({ message: "Pengajuan beasiswa berhasil dikirim!" });

  } catch (error) {

    if (error.code === 'ER_DUP_ENTRY') {
       return res.status(409).json({ message: "Anda sudah pernah mendaftar di beasiswa ini." });
    }

    res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
  
};

export const getAplikasiByBeasiswa = async (req, res) => {
  try {
    const { uuid_beasiswa } = req.params;
    const pendaftar = await Aplikasi.findAllByBeasiswaUuid(uuid_beasiswa);

    res.status(200).json(pendaftar);
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

export const getMyAplikasi = async (req, res) => {
  try {
    const nim_mahasiswa = req.user.nim;

    const riwayat = await Aplikasi.findAllByNim(nim_mahasiswa);

    res.status(200).json(riwayat);
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

export const updateStatusAplikasi = async (req, res) => {
  try {
    const { uuid_aplikasi } = req.params; 
    const { status_baru } = req.body; 

  
    const validStatus = ['Terkirim', 'Ditinjau', 'Lolos Administrasi', 'Ditolak', 'Diterima'];
    if (!status_baru || !validStatus.includes(status_baru)) {
      return res.status(400).json({ 
        message: "Status baru tidak valid atau tidak disediakan." 
      });
    }

    const result = await Aplikasi.updateStatusByUuid(uuid_aplikasi, status_baru);


    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Aplikasi tidak ditemukan." });
    }

    res.status(200).json({ message: `Status aplikasi berhasil diubah menjadi ${status_baru}` });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};