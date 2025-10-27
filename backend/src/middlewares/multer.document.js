import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/documents/'); 
  },
  filename: (req, file, cb) => {
    const nim = req.user.nim;
    const originalName = file.originalname.replace(/\s+/g, '-');
    const fileName = `${nim}-${Date.now()}-${originalName}`;
    cb(null, fileName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx/;
  const mimetype = allowedTypes.test(file.mimetype);
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    cb(null, true); 
  } else {
    cb(new Error('Hanya file PDF, DOC, atau DOCX yang diizinkan!'), false); 
  }
};


const uploadDocument = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5 
  }
});

export default uploadDocument;