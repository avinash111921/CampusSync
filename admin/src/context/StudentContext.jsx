import { axiosInstance } from '../utils/axiosInstance.js';
import { createContext, useContext, useState } from 'react';
import toast from 'react-hot-toast';
import { useAdminContext } from './AdminContext.jsx';

export const StudentContext = createContext();

export const useStudentContext = () => {
  const context = useContext(StudentContext);
  if (!context) throw new Error("useStudentContext must be used within a StudentProvider");
  return context;
};

export const StudentProvider = (props) => {
  const { setLoading, fetchAllStudents, fetchAllCourses, studentCurrentPage, courseCurrentPage } = useAdminContext();
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [studentCourse, setStudentCourse] = useState([]);

  const getStudent = async (scholarId) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/students/get/${scholarId}`);
      if (res.data.success) setSelectedStudent(res.data.data);
      else toast.error(res.data.message);
    } catch (err) {
      console.error(err);
      toast.error("Error fetching student");
    } finally {
      setLoading(false);
    }
  };

  const getCourse = async (courseId) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/courses/get/${courseId}`);
      if (res.data.success) setSelectedCourse(res.data.data);
      else toast.error(res.data.message);
    } catch (err) {
      console.error(err);
      toast.error("Error fetching course");
    } finally {
      setLoading(false);
    }
  };

  const updateStudentProfile = async (scholarId, data) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post(`/students/update/${scholarId}`, data);
      if (res.data.success) {
        toast.success("Student updated");
        getStudent(scholarId);
        fetchAllStudents(studentCurrentPage);
      } else toast.error(res.data.message);
    } catch (err) {
      console.error(err);
      toast.error("Error updating student");
    } finally {
      setLoading(false);
    }
  };

  const updateCourse = async (courseId, data) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post(`/courses/update/${courseId}`, data);
      if (res.data.success) {
        toast.success("Course updated");
        getCourse(courseId);
        fetchAllCourses(courseCurrentPage);
      } else toast.error(res.data.message);
    } catch (err) {
      console.error(err);
      toast.error("Error updating course");
    } finally {
      setLoading(false);
    }
  };

  const enrollStudentInCourse = async (scholarId, courseId) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post(`/students/enroll/${scholarId}`, { courseId });
      if (res.data.success) {
        toast.success("Enrolled in course");
        getStudent(scholarId);
        getCourse(courseId);
      } else toast.error(res.data.message);
    } catch (err) {
      console.error(err);
      toast.error("Enrollment error");
    } finally {
      setLoading(false);
    }
  };

  const getStudentCourses = async (scholarId) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/students/courses/${scholarId}`);
      if (res.data.success) {
        setStudentCourse(res.data.data.courses);
        toast.success("Courses fetched");
      } else toast.error(res.data.message);
    } catch (err) {
      console.error(err);
      toast.error("Error fetching student courses");
    } finally {
      setLoading(false);
    }
  };

  return (
    <StudentContext.Provider
      value={{
        selectedStudent,
        setSelectedStudent,
        selectedCourse,
        studentCourse,
        getStudent,
        getCourse,
        updateStudentProfile,
        updateCourse,
        enrollStudentInCourse,
        getStudentCourses,
        setSelectedCourse,
      }}
    >
      {props.children}
    </StudentContext.Provider>
  );
};