import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiUsers, FiStar } from 'react-icons/fi';
import { MdCurrencyRupee } from "react-icons/md";
import { useEffect } from 'react';
import axios from 'axios';


const courses = [
  {
    id: 1,
    title: 'Web Development Bootcamp',
    students: 1234,
    revenue: 12340,
    rating: 4.8,
    status: 'published',
  },
  {
    id: 2,
    title: 'React for Beginners',
    students: 890,
    revenue: 8900,
    rating: 4.7,
    status: 'draft',
  },
];

const analytics = {
  totalStudents: 0,
  totalRevenue: 0,
  averageRating: 0,
  totalCourses: 0,
};

export default function InstructorDashboard() {
  const [selectedTab, setSelectedTab] = useState('courses');
  const [coursesData, setCoursesData] = useState(courses);

  useEffect(() => {

    axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/course/instructor`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((response) => {
        setCoursesData(response.data.courses);
      })
      .catch((error) => {
        console.error('Error fetching courses:', error);
      });
  }, []);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Instructor Dashboard</h1>
        <Link to="/instructor/courses/new" className="btn btn-primary flex items-center gap-2">
          <FiPlus />
          Create New Course
        </Link>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <FiUsers className="text-primary text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Total Students</h3>
              <p className="text-2xl font-bold">{analytics.totalStudents}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-full">
              <MdCurrencyRupee className="text-green-600 text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Total Revenue</h3>
              <p className="text-2xl font-bold">₹{analytics.totalRevenue}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-100 rounded-full">
              <FiStar className="text-yellow-600 text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Average Rating</h3>
              <p className="text-2xl font-bold">{analytics.averageRating}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <FiEdit2 className="text-purple-600 text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Total Courses</h3>
              <p className="text-2xl font-bold">{analytics.totalCourses}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setSelectedTab('courses')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              selectedTab === 'courses'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Courses
          </button>
          <button
            onClick={() => setSelectedTab('earnings')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              selectedTab === 'earnings'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Earnings
          </button>
        </nav>
      </div>

      {/* Courses Table */}
      {selectedTab === 'courses' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Students
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              { coursesData?.map((course) => (
                <tr key={course.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{course.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{course.students}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">${course.revenue}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center">
                      <FiStar className="text-yellow-400 mr-1" />
                      {course.rating}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        course.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {course.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link
                        to={`/instructor/courses/${course.id}/edit`}
                        className="text-primary hover:text-primary/90"
                      >
                        <FiEdit2 />
                      </Link>
                      <button className="text-red-600 hover:text-red-900">
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {coursesData.length === 0 &&
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No courses found. Start by creating a new course.
                  </td>
                </tr>
                
              }
            </tbody>
          </table>
        </div>
      )}

      {/* Earnings Chart Placeholder */}
      {selectedTab === 'earnings' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-500 text-center">
            Earnings chart will be implemented with a charting library
          </p>
        </div>
      )}
    </div>
  );
} 