import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute = ({ redirectPath = '/login' }) => {
  // Verificamos si existe el JWT en el almacenamiento local
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to={redirectPath} replace />;
  }

  // Si hay token, renderiza la ruta hija (el Dashboard)
  return <Outlet />;
};