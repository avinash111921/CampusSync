import { Router } from "express";

import {
    addCourse,
    removeCourse,
    getAllCourses,
    getCourse,
    updateCourse
} from "../controllers/courses.controllers.js";

import { adminAuth } from "../middlewares/admin.middlewares.js"
const router = Router();

router.route("/add").post(adminAuth,addCourse);
router.route("/remove/:courseId").delete(adminAuth,removeCourse);
router.route("/all").get(adminAuth,getAllCourses);
router.route("/get/:courseId").get(getCourse);
router.route("/update/:courseId").post(adminAuth,updateCourse);

export default router;


/* add ->
{
    "statusCode": 201,
    "data": {
        "_id": "68590210665a63657b55d283",
        "courseCode": "CS201",
        "title": "Data Structures and Algorithms",
        "credits": 4,
        "semester": 3,
        "branch": "CSE",
        "enrolledStudents": [],
        "createdAt": "2025-06-23T07:28:16.469Z",
        "updatedAt": "2025-06-23T07:28:16.469Z",
        "__v": 0
    },
    "message": "Course added successfully",
    "success": true
} */

/* remove course 
{
    "statusCode": 200,
    "data": {
        "_id": "6859a980506e200d9b46a821",
        "courseCode": "ME202",
        "title": "Thermodynamics",
        "credits": 3,
        "semester": 4,
        "branch": "ME",
        "enrolledStudents": [],
        "createdAt": "2025-06-23T19:22:40.090Z",
        "updatedAt": "2025-06-23T19:22:40.090Z",
        "__v": 0
    },
    "message": "Course removed successfully",
    "success": true
} */

    /* get All coourses
    {
    "statusCode": 200,
    "data": {
        "courses": [
            {
                "_id": "68590210665a63657b55d283",
                "courseCode": "CS201",
                "title": "Data Structures and Algorithms",
                "credits": 4,
                "semester": 3,
                "branch": "CSE",
                "enrolledStudents": [],
                "createdAt": "2025-06-23T07:28:16.469Z",
                "updatedAt": "2025-06-23T07:28:16.469Z",
                "__v": 0
            },
            {
                "_id": "6859024c972c82c96efb90b5",
                "courseCode": "EC204",
                "title": "Digital Electronics",
                "credits": 3,
                "semester": 3,
                "branch": "ECE",
                "enrolledStudents": [],
                "createdAt": "2025-06-23T07:29:16.916Z",
                "updatedAt": "2025-06-23T07:29:16.916Z",
                "__v": 0
            }
        ],
        "page": 1,
        "limit": 10,
        "totalPages": 1,
        "totalCourses": 2
    },
    "message": "Courses fetched successfully",
    "success": true
}
    */

/* getCourse -> 
{
    "statusCode": 200,
    "data": {
        "_id": "68590210665a63657b55d283",
        "courseCode": "CS201",
        "title": "Data Structures and Algorithms",
        "credits": 4,
        "semester": 3,
        "branch": "CSE",
        "enrolledStudents": [],
        "createdAt": "2025-06-23T07:28:16.469Z",
        "updatedAt": "2025-06-23T07:28:16.469Z",
        "__v": 0
    },
    "message": "Course found successfully",
    "success": true
} */

    /* update->
    {
    "statusCode": 200,
    "data": {
        "_id": "68590210665a63657b55d283",
        "courseCode": "CS201",
        "title": "Data Structures and Algorithms",
        "credits": 4,
        "semester": 4,
        "branch": "CSE",
        "enrolledStudents": [],
        "createdAt": "2025-06-23T07:28:16.469Z",
        "updatedAt": "2025-06-23T07:36:11.714Z",
        "__v": 0
    },
    "message": "Course updated successfully",
    "success": true
}
    */