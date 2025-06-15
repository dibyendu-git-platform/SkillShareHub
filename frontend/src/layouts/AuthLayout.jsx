import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const AuthLayout = ({ allowedRoles }) => {
  const location = useLocation();

  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  if ((isAuthenticated && user) ) {
    if (location.pathname === '/login' || location.pathname === '/register') {
      return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
};

export default AuthLayout; 