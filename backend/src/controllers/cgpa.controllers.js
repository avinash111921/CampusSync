import AsyncHandler from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import {Course} from "../models/Course.models.js";
import { CGPA } from "../models/Cgpa.models.js";
import { Student } from "../models/student.models.js";
const gradePointMap = {
    A: 10,
    B: 9,
    C: 8,
    D: 7,
    E: 6,
    F: 0,
};

const addCourseGrade = AsyncHandler(async (req, res) => {
    const { studentId } = req.params;
    // console.log(studentId);
    if (!studentId) {
        throw new ApiError(400, "Student ID is required");
    }
    const { courseId, grade } = req.body;
    const semester = Number(req.body.semester);

    if (isNaN(semester)) throw new ApiError(400, "Semester must be a valid number");
    
    if (!semester || !courseId || !grade) {
        throw new ApiError(400, "Semester, Course ID, and Grade are required");
    }

    if (!gradePointMap.hasOwnProperty(grade)) {
        throw new ApiError(400, "Invalid grade");
    }

    const course = await Course.findById(courseId);

    if (!course) {
        throw new ApiError(404, "Course not found");
    }

    const student = await Student.findById(studentId);
    if (!student) {
        throw new ApiError(404, "Student not found");
    }

    const isEnrolled = student.courses.some(c => c.course.toString() === courseId);
    if (!isEnrolled) {
        throw new ApiError(403, "Student is not enrolled in this course");
    }

    let cgpaDoc = await CGPA.findOne({ student: studentId });

    if (!cgpaDoc) {
        cgpaDoc = await CGPA.create({
            student: studentId,
            results: [{
                semester,
                cgpa: 0,
                courses: [{ course: courseId, grade }],
            }],
        });
        // console.log("new CGPA DOC");
    } else {
        // console.log("existing CGPA DOC");
        const semesterNumber = Number(semester);
        let semesterResult = cgpaDoc.results.find(res => res.semester === semesterNumber);

        if (semesterResult) {
            const existingCourse = semesterResult.courses.find(c => c.course.toString() === courseId);
            if (existingCourse) {
                existingCourse.grade = grade;
            } else {
                semesterResult.courses.push({ course: courseId, grade });
            }
        } else {
            cgpaDoc.results.push({
                semester,
                cgpa: 0,
                courses: [{ course: courseId, grade }],
            });
        }
    }

    // ✅ Calculate SGPA for this semester
    const updatedSemester = cgpaDoc.results.find(res => res.semester === semester);

    let semesterCredits = 0;
    let semesterPoints = 0;

    for (const c of updatedSemester.courses) {
        const courseData = await Course.findById(c.course);
        if (!courseData) continue;

        const credits = courseData.credits || 0;
        const gradePoint = gradePointMap[c.grade];

        semesterCredits += credits;
        semesterPoints += credits * gradePoint;
    }

    updatedSemester.cgpa = semesterCredits > 0 ? (semesterPoints / semesterCredits).toFixed(2) : 0;

    // ✅ Calculate overall CGPA across all semesters
    let totalCredits = 0;
    let totalGradePoints = 0;

    for (const semesterRes of cgpaDoc.results) {
        for (const c of semesterRes.courses) {
            const courseData = await Course.findById(c.course);
            if (!courseData) continue;

            const credits = courseData.credits || 0;
            const gradePoint = gradePointMap[c.grade];

            totalCredits += credits;
            totalGradePoints += credits * gradePoint;
        }
    }
    const passingGrades = ["A", "B", "C", "D", "E"]; 
    if (passingGrades.includes(grade)) {
        await Student.updateOne(
            { _id: studentId, "courses.course": courseId },
            { $set: { "courses.$.completed": true } }
        );
    }

    cgpaDoc.currentSGPA = totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : 0;

    await cgpaDoc.save();


    res.status(200).json(
        new ApiResponse(200, cgpaDoc, "Course grade added, SGPA and CGPA calculated successfully")
    );
});

const getStudentCgpa = AsyncHandler(async (req, res) => {
    const {studentId}  = req.params;

    const cgpaDoc = await CGPA.findOne({ student: studentId }).populate({
        path: "results.courses.course",
        select: "title courseCode credits"
    });

    if (!cgpaDoc) {
        throw new ApiError(404, "CGPA record not found for the student");
    }

    // Format the output
    const result = {
        student: cgpaDoc.student,
        currentCGPA: cgpaDoc.currentSGPA,
        semesters: cgpaDoc.results.map(res => ({
            semester: res.semester,
            sgpa: res.cgpa
        })),
    };

    res.status(200).json(new ApiResponse(200, result, "CGPA summary fetched successfully"));
});

const getCourseGrade = AsyncHandler(async (req, res) => {
    const  {studentId}  = req.params;

    const cgpaDoc = await CGPA.findOne({ student: studentId })
        .populate({
            path: "results.courses.course",
            select: "title courseCode credits"
        });

    if (!cgpaDoc) {
        // Return empty CGPA record
        return res.status(200).json(
            new ApiResponse(200, { student: studentId, results: [] }, "No grades found yet for this student")
        );
    }

    res.status(200).json(
        new ApiResponse(200, cgpaDoc, "Semester-wise grades fetched successfully")
    );
});

export { 
    addCourseGrade,
    getStudentCgpa,
    getCourseGrade
};