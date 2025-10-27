// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../services/api';
import {
  GraduationCap,
  Mail,
  Lock,
  LogIn,
  Loader2,
  AlertCircle,
  UserPlus,
  Shield
} from 'lucide-react';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const response = await apiClient.post('/auth/login', formData);
      const { token } = response.data;
      localStorage.setItem('token', token);
      setIsLoading(false);
      navigate('/dashboard');
    } catch (err) {
      setIsLoading(false);
      setError(err.response?.data?.message || "Login gagal. Coba lagi.");
    }
  };

  return (
    // [MODERN] Latar belakang gradasi terang
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
      
      {/* [MODERN] Kartu login dengan style baru */}
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg shadow-blue-100/50">

        {/* [MODERN] Header dengan ikon dan gradasi teks */}
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 mb-4">
             <GraduationCap className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-center text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Portal Beasiswa
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Belum punya akun?{' '}
            <Link 
              to="/register" 
              className="font-medium text-indigo-600 hover:text-indigo-500 inline-flex items-center gap-1 transition-colors"
            >
              <span>Daftar di sini</span>
              <UserPlus className="h-4 w-4" />
            </Link>
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* [MODERN] Notifikasi error dengan ikon */}
          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-700 border border-red-200">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* [MODERN] Input field dengan ikon */}
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-semibold text-gray-700 mb-2">
              Email Universitas
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                placeholder="nim@student.ac.id"
                className="block w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          {/* [MODERN] Input field dengan ikon */}
          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                placeholder="••••••••"
                className="block w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          {/* [MODERN] Tombol dengan gradasi, ikon, dan state loading */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 px-4 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  <span>Login Mahasiswa</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* [MODERN] Link ke Admin Login */}
        <p className="mt-6 text-center text-sm text-gray-600">
          <Link 
            to="/admin/login" 
            className="font-medium text-gray-500 hover:text-indigo-600 inline-flex items-center gap-1.5 transition-colors"
          >
            <Shield className="h-4 w-4" />
            <span>Login sebagai Admin</span>
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;
