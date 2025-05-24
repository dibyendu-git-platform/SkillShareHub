import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

//import routes
import userRoutes from "./routes/user.route.js"
import courseRoutes from "./routes/course.route.js"



app.use("/api/v1/users", userRoutes);
app.use("/api/v1/course", courseRoutes);

export { app }