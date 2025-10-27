import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/profiles/'); 
  },
  filename: (req, file, cb) => {
    const nim = req.user.nim;
    const ext = path.extname(file.originalname);
    const fileName = `${nim}-${Date.now()}${ext}`;
    cb(null, fileName);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
    cb(null, true); 
  } else {
    cb(new Error('Hanya file gambar (JPG, PNG) yang diizinkan!'), false);
  }
};

const uploadProfile = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 2 
  }
});

export default uploadProfile;