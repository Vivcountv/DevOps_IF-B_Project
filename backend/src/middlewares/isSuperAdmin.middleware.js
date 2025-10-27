export const isSuperAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'Super Admin') {
    next();
  } else {
    res.status(403).json({ message: "Akses ditolak. Rute ini hanya untuk Super Admin." });
  }
};