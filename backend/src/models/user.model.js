import mongoose, {Schema} from "mongoose";
import bcrypt, { hash } from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      minlength: 6,// prevent password from being returned by default
    },
    googleId: {
      type: String,
    },
    avatar: {
      type: String,
      default: '', // Could be default avatar or cloudinary URL
    },
    role: {
      type: String,
      enum: ['learner', 'instructor', 'admin'],
      default: 'learner',
    },
    enrolledCourses: [
      {
        course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
        progress: { type: Number, default: 0 }, // percent
        completed: { type: Boolean, default: false },
      },
    ],
    createdCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
      },
    ],
    earnings: {
      type: Number,
      default: 0,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
        type: String
    }
  },
  {
    timestamps: true,
  }
);

// Hash password before saving

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10)
    next();
});

// Compare passwords
userSchema.methods.comparePassword = async function (enteredPassword) {
      return await bcrypt.compare(enteredPassword, this.password);
};

// ✅ Generate Access Token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY } // short-lived
  );
};

// ✅ Generate Refresh Token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { id: this._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY } // longer-lived
  );
};

export const User = mongoose.model('User', userSchema);
