import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const categories = [
  { name: 'Development', count: 1 },
  { name: 'Business', count: 2 },
  { name: 'Design', count: 3 },
  { name: 'Marketing', count: 6 },
  { name: 'IT & Software', count: 1 },
  { name: 'Personal Development', count: 2 },
];

export default function HomePage() {

  const [featuredCourses, setFeaturedCourses] = useState([]);

  useEffect(() => {
    // Fetch courses from API or filter based on search and filters
    // This is a placeholder for actual data fetching logic
    // For now, we will use the static courses array defined above
    axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/course`)
      .then(function (response) {
          // handle success
          setFeaturedCourses(response.data);
      })
      .catch(function (error) {
          // handle error
          console.log(error);
      })
      .finally(function () {
          // always executed
      });

    }, []);
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="bg-blue-400 rounded-lg text-white p-8 mb-12">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold mb-4">
            Learn New Skills Online with Expert Instructors
          </h1>
          <p className="text-lg mb-6">
            Choose from thousands of online courses with new additions published every month
          </p>
          <Link to="/courses" className="btn bg-white text-primary hover:bg-gray-100 p-1 rounded-lg">
            Browse Courses
          </Link>
        </div>
      </div>

      {/* Featured Courses */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Featured Courses</h2>
          <Link to="/courses" className="text-primary hover:text-primary/90">
            View All Courses
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCourses.map((course) => (
            <div key={course?._id} className="card">
              <img
                src={course?.thumbnail}
                alt={course?.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">{course?.category}</span>
                  <span className="text-sm text-gray-600">{course?.level}</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{course?.title}</h3>
                <p className="text-gray-600 mb-2">by {course?.instructor?.name}</p>
                <div className="flex items-center mb-2">
                  <span className="text-yellow-400">★</span>
                  <span className="ml-1">{course.rating}</span>
                  <span className="text-gray-600 ml-2">({course.totalRatings} students)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold">${course.price}</span>
                  <Link to={`/courses/${course._id}`} className="btn btn-primary">
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Top Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={`/courses?category=${category.name}`}
              className="card hover:shadow-lg transition-shadow"
            >
              <div className="p-4 text-center">
                <h3 className="font-semibold mb-2">{category.name}</h3>
                <p className="text-gray-600">{category.count} courses</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-100 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Become an Instructor</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Join our community of expert instructors and share your knowledge with students
          around the world. Create engaging courses and earn money while making a difference.
        </p>
        <Link to="/register?role=instructor" className="btn btn-primary">
          Start Teaching Today
        </Link>
      </section>
    </div>
  );
} 