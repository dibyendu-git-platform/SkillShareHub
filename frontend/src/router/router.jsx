import { createBrowserRouter } from "react-router-dom"
import App from "../App"
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import AuthLayout from "../layouts/AuthLayout";
import UserProfilePage from "../pages/auth/UserProfilePage";
import UnauthorizedPage from "../pages/UnauthorizedPage";
import CoursesPage from "../pages/CoursesPage";
import CourseDetailsPage from "../pages/CourseDetailsPage";
import InstructorDashboard from "../pages/instructor/InstructorDashboard";
import AddCourse from "../pages/AddCourse";
import EditCourse from "../pages/EditCourse";
import AdminDashboard from "../pages/AdminDashboard";

// Placeholder components (to be implemented)

const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      children: [
        {
            path: "/",
            element: <HomePage />,
        },
        {
            path: "/login",
            element: <LoginPage />,
        },
        {
            path: "/register",
            element: <RegisterPage />,
        },
        {
            path: "/courses",
            element: <CoursesPage />,
        },
        {
            path: "/unauthorized",
            element: <UnauthorizedPage />
        },
        {
            path: "/about",
            element: < div className="flex items-center justify-center min-h-screen">About Us Page</div>
        },

        /* Protected Routes */
        {
            path: "/profile",
            element: <AuthLayout ><UserProfilePage /></AuthLayout>
        },
        {
            path: "/courses/:id", 
            element: <AuthLayout ><CourseDetailsPage /></AuthLayout>
        },
        {
            path: "/instructor/dashboard",
            element: <AuthLayout allowedRoles={['instructor']} ><InstructorDashboard /></AuthLayout>
        },
        {
            path:"/instructor/courses/add",
            element: <AuthLayout allowedRoles={['instructor']} ><AddCourse /></AuthLayout>
        },
        {
            path:"/instructor/courses/:id/edit",
            element: <AuthLayout allowedRoles={['instructor']} ><EditCourse /></AuthLayout>
        },
        {
            path:"/admin/dashboard",
            element: <AuthLayout allowedRoles={['admin']} ><AdminDashboard /></AuthLayout>
        }
      ]
    },
]);

export default router;