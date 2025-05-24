import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import store from './app/store';
import Navbar from './components/Navbar';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailsPage from './pages/CourseDetailsPage';
import InstructorDashboard from './pages/instructor/InstructorDashboard';
import AuthLayout from './layouts/AuthLayout';

// Placeholder components (to be implemented)
const AdminDashboard = () => <div>Admin Dashboard</div>;
const UserProfile = () => <div>User Profile</div>;
const UnauthorizedPage = () => <div>Unauthorized Access</div>;

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/:id" element={<CourseDetailsPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Protected Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/profile" element={<UserProfile />} />
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
    </Provider>
  );
}

export default App;
