
import { axiosInstance } from '../utils/axiosInstance.js';
import { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export const AdminContext = createContext();

export const useAdminContext = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error("useAdminContext must be used within an AdminProvider");
  return context;
};

export const AdminProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const [token, setToken] = useState(localStorage.getItem('adminToken') || "");
  const [loading, setLoading] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [studentCurrentPage, setStudentCurrentPage] = useState(1);
  const [studentTotalPages, setStudentTotalPages] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);
  const [courseCurrentPage, setCourseCurrentPage] = useState(1);
  const [courseTotalPages, setCourseTotalPages] = useState(1);
  const [totalCourses, setTotalCourses] = useState(0);

  const loginAdmin = async (credentials) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post('/users/admin-login', credentials);
      if (res.data.success) {
        const adminToken = res.data.data.adminToken;
        setToken(adminToken);
        localStorage.setItem('adminToken', adminToken);
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${adminToken}`;
        setIsAdminLogin(true);
        toast.success("Admin logged in successfully");
        await fetchAllStudents();
        await fetchAllCourses();
      } else {
        toast.error(res.data.message || "Login failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Login error");
    } finally {
      setLoading(false);
    }
  };

  const logoutAdmin = () => {
    setToken("");
    localStorage.removeItem('adminToken');
    delete axiosInstance.defaults.headers.common['Authorization'];
    setIsAdminLogin(false);
    toast.success("Logged out");
  };

  const fetchAllStudents = async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/students/all', { params: { page, limit } });
      if (res.data.success) {
        const { students, totalPages, currentPage, totalStudents } = res.data.data;
        setStudents(students);
        setStudentTotalPages(totalPages);
        setStudentCurrentPage(currentPage);
        setTotalStudents(totalStudents);
      } else {
        toast.error(res.data.message || "Failed to fetch students");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error fetching students");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllCourses = async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/courses/all', { params: { page, limit } });
      if (res.data.success) {
        const { courses, totalPages, currentPage, totalCourses } = res.data.data;
        setCourses(courses);
        setCourseTotalPages(totalPages);
        setCourseCurrentPage(currentPage);
        setTotalCourses(totalCourses);
      } else {
        toast.error(res.data.message || "Failed to fetch courses");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error fetching courses");
    } finally {
      setLoading(false);
    }
  };

  const createStudent = async (studentData) => {
    setLoading(true);
    try {
        const res = await axiosInstance.post('/students/register', studentData);
        if (res.data.success) {
            toast.success("Student created successfully");
            return true;
        } else {
            toast.error(res.data.message || "Failed to create student");
            return false;
        }
    } catch (err) {
        console.error(err);
        const errorMessage = err.response?.data?.message || "Error creating student";
        toast.error(errorMessage);
        return false;
    } finally {
        setLoading(false);
    }
};

  const createCourse = async (courseData) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post('/courses/add', courseData);
      if (res.data.success) toast.success("Course created");
      else toast.error(res.data.message);
    } catch (err) {
      console.error(err);
      toast.error("Error creating course");
    } finally {
      setLoading(false);
    }
  };

  const removeStudent = async (scholarId) => {
    setLoading(true);
    try {
      const res = await axiosInstance.delete(`/students/delete/${scholarId}`);
      if (res.data.success) toast.success("Student removed");
      else toast.error(res.data.message);
    } catch (err) {
      console.error(err);
      toast.error("Error removing student");
    } finally {
      setLoading(false);
    }
  };

  const removeCourse = async (courseId) => {
    setLoading(true);
    try {
      const res = await axiosInstance.delete(`/courses/remove/${courseId}`);
      if (res.data.success) toast.success("Course removed");
      else toast.error(res.data.message);
    } catch (err) {
      console.error(err);
      toast.error("Error removing course");
    } finally {
      setLoading(false);
    }
  };

  const removeStudentFromCourse = async (scholarId, courseId) => {
    setLoading(true);
    try {
      const res = await axiosInstance.delete(`/students/remove-from-course/${scholarId}`, {
        data: { courseId },
      });
      if (res.data.success) toast.success("Removed from course");
      else toast.error(res.data.message);
    } catch (err) {
      console.error(err);
      toast.error("Error removing from course");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('adminToken');
    if (storedToken) {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      setToken(storedToken);
      setIsAdminLogin(true);
    } else {
      delete axiosInstance.defaults.headers.common['Authorization'];
      setToken("");
      setIsAdminLogin(false);
    }
  }, []);

  return (
    <AdminContext.Provider value={{
      backendUrl,
      token,
      isAdminLogin,
      loading,
      setLoading,
      loginAdmin,
      logoutAdmin,
      fetchAllStudents,
      fetchAllCourses,
      createStudent,
      createCourse,
      removeStudent,
      removeCourse,
      removeStudentFromCourse,
      students,
      courses,
      studentCurrentPage,
      setStudentCurrentPage,
      studentTotalPages,
      totalStudents,
      courseCurrentPage,
      setCourseCurrentPage,
      courseTotalPages,
      totalCourses,
    }}>
      {props.children}
    </AdminContext.Provider>
  );
};