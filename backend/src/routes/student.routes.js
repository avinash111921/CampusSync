import { Router } from "express";

import {
    registerStudent,
    getStudent,
    getAllStudents,
    updateStudentProfile,
    deleteStudent,
    enrollStudentInCourse,
    getStudentCourses,
    removeStudentFromCourse
} from "../controllers/student.controllers.js";

import { adminAuth } from "../middlewares/admin.middlewares.js"


const router = Router();

router.route("/register").post(adminAuth,registerStudent);
router.route("/get/:scholarId").get(getStudent);
router.route("/all").get(adminAuth,getAllStudents);
router.route("/update/:scholarId").post(adminAuth,updateStudentProfile);
router.route("/delete/:scholarId").delete(adminAuth,deleteStudent);
router.route("/enroll/:scholarId").post(adminAuth,enrollStudentInCourse);
router.route("/courses/:scholarId").get(getStudentCourses); 
router.route("/remove/:scholarId").post(adminAuth,removeStudentFromCourse);

export default router;

/* register -> 
{
    "statusCode": 201,
    "data": {
        "_id": "6858fd18beb417a38ba51636",
        "fullName": "Avinash Verma",
        "scholarId": "2414134",
        "admissionYear": 2024,
        "branch": "Electronics and Communication",
        "semester": 1,
        "courses": [],
        "__v": 0
    },
    "message": "Student registered successfully",
    "success": true
} */

    /* getStudent ->
    {
    "statusCode": 200,
    "data": {
        "_id": "6858fd18beb417a38ba51636",
        "fullName": "Avinash Verma",
        "scholarId": "2414134",
        "admissionYear": 2024,
        "branch": "Electronics and Communication",
        "semester": 1,
        "courses": [],
        "__v": 0
    },
    "message": "Student found successfully",
    "success": true
} */
/* delete STudent -> 
{
    "statusCode": 200,
    "data": {
        "_id": "6859a812361d880f75c2dc8b",
        "fullName": "Aryan Tadav",
        "scholarId": "2414098",
        "admissionYear": 2024,
        "branch": "Electronics and Communication",
        "semester": 1,
        "courses": [],
        "__v": 0
    },
    "message": "Student deleted successfully",
    "success": true
} */

    /* getAll Student -> 
    {
    "statusCode": 200,
    "data": {
        "students": [
            {
                "_id": "6858fd18beb417a38ba51636",
                "fullName": "Avinash Verma",
                "scholarId": "2414134",
                "admissionYear": 2024,
                "branch": "Electronics and Communication",
                "semester": 1,
                "courses": [],
                "__v": 0
            }
        ],
        "totalPages": 1,
        "currentPage": 1,
        "totalStudents": 1
    },
    "message": "Students retrieved successfully",
    "success": true
} */

     /* update student -> 
     {
    "statusCode": 200,
    "data": {
        "_id": "6858fd18beb417a38ba51636",
        "fullName": "Avinash Verma",
        "scholarId": "2414143",
        "admissionYear": 2024,
        "branch": "Electronics and Communication",
        "semester": 3,
        "courses": [],
        "__v": 0
    },
    "message": "Student profile updated successfully",
    "success": true
} */

    /* enroll ->
    {
    "statusCode": 200,
    "data": {
        "_id": "6858fd18beb417a38ba51636",
        "fullName": "Avinash Verma",
        "scholarId": "2414143",
        "admissionYear": 2024,
        "branch": "Electronics and Communication",
        "semester": 3,
        "courses": [
            {
                "course": "68590210665a63657b55d283",
                "completed": false,
                "_id": "6859050dd3ae586a5e9abb49"
            }
        ],
        "__v": 1
    },
    "message": "Student enrolled in course",
    "success": true
} */

    /* remove from course -> 
    {
    "statusCode": 200,
    "data": null,
    "message": "Student removed from course",
    "success": true
} */

    /* studentCOurse -> 
    {
    "statusCode": 200,
    "data": [
        {
            "course": {
                "_id": "68590210665a63657b55d283",
                "courseCode": "CS201",
                "title": "Data Structures and Algorithms",
                "credits": 4,
                "semester": 4,
                "branch": "CSE",
                "enrolledStudents": [
                    "6858fd18beb417a38ba51636"
                ],
                "createdAt": "2025-06-23T07:28:16.469Z",
                "updatedAt": "2025-06-23T12:11:25.276Z",
                "__v": 3
            },
            "completed": false,
            "_id": "6859446c7b340c86c2bfdff3"
        },
        {
            "course": {
                "_id": "68593d66989c6a640fca1534",
                "courseCode": "MA101",
                "title": "Engineering Mathematics I",
                "credits": 4,
                "semester": 1,
                "branch": "ECE",
                "enrolledStudents": [
                    "6858fd18beb417a38ba51636"
                ],
                "createdAt": "2025-06-23T11:41:26.477Z",
                "updatedAt": "2025-06-23T12:25:06.363Z",
                "__v": 1
            },
            "completed": false,
            "_id": "685947a2fafa4c144a0fe7b2"
        }
    ],
    "message": "Student courses retrieved successfully",
    "success": true
} */