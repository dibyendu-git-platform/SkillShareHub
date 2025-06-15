import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FiClock, FiBook, FiAward, FiUsers, FiStar, FiChevronDown, FiChevronUp, FiCheck } from 'react-icons/fi';
import axios from 'axios';

// Mock data - In a real app, this would come from an API
// const courseData = {
//   id: 1,
//   title: 'Web Development Bootcamp',
//   instructor: 'John Doe',
//   rating: 4.8,
//   students: 1234,
//   price: 99.99,
//   image: 'https://placehold.co/800x400',
//   category: 'Development',
//   level: 'Beginner',
//   description: `Learn web development from scratch with this comprehensive bootcamp. 
//     This course covers everything you need to know to become a full-stack developer.`,
//   whatYouWillLearn: [
//     'Build responsive websites using HTML, CSS, and JavaScript',
//     'Work with modern frameworks like React and Node.js',
//     'Understand database design and implementation',
//     'Deploy applications to the cloud',
//     'Write clean, maintainable code',
//     'Implement user authentication and authorization',
//   ],
//   curriculum: [
//     {
//       title: 'Introduction to Web Development',
//       lessons: [
//         { title: 'Course Overview', duration: '10:00' },
//         { title: 'Setting Up Your Development Environment', duration: '15:00' },
//         { title: 'Understanding Web Basics', duration: '20:00' },
//       ],
//     },
//     {
//       title: 'HTML & CSS Fundamentals',
//       lessons: [
//         { title: 'HTML Structure and Elements', duration: '25:00' },
//         { title: 'CSS Styling Basics', duration: '30:00' },
//         { title: 'Responsive Design', duration: '35:00' },
//       ],
//     },
//     {
//       title: 'JavaScript Essentials',
//       lessons: [
//         { title: 'JavaScript Syntax', duration: '25:00' },
//         { title: 'DOM Manipulation', duration: '30:00' },
//         { title: 'Event Handling', duration: '25:00' },
//       ],
//     },
//   ],
//   reviews: [
//     {
//       id: 1,
//       user: 'Sarah Johnson',
//       rating: 5,
//       date: '2024-02-15',
//       comment: 'Excellent course! The instructor explains everything clearly and the projects are very practical.',
//     },
//     {
//       id: 2,
//       user: 'Mike Smith',
//       rating: 4,
//       date: '2024-02-10',
//       comment: 'Great content and well-structured. Would recommend to beginners.',
//     },
//   ],
// };

export default function CourseDetailsPage() {
  const { id } = useParams();
  const [expandedSections, setExpandedSections] = useState(new Set());
  const [courseDetails, setCourseDetails] = useState();

  // In a real app, we would fetch the course data based on the id
  console.log('Course ID:', id);
  useEffect( () => {
    // Simulating an API call to fetch course details 
    axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/course/single/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
            .then(function (response) {
                setCourseDetails(response.data);
            })
            .catch(function (error) {
                console.log(error);
            })
            .finally(function () {
            });

    }, [id]);

    console.log(courseDetails);

  const toggleSection = (index) => {
    const newExpandedSections = new Set(expandedSections);
    if (newExpandedSections.has(index)) {
      newExpandedSections.delete(index);
    } else {
      newExpandedSections.add(index);
    }
    setExpandedSections(newExpandedSections);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Course Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold mb-4">{courseDetails?.title}</h1>
          <p className="text-gray-600 mb-4">{courseDetails?.description}</p>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center">
              <FiStar className="text-yellow-400" />
              <span className="ml-1">{courseDetails?.rating}</span>
              <span className="text-gray-600 ml-1">({courseDetails?.students} students)</span>
            </div>
            <div className="flex items-center">
              <FiUsers className="text-gray-400" />
              <span className="ml-1">Created by {courseDetails?.instructor.name}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">
              {courseDetails?.category}
            </span>
            <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">
              {courseDetails?.level}
            </span>
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="card sticky top-4">
            <img
              src={courseDetails?.thumbnail}
              alt={courseDetails?.title}
              className="w-full rounded-t-lg"
            />
            <div className="p-6">
              <div className="text-3xl font-bold mb-4">₹{courseDetails?.price}</div>
              <button className="w-full btn btn-primary mb-4">Enroll Now</button>
              <div className="text-sm text-gray-600">
                <div className="flex items-center mb-2">
                  <FiClock className="mr-2" />
                  <span>30-Day Money-Back Guarantee</span>
                </div>
                <div className="flex items-center mb-2">
                  <FiBook className="mr-2" />
                  <span>Full Lifetime Access</span>
                </div>
                <div className="flex items-center">
                  <FiAward className="mr-2" />
                  <span>Certificate of Completion</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* What You'll Learn */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">What You'll Learn</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courseDetails?.whatYouWillLearn?.map((item, index) => (
            <div key={index} className="flex items-start">
              <FiCheck className="mt-1 mr-2 text-green-500" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Course Content */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Course Content</h2>
        <div className="border rounded-lg divide-y">
          {courseDetails?.sections.map((section, index) => (
            <div key={index} className="p-4">
              <button
                className="w-full flex items-center justify-between"
                onClick={() => toggleSection(index)}
              >
                <span className="font-semibold">{section.title}</span>
                {expandedSections.has(index) ? (
                  <FiChevronUp className="text-gray-500" />
                ) : (
                  <FiChevronDown className="text-gray-500" />
                )}
              </button>
              {expandedSections.has(index) && (
                <div className="mt-4 space-y-2">
                  {section.lessons.map((lesson, lessonIndex) => (
                    <div
                      key={lessonIndex}
                      className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
                    >
                      <span className="text-gray-600">{lesson?.title}</span>
                      <span className="text-gray-500">{lesson?.duration}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Student Reviews</h2>
        <div className="space-y-4">
          {courseDetails?.reviews?.map((review) => (
            <div key={review.id} className="card">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center">
                    {review.user[0]}
                  </div>
                  <div className="ml-3">
                    <div className="font-semibold">{review.user}</div>
                    <div className="text-sm text-gray-500">{review.date}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-600">{review.comment}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
} 