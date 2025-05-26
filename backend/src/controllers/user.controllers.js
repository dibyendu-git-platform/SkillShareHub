import { asyncHandeler } from '../utils/asyncHandeler.js';
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const cookieOptions = {
        httpOnly: true,
        secure: true
}

const generateAccessandRefreshToken = async (userId) => {
     try {
        const user = await User.findById(userId)
        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken }


    } catch (error) {
        console.log(error);
        throw new ApiError(500, "Something went wrong while generating referesh and access token", error);
    }
}

//register user controller
const registerUser = asyncHandeler(async (req, res) => {
    // get user data from request body
    //validation not empty
    //check if user already exists
    //check for images/ check for avatar
    //upload them to cloudnary
    //create user object - create entry in db
    //remove password and refresh tonken from user object
    //check for user creation
    //return response

    const { name, email, password, role } = req.body;

    if ([name, email, password, role].some(field => field.trim() === '')) {
         throw new ApiError(400, 'All fields are required');  
    }

    const existingUser = await User.findOne({ email });
    if(existingUser) {
        return res.status(400).json(
            new ApiResponse(400, null, "User already exists")
        );
        //throw new ApiError(400, 'User already exists');
    }

    const newUser = await User.create({
        name,
        email,
        password,
        role        
    });

    const createdUser = await User.findById(newUser._id).select("-password -refreshToken");
    if (!createdUser) {
      throw new ApiError(500, "Something went wrong while registering the user from server side");
    } 
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )
});

//login user controller
const logInUser = asyncHandeler( async (req, res) => {
   // req body -> data
    // username or email
    //find the user
    //password check
    //access and referesh token
    //send cookie

    const { email, password } = req.body;

    if ( !email ){
        throw new ApiError(404, "Email is required");
    }

    if (!password) {
        throw new ApiError(404, "Password is required");
    }

    const user = await User.findOne({ email });

    if (!user) {
        return res
            .status(401)
            .json(new ApiResponse(404, null, "User not exists"));
        // throw new ApiError(404, "User not exists");
    }
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
        return res
            .status(401)
            .json(new ApiResponse(401, null, "Invalid password"));

        // throw new ApiError(401, "Invalid password");
    }

    const { accessToken, refreshToken } = await generateAccessandRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            new ApiResponse(
                200, 
                {
                    user: loggedInUser, accessToken, refreshToken
                },
            "User logged In Successfully"
        )
    )

});

//logout user controller
const logoutUser = asyncHandeler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )
    return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "User logged Out"))
});

//Get a user courses and progress
const getUserCoursesAndProgress = asyncHandeler(async (req, res) => {
    //check if user exists
    //get userr/instructor courses
    //get user progress

    const userId = req.user._id;

    const userCourses = await User.findById(userId).populate('enrolledCourses', 'course progress completed');
});

const checkSession = asyncHandeler(async (req, res) => {
    //check if user exists
    //get user data
    //return response

    const userId = req.user._id;

    const user = await User.findById(userId).select("-password -refreshToken");

    if (!user) {
        return res.status(404).json({message: "User not found"});
    }

    return res.status(200).json(
        new ApiResponse(200, user, "User session is valid")
    );
});

export {registerUser, logInUser, logoutUser, getUserCoursesAndProgress, checkSession};