import { Router } from "express";

import { 
    addCourseGrade,
    getStudentCgpa,
    getCourseGrade
} from "../controllers/cgpa.controllers.js";

import { adminAuth } from "../middlewares/admin.middlewares.js"
import { verifyJWT } from "../middlewares/auth.middlewares.js";
const router = Router();

router.route("/add/:studentId").post(adminAuth,addCourseGrade);
router.route("/get/:studentId").get(getStudentCgpa);
router.route("/course-grade/:studentId").get(getCourseGrade);

export default router;


/* addCourseGrade -> 
{
    "statusCode": 200,
    "data": {
        "student": "6866b4f0003c6e457ecb65f7",
        "results": [
            {
                "semester": 3,
                "cgpa": 10,
                "courses": [
                    {
                        "course": "6859024c972c82c96efb90b5",
                        "grade": "A",
                        "_id": "68676d01294e4b234dae6eba"
                    }
                ],
                "_id": "68676d01294e4b234dae6eb9"
            }
        ],
        "currentSGPA": 10,
        "_id": "68676d01294e4b234dae6eb8",
        "createdAt": "2025-07-04T05:56:17.330Z",
        "updatedAt": "2025-07-04T05:56:17.743Z",
        "__v": 0
    },
    "message": "Course grade added, SGPA and CGPA calculated successfully",
    "success": true
}*/


    /* studentCGPA -> 
    {
    "statusCode": 200,
    "data": {
        "student": "6866b4f0003c6e457ecb65f7",
        "currentCGPA": 10,
        "semesters": [
            {
                "semester": 3,
                "sgpa": 10
            }
        ]
    },
    "message": "CGPA summary fetched successfully",
    "success": true
}*/

    /* courseGrade -> 
    {
    "statusCode": 200,
    "data": {
        "_id": "685948952a100bcdcf52573f",
        "student": "6858fd18beb417a38ba51636",
        "results": [
            {
                "semester": 1,
                "cgpa": 9,
                "courses": [
                    {
                        "course": {
                            "_id": "68593d66989c6a640fca1534",
                            "courseCode": "MA101",
                            "title": "Engineering Mathematics I",
                            "credits": 4
                        },
                        "grade": "B",
                        "_id": "685948952a100bcdcf525741"
                    }
                ],
                "_id": "685948952a100bcdcf525740"
            }
        ],
        "currentSGPA": 9,
        "createdAt": "2025-06-23T12:29:09.373Z",
        "updatedAt": "2025-06-23T12:29:09.720Z",
        "__v": 0
    },
    "message": "Semester-wise grades fetched successfully",
    "success": true
}
    */