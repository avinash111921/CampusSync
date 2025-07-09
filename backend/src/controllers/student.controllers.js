import AsyncHandler from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Student } from "../models/student.models.js";
import { Course } from "../models/Course.models.js";
import { CGPA } from "../models/Cgpa.models.js";

const registerStudent = AsyncHandler(async (req,res) => {

    const {fullName, scholarId, admissionYear, branch, semester} = req.body;

    if ([fullName, scholarId, admissionYear, branch, semester].some((field) => field === undefined || field === null || field === "")) {
        throw new ApiError(400, "All fields are required");
    }


    const existingStudent = await Student.findOne({scholarId});

    if(existingStudent){
        throw new ApiError(400, "Student already exists with this scholar ID");
    }

    try {
        const student = await Student.create({
            fullName: fullName,
            scholarId: scholarId,
            admissionYear: admissionYear,
            branch: branch,
            semester: semester,
        });

        const createdStudent = await Student.findById(student._id);

        if(!createdStudent){
            throw new ApiError(500, "Something went wrong while creating student");
        }

        res
        .status(201)
        .json(
            new ApiResponse(201, createdStudent,"Student registered successfully")
        );

    } catch (error) {
        throw new ApiError(500, "Something went wrong while registering student");
    }
})

const getStudent = AsyncHandler(async (req,res) => {
    const {scholarId}  =  req.params;
    if(!scholarId){
        throw new ApiError(400, "Scholar ID is required");
    }

    const student = await Student.findOne({ scholarId });

    if(!student){
        throw new ApiError(404, "Student not found");
    }
    
    res
    .status(200)    
    .json(
        new ApiResponse(200, student, "Student found successfully")
    );
});

const getAllStudents = AsyncHandler(async (req, res) => {

    const page = Number.isInteger(Number(req.query.page)) && Number(req.query.page) > 0 
    ? Number(req.query.page) 
    : 1;

    const limit = Number.isInteger(Number(req.query.limit)) && Number(req.query.limit) > 0 
    ? Math.min(Number(req.query.limit), 100) 
    : 20;

    const students = await Student.find()
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();

    const totalStudents = await Student.countDocuments();

    res.status(200).json(
        new ApiResponse(200, {
            students,
            totalPages: Math.ceil(totalStudents / limit),
            currentPage: page,
            totalStudents
        }, "Students retrieved successfully")
    );
});


const updateStudentProfile = AsyncHandler(async (req, res) => {
    const { scholarId } = req.params;

    const { fullName,newScholarId,branch,semester } = req.body;

    if (!scholarId) {
        throw new ApiError(400, "Scholar ID is required");
    }

    const student = await Student.findOne({ scholarId });

    if (!student) {
        throw new ApiError(404, "Student not found");
    }

    if (fullName) student.fullName = fullName;

    if (newScholarId) {
        const existingStudent = await Student.findOne({ scholarId: newScholarId });
        if (existingStudent && existingStudent._id.toString() !== student._id.toString()) {
            throw new ApiError(400, "Scholar ID already exists");
        }
        student.scholarId = newScholarId;
    }
    if (branch) student.branch = branch;

    if (semester) {
        const semesterNum = Number(semester);
        if (isNaN(semesterNum) || semesterNum < 1 || semesterNum > 8) {
            throw new ApiError(400, "Invalid semester");
        }
        student.semester = semesterNum;
    }

    await student.save();

    res.status(200).json(
        new ApiResponse(200, student, "Student profile updated successfully")
    );
});

const deleteStudent = AsyncHandler(async (req, res) => {
    const { scholarId } = req.params;

    if (!scholarId) {
        throw new ApiError(400, "Scholar ID is required");
    }

    const student = await Student.findOne({ scholarId });

    if (!student) {
        throw new ApiError(404, "Student not found");
    }

    const courseIds = student.courses.map((c) => c.course);

    await Course.updateMany(
        { _id: { $in: courseIds } },
        { $pull: { enrolledStudents: student._id } }
    );

    await Student.deleteOne({ _id: student._id });
    await CGPA.deleteOne({ student: student._id });

    res.status(200).json(
        new ApiResponse(200, student, "Student deleted successfully and removed from enrolled courses")
    );
});


const enrollStudentInCourse = AsyncHandler(async (req, res) => {
  const { scholarId } = req.params;
  const { courseId } = req.body;

  const student = await Student.findOne({ scholarId });
  const course = await Course.findById(courseId);

  if (!student || !course) {
    throw new ApiError(404, "Student or Course not found");
  }

  const alreadyEnrolled = student.courses.some(
    (c) => c.course.toString() === courseId
  );

  if (!alreadyEnrolled) {
    student.courses.push({ course: courseId, completed: false });
    await student.save();
  }

  if (!course.enrolledStudents.includes(student._id)) {
    course.enrolledStudents.push(student._id);
    await course.save();
  }

  res
    .status(200)
    .json(new ApiResponse(200, student, "Student enrolled in course"));
});

const getStudentCourses = AsyncHandler(async (req, res) => {
  const { scholarId } = req.params;
  
  if (!scholarId) {
    throw new ApiError(400, "Scholar ID is required");
  }
  const student = await Student.findOne({ scholarId }).populate("courses.course");
  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  res.status(200).json({ success: true, data: student });
});


const removeStudentFromCourse = AsyncHandler(async (req, res) => {
  const { scholarId } = req.params;
  const { courseId } = req.body;

  const student = await Student.findOne({ scholarId });
  const course = await Course.findById(courseId);

  if (!student || !course) {
    throw new ApiError(404, "Student or Course not found");
  }

  course.enrolledStudents = course.enrolledStudents.filter(
    (id) => id.toString() !== student._id.toString()
  );
  await course.save();

  student.courses = student.courses.filter(
    (c) => c.course.toString() !== courseId
  );
  
  await student.save();

  res.status(200).json(
    new ApiResponse(200, null, "Student removed from course")
  );
});



export {
    registerStudent,
    getStudent,
    getAllStudents,
    updateStudentProfile,
    deleteStudent,
    enrollStudentInCourse,
    getStudentCourses,
    removeStudentFromCourse,
}