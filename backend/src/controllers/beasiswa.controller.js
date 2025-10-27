import { v4 as uuidv4 } from 'uuid';
import Beasiswa from '../models/beasiswa.model.js';


export const createBeasiswa = async (req, res) => {
  try {
    const id_admin_pembuat = req.user.id_admin; 
    const newBeasiswa = {
      uuid: uuidv4(),
      ...req.body,
      id_admin_pembuat: id_admin_pembuat,
    };

    await Beasiswa.create(newBeasiswa);
    res.status(201).json({ message: "Beasiswa berhasil dibuat!" });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

export const getAllBeasiswa = async (req, res) => {
  try {
    const allBeasiswa = await Beasiswa.findAll();
    res.status(200).json(allBeasiswa);
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

export const getBeasiswaByUuid = async (req, res) => {
  try {
    const { uuid } = req.params; // Ambil uuid dari parameter URL
    const beasiswa = await Beasiswa.findByUuid(uuid);

    // Jika beasiswa dengan uuid tersebut tidak ditemukan
    if (!beasiswa) {
      return res.status(404).json({ message: "Beasiswa tidak ditemukan." });
    }

    res.status(200).json(beasiswa);
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

export const updateBeasiswa = async (req, res) => {
  try {
    const { uuid } = req.params;
    const beasiswaData = req.body;

    const existingBeasiswa = await Beasiswa.findByUuid(uuid);
    if (!existingBeasiswa) {
      return res.status(404).json({ message: "Beasiswa tidak ditemukan." });
    }
    

    await Beasiswa.updateByUuid(uuid, beasiswaData);

    res.status(200).json({ message: "Data beasiswa berhasil diperbarui." });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

export const deleteBeasiswa = async (req, res) => {
  try {
    const { uuid } = req.params;

    const result = await Beasiswa.deleteByUuid(uuid);

    // Cek apakah ada baris yang terhapus
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Beasiswa tidak ditemukan." });
    }

    res.status(200).json({ message: "Beasiswa berhasil dihapus." });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};