export const isMahasiswa = (req, res, next) => {
  if (req.user && req.user.nim) {
    next();
  } else {
    res.status(403).json({ message: "Akses ditolak. Rute ini hanya untuk mahasiswa." });
  }
};