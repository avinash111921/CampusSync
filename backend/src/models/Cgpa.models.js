import mongoose, { Schema } from "mongoose";

const semesterResultSchema = new Schema({
    semester: {
        type: Number,
        required: true,
    },
    cgpa: {
        type: Number,
        required: true,
        min: 0,
        max: 10,
    },
    courses: [
        {
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
        },
        grade: {
            type: String,
            enum: ["A", "B", "C", "D", "E", "F"],
            required: true,
        },
        },
    ],
});

const cgpaSchema = new Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true,
        unique: true,
     },
    results: [semesterResultSchema],
    currentSGPA: {
        type: Number,
        min: 0,
        max: 10,
        default: 0,
    },
},
{ timestamps: true }
);

export const CGPA = mongoose.model("CGPA", cgpaSchema);
