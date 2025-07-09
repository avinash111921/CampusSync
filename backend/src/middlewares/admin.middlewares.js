import jwt from "jsonwebtoken"
import ApiError from "../utils/ApiError.js";

export const adminAuth = async (req,_,next) =>{
    try {

        const token = req.header("Authorization")?.replace("Bearer ", "") || req.cookies?.adminToken;
        if (!token) {
            throw new ApiError(
                401,
                "Authentication token not found"
            );
        }
        
        try {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

            if(!decodedToken.isAdmin) {
                throw new ApiError(
                    401,
                    "Unauthorized"
                );
            }

            req.admin = decodedToken;
            next();
            
        } catch (jwtError) {
            console.log("JWT Error:", jwtError);
            throw new ApiError(
                401,
                "Invalid or expired token"
            );
        }
    } catch (error) {
        console.log("Admin Auth Error:", error);
        throw new ApiError(
            401,
            error.message || "Authentication failed"
        );
    }
}