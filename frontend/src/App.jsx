import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailsPage from './pages/CourseDetailsPage';
import InstructorDashboard from './pages/instructor/InstructorDashboard';
import AuthLayout from './layouts/AuthLayout';
import About from './pages/About';
import UserProfilePage from './pages/auth/UserProfilePage';
import { useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginFailure, updateAuth } from './features/auth/authSlice';

// Placeholder components (to be implemented)
const AdminDashboard = () => <div>Admin Dashboard</div>;
const UnauthorizedPage = () => <div>Unauthorized Access</div>;

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
      //...data
      },{
      //Adding token to the request
      headers: {
      'Authorization': `Bearer ${token}`
      }
      }).then((response) => {
        // Handle successful session validation
          if (!response.data.success) {
            loginFailure(response.data.message || 'Registration failed')
            throw new Error(response.data.message || 'Registration failed');
          }
          dispatch(updateAuth(response.data.data));
      }

      ).catch((error) => {
        // Handle session validation errorconsole.error(error);
        dispatch(loginFailure(error?.response?.data?.message));
        console.error('Registration error:', error?.response?.data?.message);
      });

  }, [dispatch, isAuthenticated, user]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  return (    
      <Router>
        <div className="min-h-screen bg-gray-50 text-black">
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/:id" element={<CourseDetailsPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path='/about' element={<About/>} />

            {/* Protected Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/profile" element={<UserProfilePage />} />
            </Route>

            {/* Instructor Routes */}
            <Route element={<AuthLayout allowedRoles={['instructor']} />}>
              <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<AuthLayout allowedRoles={['admin']} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Route>
          </Routes>
          <ToastContainer position="bottom-right" />
        </div>
      </Router>
  );
}

export default App;
