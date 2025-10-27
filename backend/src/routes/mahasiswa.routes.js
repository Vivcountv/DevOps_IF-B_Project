import express from 'express';
import { getMyProfile ,uploadFotoProfil,updateMyProfile,uploadDokumen,getAllDokumen,deleteDokumen} from '../controllers/mahasiswa.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { isMahasiswa } from '../middlewares/mahasiswa.middleware.js';
import uploadProfile from '../middlewares/multer.config.js';
import uploadDocument from '../middlewares/multer.document.js';

const router = express.Router();
router.get('/dokumen', verifyToken, isMahasiswa, getAllDokumen);    
router.get('/profile', verifyToken, isMahasiswa, getMyProfile);
router.put('/profile', verifyToken, isMahasiswa, updateMyProfile);
router.delete('/dokumen/:id_dokumen', verifyToken, isMahasiswa, deleteDokumen);
router.put(
  '/profile/foto',
  verifyToken,
  isMahasiswa,
  uploadProfile.single('foto'), 
  uploadFotoProfil
);
router.post(
  '/dokumen',
  verifyToken,
  isMahasiswa,
  uploadDocument.single('dokumen'), // 'dokumen' adalah nama field
  uploadDokumen
);
router.post(
  '/dokumen',
  verifyToken,
  isMahasiswa,
  uploadDocument.single('dokumen'),
  uploadDokumen
);
export default router;