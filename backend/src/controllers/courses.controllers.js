import AsyncHandler from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Course } from "../models/Course.models.js";
import {Student} from "../models/student.models.js";

const addCourse = AsyncHandler(async (req,res) => {

    const { title, courseCode, credits, semester, branch } = req.body;
    const creditsNum = Number(credits);
    const semesterNum = Number(semester);

    if ([title, courseCode, branch].some((field) => typeof field !== "string" || field.trim() === "") ||
        isNaN(creditsNum) || isNaN(semesterNum) || creditsNum < 1 || semesterNum < 1) {
        throw new ApiError(400, "All fields are required and must be valid");
    }


    const existingCourse = await Course.findOne({courseCode});

    if(existingCourse){
        throw new ApiError(400, "Course already exists with this course code");
    }

    try {

        const course = await Course.create({
            title: title,
            courseCode: courseCode,
            credits: creditsNum,
            semester: semesterNum,
            branch: branch,
        });

        const createdCourse = await Course.findById(course._id);

        res.status(201).json(
            new ApiResponse(201, createdCourse, "Course added successfully")
        );

    } catch (error) {
        throw new ApiError(500, error.message);
    }

})

const removeCourse = AsyncHandler(async (req, res) => {
    const { courseId } = req.params;

    if (!courseId) {
        throw new ApiError(400, "Course ID is required");
    }

    const course = await Course.findById(courseId);

    if (!course) {
        throw new ApiError(404, "Course not found");
    }
    await Student.updateMany(
        { "courses.course": courseId },
        { $pull: { courses: { course: courseId } } }
    );

    await course.deleteOne();

    res.status(200).json(
        new ApiResponse(200, course, "Course removed successfully and cleaned from students")
    );
});



const getAllCourses = AsyncHandler(async (req, res) => {
    const page = Number.isInteger(Number(req.query.page)) && Number(req.query.page) > 0 
        ? Number(req.query.page) 
        : 1;

    const limit = Number.isInteger(Number(req.query.limit)) && Number(req.query.limit) > 0 
        ? Math.min(Number(req.query.limit), 100) 
        : 10;

    const search = req.query.search || "";
    const branch = req.query.branch;
    const semester = req.query.semester;

    const filter = {};
    if (branch) filter.branch = branch;
    if (semester) filter.semester = Number(semester);
    if (search) {
        filter.$or = [
            { title: { $regex: search, $options: "i" } },
            { courseCode: { $regex: search, $options: "i" } },
        ];
    }

    const courses = await Course.find(filter)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("enrolledStudents", "fullName scholarId")
        .exec();

    const totalCourses = await Course.countDocuments(filter);

    res.status(200).json(
        new ApiResponse(200, {
            courses,
            totalPages: Math.ceil(totalCourses / limit),
            currentPage: page,
            totalCourses
        }, "Courses fetched successfully")
    );
});


const getCourse = AsyncHandler(async (req,res) => {

  const { courseId } = req.params;

  if(!courseId){
      throw new ApiError(400, "Course ID is required");
  }

  const course = await Course.findById(courseId).populate("enrolledStudents", "fullName scholarId");

  if(!course){
      throw new ApiError(404, "Course not found");
  }
  
  res
  .status(200)    
  .json(
      new ApiResponse(200, course, "Course found successfully")
  );
});

const updateCourse = AsyncHandler(async (req,res) => {

  const { courseId } = req.params;

  const { title, courseCode, credits, semester, branch } = req.body;

  if(!courseId){
      throw new ApiError(400, "Course ID is required");
  }

  const course = await Course.findById(courseId);

  if(!course){
      throw new ApiError(404, "Course not found");
  }

  if(courseCode && courseCode !== course.courseCode) {
    const existingCourse = await Course.findOne({ courseCode });
    if(existingCourse && existingCourse._id.toString() !== courseId) {
        throw new ApiError(400, "Course code already exists");
    }
    course.courseCode = courseCode;
}

  if(title) course.title = title;
  if(credits) course.credits = credits;
  if(semester) course.semester = semester;
  if(branch) course.branch = branch;

  await course.save();

  res
  .status(200)    
  .json(
      new ApiResponse(200, course, "Course updated successfully")
  );
})




export {
    addCourse,
    removeCourse,
    getAllCourses,
    getCourse,
    updateCourse
}