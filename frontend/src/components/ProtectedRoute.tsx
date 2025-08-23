import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
 
const ProtectedRoute: React.FC = () => {
  const token = useSelector((state: any) => state.auth.token);

  return token ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;