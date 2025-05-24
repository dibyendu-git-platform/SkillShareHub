import { registerUser, logInUser, logoutUser } from "../controllers/user.controllers.js";
import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);

router.route("/login").post(logInUser);

//secured routes
router.route("/logout").post(verifyJWT,  logoutUser);

export default router;
