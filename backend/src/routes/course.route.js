import { 
  createCourse,
  addSection,
  updateSection,
  deleteSection,
  addLesson,
  updateLesson,
  deleteLesson,
  addQuizQuestion,
  updateQuizQuestion,
  deleteQuizQuestion,
  getSingleCourse,
  getAllCourses,
  getCoursesByInstructor, 
  updateCourse} from "../controllers/course.controllers.js";
import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Get all courses with optional filters
router.get('/', getAllCourses);

//secured routes
router.route("/create").post(verifyJWT, upload.fields([
    {
        name: "courseThumbnail",
        maxCount: 1
    }
]
), createCourse);

// Update course by ID
router.put('/:id', verifyJWT, updateCourse);

// Get single course by ID
router.get('/single/:id', verifyJWT, getSingleCourse);

//Get Course by instructor ID
router.get('/instructor', verifyJWT, getCoursesByInstructor);

// SECTION ROUTES
router.post('/:courseId/sections', verifyJWT, addSection);
router.put('/:courseId/sections/:sectionId', verifyJWT, updateSection);
router.delete('/:courseId/sections/:sectionId', verifyJWT, deleteSection);

// LESSON ROUTES
router.post('/:courseId/sections/:sectionId/lessons', verifyJWT, addLesson);
router.put('/:courseId/sections/:sectionId/lessons/:lessonId', verifyJWT, updateLesson);
router.delete('/:courseId/sections/:sectionId/lessons/:lessonId', verifyJWT, deleteLesson);

// QUIZ ROUTES
router.post('/:courseId/sections/:sectionId/lessons/:lessonId/quizzes', verifyJWT, addQuizQuestion);
router.put('/:courseId/sections/:sectionId/lessons/:lessonId/quizzes/:quizId', verifyJWT, updateQuizQuestion);
router.delete('/:courseId/sections/:sectionId/lessons/:lessonId/quizzes/:quizId', verifyJWT, deleteQuizQuestion);


export default router;