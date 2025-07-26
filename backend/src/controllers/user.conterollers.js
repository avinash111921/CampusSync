import AsyncHandler from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken";
import {Student} from "../models/student.models.js"

const generateAccessAndRefereshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(401, "user not found");
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "something went wrong while generating acess and refresh token"
    );
  }
};

 const registerUser = AsyncHandler(async (req, res) => {
  const { scholarId, email, password } = req.body;

  if ([scholarId, email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const student = await Student.findOne({ scholarId });

  if (!student) {
    throw new ApiError(404, "No student found with this Scholar ID");
  }

  const existingUser = await User.findOne({
    $or: [{ email }, { scholarId }],
  });

  if (existingUser) {
    throw new ApiError(409, "User already exists with this email or scholar ID");
  }

  const user = await User.create({
    scholarId,
    email,
    password,
  });

  const { accessToken, refreshToken } = await generateAccessAndRefereshToken(user._id);

  const safeUser = await User.findById(user._id).select("-password -refreshToken");

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(201)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(201, { user: safeUser, accessToken}, "User registered successfully")
    );
});


const adminLogin = AsyncHandler(async (req,res) => {
    try {
        const {email,password} = req.body
        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
            const adminToken = jwt.sign(
                { 
                    isAdmin: true,
                    email: process.env.ADMIN_EMAIL
                },
                process.env.JWT_SECRET,
                { expiresIn: '24d' }
            );

            const options = {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
            }

            return res
            .status(200)
            .cookie("adminToken",adminToken,options)
            .json(new ApiResponse(
                200,
                {adminToken},
                "Admin logged in successfully"
            ))
        }
        else{
            throw new ApiError(401,"Invalid credential") 
        }
    } catch (error) {
        console.log(error)
        throw new ApiError(500,"An error occurred while logging in")
    }
})

const loginUser = AsyncHandler(async (req,res) => {

    const {email,scholarId,password} = req.body;

    if(!(email || scholarId)){
        throw new ApiError(400,"Email or Scholar ID is required");
    }

    if (!password) {
        throw new ApiError(400, "Password is required");
    }

    const user = await User.findOne({
        $or: [
            { email },
            { scholarId}
        ]
    })
    if(!user){
        throw new ApiError(404,"User not found with this email or scholar ID");
    }

    const isPasswordValid = await user.isPasswordMatched(password);

    if(!isPasswordValid){
        throw new ApiError(401,"Invalid user credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefereshToken(user._id);

    const loggedInUser = await User.findByIdAndUpdate(
        user._id,
        { refreshToken },
        { new: true }
    ).select("-password -refreshToken");

    const options = {
        httpOnly : true,
        secure : process.env.NODE_ENV === "production",
    }

    return res
        .status(200)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, { 
                user: loggedInUser, 
                accessToken, 
            }, 
            "User logged in successfully")
        );
});

const logoutUser = AsyncHandler(async (req,res) => {
    await User.findOneAndUpdate(
        req.user._id,
        {
            $unset : {
                refreshToken : 1,
            },
        },
        {
            new : true
        }
    );

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    }
    return res
        .status(200)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
})

const refreshAccessToken = AsyncHandler(async (req,res) => {
    const incommingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!incommingRefreshToken) {
        throw new ApiError(401, "Refresh token is required");
    }
    try {
        const decodedToken = jwt.verify(
            incommingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decodedToken._id);

        if(!user){
            throw new ApiError(404, "User not found");
        }
        
        if(incommingRefreshToken !== user.refreshToken) {
            throw new ApiError(401, "Invalid refresh token");
        }

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        };
        const { accessToken, refreshToken } = await generateAccessAndRefereshToken(user._id);

        return res  
            .status(200)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(200, { accessToken}, "Access token refreshed successfully"));
    } catch (error) {
        throw new ApiError(401, "Invalid refresh token");
    }
})

const resetPassword = AsyncHandler(async (req,res) => {
    const { email } = req.body;

    if (!email) {
        throw new ApiError(400, "Email is required");
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(new ApiResponse(200, {}, "Password reset instructions have been sent. You can now enter your new password."));
})

const changeCurrentPassword = AsyncHandler(async (req,res) => {

    const {oldPassword, newPassword} = req.body;

    if(!oldPassword || !newPassword){
        throw new ApiError(400, "Old password and new password are required");
    }

    const user = await User.findById(req.user?._id);

    if(!user){
        throw new ApiError(404, "User not found");
    }

    const isPasswordCorrect = await user.isPasswordMatched(oldPassword);

    if(!isPasswordCorrect){
        throw new ApiError(401, "Old password is incorrect");
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"));
})

const getCurrentUser = AsyncHandler(async (req, res) => {
    return res.status(200).json(new ApiResponse(200, req.user, "User found successfully"));
});

export {
    registerUser,
    adminLogin,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    resetPassword
}