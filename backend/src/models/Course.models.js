import mongoose, { Schema } from "mongoose";

const courseSchema = new Schema({
    courseCode: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        uppercase: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    credits: {
        type: Number,
        required: true,
        min: 1,
    },
    semester: {
        type: Number,
        required: true,
    },
    branch: {
        type: String,
        required: true,
        enum: ["CSE", "ECE", "ME", "CE", "EIE"],
    },
    enrolledStudents: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
        },
    ],
},
{ timestamps: true }
);

export const Course = mongoose.model("Course", courseSchema);
