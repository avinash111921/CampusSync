import jwt from 'jsonwebtoken';
import {User} from '../models/user.models.js';
import ApiError from '../utils/ApiError.js';
import AsyncHandler from '../utils/AsyncHandler.js';
import { Student } from '../models/student.models.js';

export const verifyJWT = AsyncHandler(async(req,_,next) => {
    let token = req.cookies?.accessToken || req.headers["authorization"]?.replace("Bearer ","");
    if (!token) {
        throw new ApiError(401, "Unauthorized: No token provided");
    }
    try {
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id);
        // console.log(user);
        if(!user) {
            throw new ApiError(401, "Unauthorized: User not found");
        }
        const student = await Student.findOne({ scholarId: user.scholarId });
        if (!student) {
            throw new ApiError(401, "Unauthorized: Student not found");
        }
        req.user = user;
        req.student = student;
        next();
    } catch (error) {
        throw new ApiError(401, "Unauthorized: Invalid token");
    }
})