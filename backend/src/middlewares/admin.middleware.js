export const isAdmin = (req, res, next) => {

  if (req.user && req.user.id_admin) {
    next();
  } else {
    res.status(403).json({ message: "Akses ditolak. Rute ini hanya untuk admin." });
  }
};