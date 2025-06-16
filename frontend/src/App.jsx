import { BrowserRouter as Router, Routes, Route, Outlet} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import { useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginFailure, updateAuth } from './features/auth/authSlice';

function App() {
  const dispatch = useDispatch();

  const { loading, isAuthenticated, user } = useSelector((state) => state.auth);
  useEffect(() => {
    if (isAuthenticated && user) return;
    
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }
    dispatch(loginStart());
    axios.post(`${import.meta.env.VITE_BASE_URL}/api/v1/users/session`,{
      },{
      headers: {
      'Authorization': `Bearer ${token}`
      }
      }).then((response) => {
          if (!response.data.success) {
            loginFailure(response.data.message || 'Registration failed')
            throw new Error(response.data.message || 'Registration failed');
          }
          dispatch(updateAuth(response.data.data));
      }

      ).catch((error) => {
        dispatch(loginFailure(error?.response?.data?.message));
        console.error('Registration error:', error?.response?.data?.message);
      });

  }, [dispatch, isAuthenticated, user]);

  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  return (    
      
        <div className="min-h-screen bg-gray-50 text-black">
          <Navbar />
            <Outlet />
          <ToastContainer position="bottom-right" />
        </div>
  );
}

export default App;
