import { Navigate } from 'react-router-dom';

/**
 * Chỉ cho phép truy cập khi user đã đăng nhập và có role ADMIN.
 */
export default function AdminRoute({ children }) {
  const userJson = sessionStorage.getItem('user');
  if (!userJson) {
    return <Navigate to="/login" replace />;
  }
  let user;
  try {
    user = JSON.parse(userJson);
  } catch {
    return <Navigate to="/login" replace />;
  }
  const role = user?.role ?? user?.roles?.[0];
  if (role !== 'ADMIN') {
    return <Navigate to="/home" replace />;
  }
  return children;
}
