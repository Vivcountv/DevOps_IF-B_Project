import express from 'express';
import { createAplikasi ,getAplikasiByBeasiswa ,getMyAplikasi,updateStatusAplikasi} from '../controllers/aplikasi.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { isMahasiswa } from '../middlewares/mahasiswa.middleware.js';
import { isAdmin } from '../middlewares/admin.middleware.js';

const router = express.Router();
router.get('/saya', verifyToken, isMahasiswa, getMyAplikasi);
router.post('/:uuid_beasiswa', verifyToken, isMahasiswa, createAplikasi);
router.get('/beasiswa/:uuid_beasiswa', verifyToken, isAdmin, getAplikasiByBeasiswa);
router.put('/:uuid_aplikasi/status', verifyToken, isAdmin, updateStatusAplikasi);
export default router;