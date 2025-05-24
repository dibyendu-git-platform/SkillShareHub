import { Link } from 'react-router-dom';

const featuredCourses = [
  {
    id: 1,
    title: 'Web Development Bootcamp',
    instructor: 'John Doe',
    rating: 4.8,
    students: 1234,
    price: 99.99,
    image: 'https://placehold.co/400x300',
  },
  {
    id: 2,
    title: 'Data Science Fundamentals',
    instructor: 'Jane Smith',
    rating: 4.7,
    students: 987,
    price: 89.99,
    image: 'https://placehold.co/400x300',
  },
  {
    id: 3,
    title: 'Digital Marketing Mastery',
    instructor: 'Mike Johnson',
    rating: 4.9,
    students: 2345,
    price: 79.99,
    image: 'https://placehold.co/400x300',
  },
];

const categories = [
  { name: 'Development', count: 1234 },
  { name: 'Business', count: 890 },
  { name: 'Design', count: 567 },
  { name: 'Marketing', count: 456 },
  { name: 'IT & Software', count: 789 },
  { name: 'Personal Development', count: 345 },
];

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="bg-primary rounded-lg text-white p-8 mb-12">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold mb-4">
            Learn New Skills Online with Expert Instructors
          </h1>
          <p className="text-lg mb-6">
            Choose from thousands of online courses with new additions published every month
          </p>
          <Link to="/courses" className="btn bg-white text-primary hover:bg-gray-100">
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
            <div key={course.id} className="card">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
                <p className="text-gray-600 mb-2">by {course.instructor}</p>
                <div className="flex items-center mb-2">
                  <span className="text-yellow-400">★</span>
                  <span className="ml-1">{course.rating}</span>
                  <span className="text-gray-600 ml-2">({course.students} students)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold">${course.price}</span>
                  <Link
                    to={`/courses/${course.id}`}
                    className="btn btn-primary"
                  >
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