import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiFilter } from 'react-icons/fi';
import axios from 'axios';


const categories = [
  'All Categories',
  'Development',
  'Business',
  'Design',
  'Marketing',
  'IT & Software',
  'Personal Development',
];

const levels = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];
const prices = ['All Prices', 'Free', 'Paid', 'Under $50', 'Under $100'];
const ratings = ['All Ratings', '4.5 & up', '4.0 & up', '3.5 & up', '3.0 & up'];

export default function CoursesPage() {

    const [courses, setCourses] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All Categories');
    const [selectedLevel, setSelectedLevel] = useState('All Levels');
    const [selectedPrice, setSelectedPrice] = useState('All Prices');
    const [selectedRating, setSelectedRating] = useState('All Ratings');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        // Fetch courses from API or filter based on search and filters
        // This is a placeholder for actual data fetching logic
        // For now, we will use the static courses array defined above
        axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/course`)
            .then(function (response) {
                // handle success
                setCourses(response.data);
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
      {/* Search and Filter Bar */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn btn-secondary flex items-center gap-2"
          >
            <FiFilter />
            Filters
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="input"
            >
              {levels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>

            <select
              value={selectedPrice}
              onChange={(e) => setSelectedPrice(e.target.value)}
              className="input"
            >
              {prices.map((price) => (
                <option key={price} value={price}>
                  {price}
                </option>
              ))}
            </select>

            <select
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
              className="input"
            >
              {ratings.map((rating) => (
                <option key={rating} value={rating}>
                  {rating}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {courses.map((course) => (
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

      {/* Empty State */}
      {courses.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No courses found</h3>
          <p className="text-gray-600">
            Try adjusting your search or filter criteria to find more courses.
          </p>
        </div>
      )}
    </div>
  );
} 