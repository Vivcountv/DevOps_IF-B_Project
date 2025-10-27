// src/services/auth.js
import { jwtDecode } from 'jwt-decode';

export const getUserFromToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const user = jwtDecode(token);
    return user; // Akan berisi { id_admin, email, nama, role }
  } catch (error) {
    console.error("Token tidak valid", error);
    localStorage.removeItem('token');
    return null;
  }
};