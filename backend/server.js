import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from "dotenv";
import connectDB from "./src/db/db.js";

dotenv.config({
  path : "./.env",
});

const PORT = process.env.PORT || 5000;
const app = express();

const allowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(',')
  .map(origin => origin.trim().replace(/\/$/, ''))  // removes trailing slash if any
  .filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ''))) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));


app.use(express.json());
app.use(cookieParser());

import healthCheckRouter from "./src/routes/healthCheck.routes.js";
import userRouter from "./src/routes/user.routes.js";
import studentRouter from "./src/routes/student.routes.js";
import courseRouter from "./src/routes/course.routes.js";
import cgpaRouter from "./src/routes/cgpa.routes.js";

app.use('/api/v1/healthcheck', healthCheckRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/students', studentRouter);
app.use('/api/v1/courses', courseRouter);
app.use('/api/v1/cgpa', cgpaRouter);

app.get('/',(req,res)=>{
    res.send("API WORKING")
})

;(async () => {
    try {
        await connectDB();
        app.listen(PORT,() => {
            console.log(`Server is running on port ${PORT}`);
        })        
    } catch (error) {
        console.error(`Error starting the server: ${error.message}`);
        process.exit(1);
    }
})(); 

export default app;