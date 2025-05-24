import { asyncHandler } from '../utils/asyncHandeler.js';
import { Course } from '../models/course.model.js';
import { ApiError } from '../utils/ApiError.js';
import {cloudnaryFileUpload} from '../utils/cloudnary.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { User } from '../models/user.model.js';


// GET all courses (with optional filters/search)
export const getAllCourses = async (req, res) => {
  try {
    const { category, search } = req.query;
    let filter = {};

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    const courses = await Course.find(filter)
      .select('title thumbnail price rating enrolledCount instructor category') // Limit fields for performance
      .populate('instructor', 'name email'); // Show instructor name & email

    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch courses', error: err.message });
  }
};

// GET single course details (with sections, lessons, quizzes)
export const getSingleCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id).populate('instructor', 'name email bio');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(course);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch course', error: err.message });
  }
};

//create course
export const createCourse = asyncHandler(async (req, res) => {
    // check if user is instructor or admin
    // check if all fields are present
    // check if courseThumbnail is present
    // upload courseThumbnail to cloudnary
    //check if course thumbnail is uploaded
    // create course object
    // create entry in db
    // response with course object  

    const { title, description, category, tags, price, isSubscription } = req.body;

    if (!(req.user.role === 'instructor' || req.user.role === 'admin')) {
        console.log(req.user);
        throw new ApiError(403, 'Only instructors and admin can create courses');
    }

    if ([title, description, category].some(field => field.trim() === '')) {
        throw new ApiError(400, 'All fields are required');
    }

    const courseThumbnailLocalPath = req.files?.courseThumbnail[0].path;

    if (!courseThumbnailLocalPath) {
        throw new ApiError(400, 'Course thumbnail is required');
    }

    const courseThumbnail = await cloudnaryFileUpload(courseThumbnailLocalPath);

    const course = await Course.create({
        title,
        description,
        category,
        tags,
        price,
        isSubscription,
        thumbnail: courseThumbnail.url,
        instructor: req.user.id,
    });

    if (!course) {
        throw new ApiError(500, 'Something went wrong while creating the course');
    }

    const instructor = await User.findById(req.user.id);

    if (!instructor) {
        throw new ApiError(404, 'Instructor not found');
    }

    // Update instructor's courses array
    instructor.createdCourses.push(course._id);
    await instructor.save();

    return res.status(201).json(
        new ApiResponse(201, course, "Course Created Successfully")
    );
});

// UPDATE a course
export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Optional: restrict updates to course owner or admin
    // if (req.user.id !== course.instructor.toString() && req.user.role !== 'admin') {
    //   return res.status(403).json({ message: 'Unauthorized' });
    // }

    Object.assign(course, updates);
    await course.save();

    res.json({ message: 'Course updated successfully', course });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update course', error: err.message });
  }
};

// DELETE a course
export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Optional: check permission
    // if (req.user.id !== course.instructor.toString() && req.user.role !== 'admin') {
    //   return res.status(403).json({ message: 'Unauthorized' });
    // }

    await course.deleteOne();

    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete course', error: err.message });
  }
};

// Add Section
export const addSection = async (req, res) => {
  try {

    if (!(req.user.role === 'instructor' || req.user.role === 'admin')) {
        console.log(req.user);
        throw new ApiError(403, 'Only instructors and admin can create courses');
    }

    const { courseId } = req.params;
    const { title } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    course.sections.push({ title, lessons: [] });
    await course.save();

    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add section', error: err.message });
  }
};

// Update Section
export const updateSection = async (req, res) => {
  try {

    if (!(req.user.role === 'instructor' || req.user.role === 'admin')) {
        console.log(req.user);
        throw new ApiError(403, 'Only instructors and admin can create courses');
    }

    const { courseId, sectionId } = req.params;
    const { title } = req.body;

    const course = await Course.findById(courseId);
    const section = course?.sections.id(sectionId);
    if (!section) return res.status(404).json({ message: 'Section not found' });

    section.title = title;
    await course.save();

    res.json(course);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update section', error: err.message });
  }
};

// Delete Section
export const deleteSection = async (req, res) => {
  try {

    if (!(req.user.role === 'instructor' || req.user.role === 'admin')) {
        console.log(req.user);
        throw new ApiError(403, 'Only instructors and admin can create courses');
    }

    const { courseId, sectionId } = req.params;
    const course = await Course.findById(courseId);
    // course.sections.id(sectionId).remove();
    course.sections = course.sections.filter(
      (section) => section._id.toString() !== sectionId
    );
    await course.save();
    res.json({ message: 'Section deleted successfully' , course});
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete section', error: err.message });
  }
};

// Add Lesson
export const addLesson = async (req, res) => {
  try {

    if (!(req.user.role === 'instructor' || req.user.role === 'admin')) {
        console.log(req.user);
        throw new ApiError(403, 'Only instructors and admin can create courses');
    }

    const { courseId, sectionId } = req.params;
    const { title, videoUrl, resources } = req.body;

    const course = await Course.findById(courseId);
    const section = course?.sections.id(sectionId);
    if (!section) return res.status(404).json({ message: 'Section not found' });

    section.lessons.push({ title, videoUrl, resources });
    await course.save();

    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add lesson', error: err.message });
  }
};

// Update Lesson
export const updateLesson = async (req, res) => {
  try {

    if (!(req.user.role === 'instructor' || req.user.role === 'admin')) {
        console.log(req.user);
        throw new ApiError(403, 'Only instructors and admin can create courses');
    }

    const { courseId, sectionId, lessonId } = req.params;
    const { title, videoUrl, resources } = req.body;

    const course = await Course.findById(courseId);
    const lesson = course?.sections.id(sectionId)?.lessons.id(lessonId);
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

    lesson.title = title;
    lesson.videoUrl = videoUrl;
    lesson.resources = resources;
    await course.save();

    res.json(course);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update lesson', error: err.message });
  }
};

// Delete Lesson
export const deleteLesson = async (req, res) => {
  try {

    if (!(req.user.role === 'instructor' || req.user.role === 'admin')) {
        console.log(req.user);
        throw new ApiError(403, 'Only instructors and admin can create courses');
    }

    const { courseId, sectionId, lessonId } = req.params;

    const course = await Course.findById(courseId);
    const section = course?.sections.id(sectionId);
    // section.lessons.id(lessonId).remove();
    section.lessons = section.lessons.filter(
      (lesson) => lesson._id.toString() !== lessonId
    );
    await course.save();

    res.status(200).json({ message: 'Lesson deleted successfully', course });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete lesson', error: err.message });
  }
};

// Add Quiz Question
export const addQuizQuestion = async (req, res) => {
  try {

    if (!(req.user.role === 'instructor' || req.user.role === 'admin')) {
        console.log(req.user);
        throw new ApiError(403, 'Only instructors and admin can create courses');
    }

    const { courseId, sectionId, lessonId } = req.params;
    const { question, options, correctAnswer } = req.body;

    const course = await Course.findById(courseId);
    const lesson = course?.sections.id(sectionId)?.lessons.id(lessonId);
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

    lesson.quiz.push({ question, options, correctAnswer });
    await course.save();

    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add quiz question', error: err.message });
  }
};

// Update Quiz Question
export const updateQuizQuestion = async (req, res) => {
  try {

    if (!(req.user.role === 'instructor' || req.user.role === 'admin')) {
        console.log(req.user);
        throw new ApiError(403, 'Only instructors and admin can create courses');
    }

    const { courseId, sectionId, lessonId, quizId } = req.params;
    const { question, options, correctAnswer } = req.body;

    const course = await Course.findById(courseId);
    const quiz = course?.sections.id(sectionId)?.lessons.id(lessonId)?.quiz.id(quizId);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    quiz.question = question;
    quiz.options = options;
    quiz.correctAnswer = correctAnswer;
    await course.save();

    res.json(course);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update quiz', error: err.message });
  }
};

// Delete Quiz Question
export const deleteQuizQuestion = async (req, res) => {
  try {

    if (!(req.user.role === 'instructor' || req.user.role === 'admin')) {
        console.log(req.user);
        throw new ApiError(403, 'Only instructors and admin can create courses');
    }
    
    const { courseId, sectionId, lessonId, quizId } = req.params;

    const course = await Course.findById(courseId);
    const lesson = course?.sections.id(sectionId)?.lessons.id(lessonId);
    // lesson.quiz.id(quizId).remove();
    lesson.quiz = lesson.quiz.filter(
      (quiz) => quiz._id.toString() !== quizId
    );
    await course.save();

    res.json({ message: 'Quiz question deleted successfully', course });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete quiz', error: err.message });
  }
};
