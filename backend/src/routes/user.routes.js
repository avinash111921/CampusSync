import { Router } from 'express';

import {
    registerUser,
    adminLogin,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    // updateProfile,
    resetPassword
} from "../controllers/user.conterollers.js";

import {verifyJWT} from "../middlewares/auth.middlewares.js";
// import { adminAuth } from '../middlewares/admin.middlewares.js';

const router = Router();

router.route("/register").post(registerUser);
router.route("/admin-login").post(adminLogin);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/reset-password").post(resetPassword);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
// router.route("/update-profile").post(verifyJWT, updateProfile);

export default router;

/* admin Login
{
    "statusCode": 200,
    "data": {
        "adminToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc0FkbWluIjp0cnVlLCJlbWFpbCI6Im5pdHNpbGNoYXJAZ21haWwuY29tIiwiaWF0IjoxNzUwNTk2OTE0LCJleHAiOjE3NTI2NzA1MTR9.1gyf6biO1i75PRJKQtjES3x9fF_9qofqY7G4Qsdmvl4"
    },
    "message": "Admin logged in successfully",
    "success": true
} */

    /*register ->  {
    "statusCode": 201,
    "data": {
        "user": {
            "_id": "6859848a4fc6ffd20dcedca3",
            "scholarId": "2414143",
            "email": "avinash_ug_24@ece.nits.ac.in",
            "createdAt": "2025-06-23T16:44:58.805Z",
            "updatedAt": "2025-06-23T16:44:59.239Z",
            "__v": 0
        },
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODU5ODQ4YTRmYzZmZmQyMGRjZWRjYTMiLCJlbWFpbCI6ImF2aW5hc2hfdWdfMjRAZWNlLm5pdHMuYWMuaW4iLCJzY2hvbGFySWQiOiIyNDE0MTQzIiwiaWF0IjoxNzUwNjk3MDk5LCJleHAiOjE3NTA3ODM0OTl9.7JIEA0FcKooKYYKZVCO3G2E3OaxO9WmM93khgVT_9Gs",
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODU5ODQ4YTRmYzZmZmQyMGRjZWRjYTMiLCJpYXQiOjE3NTA2OTcwOTksImV4cCI6MTc1MTU2MTA5OX0.8LT6UFXM9mq0XOPn8fScdCcw43jqnA5GeRwxIfG_N30"
    },
    "message": "User registered successfully",
    "success": true
} */

/* login ->
{
    "statusCode": 200,
    "data": {
        "user": {
            "_id": "6859848a4fc6ffd20dcedca3",
            "scholarId": "2414143",
            "email": "avinash_ug_24@ece.nits.ac.in",
            "createdAt": "2025-06-23T16:44:58.805Z",
            "updatedAt": "2025-06-23T16:45:39.248Z",
            "__v": 0
        },
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODU5ODQ4YTRmYzZmZmQyMGRjZWRjYTMiLCJlbWFpbCI6ImF2aW5hc2hfdWdfMjRAZWNlLm5pdHMuYWMuaW4iLCJzY2hvbGFySWQiOiIyNDE0MTQzIiwiaWF0IjoxNzUwNjk3MTM5LCJleHAiOjE3NTA3ODM1Mzl9.SfZXvRpXbvV51vNOS9DEzpLalAmsE9RVFsIpoU5UXO8",
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODU5ODQ4YTRmYzZmZmQyMGRjZWRjYTMiLCJpYXQiOjE3NTA2OTcxMzksImV4cCI6MTc1MTU2MTEzOX0.0EXhYOQWbTs_zRWQ0HaDnbFEWEBoyBuS9yD8fYOEF8g"
    },
    "message": "User logged in successfully",
    "success": true
}
*/

/*refresh acess Token
{
    "statusCode": 200,
    "data": {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODU1MGNhZDQ4MjFlYzE1NzhkNGU2NGMiLCJlbWFpbCI6ImF2aW5hc2hfdWdfMjRAZWNlLm5pdHMuYWMuaW4iLCJzY2hvbGFySWQiOiIyNDE0MTQzIiwiZnVsbE5hbWUiOiJBdmluYXNoIFZlcm1hIiwiaWF0IjoxNzUwNDA0NTEwLCJleHAiOjE3NTA0OTA5MTB9.bgoQRIu7_UHLT843QGJ2SYMshpeZJ6e1iOrtx7tiXJs"
    },
    "message": "Access token refreshed successfully",
    "success": true
}
*/

/*get current user
{
    "statusCode": 200,
    "data": {
        "_id": "6859848a4fc6ffd20dcedca3",
        "scholarId": "2414143",
        "email": "avinash_ug_24@ece.nits.ac.in",
        "password": "$2b$10$M6A6PtZSicFgdHZMYR0MPukrae7Kd0/y7M9hnGQ1Pg.85FkYAXBki",
        "createdAt": "2025-06-23T16:44:58.805Z",
        "updatedAt": "2025-06-23T16:45:39.248Z",
        "__v": 0,
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODU5ODQ4YTRmYzZmZmQyMGRjZWRjYTMiLCJpYXQiOjE3NTA2OTcxMzksImV4cCI6MTc1MTU2MTEzOX0.0EXhYOQWbTs_zRWQ0HaDnbFEWEBoyBuS9yD8fYOEF8g"
    },
    "message": "User found successfully",
    "success": true
}
*/
/* resetPassword -> 
{
    "statusCode": 200,
    "data": {},
    "message": "Password reset instructions have been sent. You can now enter your new password.",
    "success": true
} */

    /* chnage password -> {
    "statusCode": 200,
    "data": {},
    "message": "Password changed successfully",
    "success": true
} */

    /*  update profile -> {
    "statusCode": 200,
    "data": {
        "_id": "68550cad4821ec1578d4e64c",
        "fullName": "Avinash",
        "scholarId": "2414143",
        "email": "avinash_ug_24@ece.nits.ac.in",
        "createdAt": "2025-06-20T07:24:29.774Z",
        "updatedAt": "2025-06-20T07:36:20.239Z",
        "__v": 0
    },
    "message": "Profile updated successfully",
    "success": true
} */


/* logout -> {
    "statusCode": 200,
    "data": {},
    "message": "User logged out successfully",
    "success": true
} */