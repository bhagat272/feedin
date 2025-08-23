import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute: React.FC = () => {
  const { token } = useSelector((state: any) => state.auth);

  return token ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;