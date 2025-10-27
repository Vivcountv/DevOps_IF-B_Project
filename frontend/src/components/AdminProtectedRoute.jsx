// src/components/AdminProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // <-- Impor library baru

const AdminProtectedRoute = () => {
  const token = localStorage.getItem('token');

  // 1. Cek ada token atau tidak
  if (!token) {
    // Jika tidak ada token, tendang ke login admin
    return <Navigate to="/admin/login" replace />;
  }

  try {
    // 2. Baca isi token
    const decoded = jwtDecode(token);

    // 3. Cek apakah ada 'id_admin' di dalam token
    if (decoded.id_admin) {
      // Jika ya, dia adalah admin. Izinkan akses.
      return <Outlet />;
    } else {
      // Jika tidak (ini token mahasiswa), tendang ke dashboard mahasiswa
      return <Navigate to="/dashboard" replace />;
    }
  } catch (error) {
    // 4. Jika token rusak/tidak valid, hapus dan tendang ke login
    console.error("Token tidak valid:", error);
    localStorage.removeItem('token');
    return <Navigate to="/admin/login" replace />;
  }
};

export default AdminProtectedRoute;