import express from 'express';
import { createBeasiswa, getAllBeasiswa ,getBeasiswaByUuid,updateBeasiswa , deleteBeasiswa } from '../controllers/beasiswa.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { isAdmin } from '../middlewares/admin.middleware.js';

const router = express.Router();

router.get('/', getAllBeasiswa);

router.get('/:uuid', getBeasiswaByUuid);

router.post('/', verifyToken, isAdmin, createBeasiswa);

router.put('/:uuid', verifyToken, isAdmin, updateBeasiswa);

router.delete('/:uuid', verifyToken, isAdmin, deleteBeasiswa);



export default router;