// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // 1. Cek apakah ada token di local storage
  const token = localStorage.getItem('token');

  // 2. Jika ada token, izinkan akses ke halaman
  // <Outlet /> adalah placeholder untuk komponen halaman
  // (misalnya, komponen Dashboard akan dirender di sini)
  if (token) {
    return <Outlet />;
  }

  // 3. Jika tidak ada token, "tendang" ke halaman login
  // 'replace' berarti user tidak bisa menekan tombol "back"
  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;