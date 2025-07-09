import mongoose, { Schema } from "mongoose";

const StudentSchema = new Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    scholarId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true,
    },
    admissionYear: {
        type: Number,
        required: true,
        min: 2000,
        max: new Date().getFullYear(),
    },
    branch : {
        type: String,
        required: true,
        trim: true,
    },
    semester : {
        type: Number,
        required: true,
        min: 1,
        max: 8,
    },
    courses: [{
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true
        },
        completed: {
            type: Boolean,
            default: false
        }
    }]
})

export const Student = mongoose.model("Student", StudentSchema);