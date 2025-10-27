import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import BeasiswaDetail from './pages/BeasiswaDetail.jsx';
import App from './App.jsx';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminBeasiswaPendaftar from './pages/AdminBeasiswaPendaftar.jsx';
import Profile from './pages/Profile.jsx';
import AdminBeasiswaForm from './pages/AdminBeasiswaForm.jsx';
import AdminMahasiswa from './pages/AdminMahasiswa.jsx';
import AdminAdmins from './pages/AdminAdmins.jsx';


import ProtectedRoute from './components/ProtectedRoute.jsx';
import AdminProtectedRoute from './components/AdminProtectedRoute.jsx';
import './index.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/beasiswa/:uuid",
        element: <BeasiswaDetail />,
      },
      // Nanti kita bisa tambahkan /profile, /settings, dll di sini
    ]
  },
  {
    element: <AdminProtectedRoute />,
    children: [
      {
        path: "/admin/dashboard",
        element: <AdminDashboard />,
      },
      {
        path: "/admin/beasiswa/:uuid/pendaftar",
        element: <AdminBeasiswaPendaftar />,
      },
      {
        path: "/admin/beasiswa/baru",
        element: <AdminBeasiswaForm />,
      },
      {
        path: "/admin/beasiswa/edit/:uuid",
        element: <AdminBeasiswaForm />,
      },
      {
        path: "/admin/mahasiswa",
        element: <AdminMahasiswa />
      },
      {
      path: "/admin/admins", 
      element: <AdminAdmins />
      }
    ]
  },
  {
    element: <ProtectedRoute />,
    children: [
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/beasiswa/:uuid", element: <BeasiswaDetail /> },
      { path: "/profile", element: <Profile /> }
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Gunakan RouterProvider untuk menjalankan aplikasi */}
    <RouterProvider router={router} />
  </React.StrictMode>
);