import {axiosInstance} from '../utils/axiosInstance.js';
import { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAdminContext } from './AdminContext.jsx';

export const CourseContext = createContext();
export const useCourseContext = () => {
    const context = useContext(CourseContext);
    if (!context) {
        throw new Error("useCourseContext must be used within a CourseProvider");
    }
    return context;
}

export const CourseProvider = (props) => {
    const [courseGrades, setCourseGrades] = useState({ results: [], currentSGPA: 0 });

    const { setLoading } = useAdminContext();

    const addStudentGrade = async (studentId, gradeData) => {
        setLoading(true);
        try {
            const response = await axiosInstance.post(`/cgpa/add/${studentId}`,  gradeData );
            toast.success("Grade added successfully");
            return response.data;
        } catch (error) {
            console.error(error);
            toast.error("Failed to add grade");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const getStudentCourseGrades = async (studentId) => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/cgpa/course-grade/${studentId}`);
            const data = response.data?.data || { results: [], currentSGPA: 0 };
            setCourseGrades(data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch course grades");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return (
        <CourseContext.Provider value={{ addStudentGrade, getStudentCourseGrades,courseGrades }}>
            {props.children}
        </CourseContext.Provider>
    );
}