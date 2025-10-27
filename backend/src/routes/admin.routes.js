// src/routes/admin.routes.js
import express from 'express';
import { 
  getAllMahasiswa, 
  updateMahasiswaStatus,
  getAllAdmins,
  createAdmin,
  updateAdminStatus
} from '../controllers/admin.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { isAdmin } from '../middlewares/admin.middleware.js';
// Pastikan path ini benar (middlewares pakai 's')
import { isSuperAdmin } from '../middlewares/isSuperAdmin.middleware.js';

const router = express.Router();

// Lindungi semua rute admin
router.use(verifyToken);
router.use(isAdmin);

// --- Rute Manajemen Mahasiswa (Hanya Super Admin) ---
router.get('/mahasiswa', isSuperAdmin, getAllMahasiswa);
router.put('/mahasiswa/:nim/status', isSuperAdmin, updateMahasiswaStatus);

// --- Rute Manajemen Admin (Hanya Super Admin) ---
router.get('/admins', isSuperAdmin, getAllAdmins);
router.post('/admins', isSuperAdmin, createAdmin);
router.put('/admins/:id_admin/status', isSuperAdmin, updateAdminStatus);

export default router;