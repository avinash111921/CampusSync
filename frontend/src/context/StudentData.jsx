import { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useAuthContext } from "./AuthContexts";
import { axiosInstance } from "../utils/axios";
import toast from "react-hot-toast";

const StudentContext = createContext();

export const useStudentContext = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error("useStudentContext must be used within a StudentProvider");
  }
  return context;
};

export const StudentProvider = ({ children }) => {
  const { student, user } = useAuthContext();
  
  // Add refs to prevent unnecessary re-renders
  const initialLoadRef = useRef(false);
  const loadingRef = useRef(false);

  // State management
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [cgpaData, setCgpaData] = useState(null);
  const [grades, setGrades] = useState([]);
  const [allCourseId, setAllCourseId] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Memoized computed values
  const studentStats = useMemo(() => {
    if (!enrolledCourses.length) {
      return {
        totalCourses: 0,
        completedCourses: 0,
        activeCourses: 0,
        totalCredits: 0,
        completedCredits: 0
      };
    }

    const completed = enrolledCourses.filter(course => course.completed);
    const active = enrolledCourses.filter(course => !course.completed);
    
    return {
      totalCourses: enrolledCourses.length,
      completedCourses: completed.length,
      activeCourses: active.length,
      totalCredits: enrolledCourses.reduce((sum, course) => sum + (course.credits || 0), 0),
      completedCredits: completed.reduce((sum, course) => sum + (course.credits || 0), 0)
    };
  }, [enrolledCourses]);

  // Enhanced error handling
  const handleError = useCallback((error, operation) => {
    console.error(`Error in ${operation}:`, error);
    
    let errorMessage = `Failed to ${operation}`;
    
    if (error.response?.status === 401) {
      errorMessage = "Authentication failed. Please log in again.";
    } else if (error.response?.status === 403) {
      errorMessage = "Access denied. You don't have permission to access this data.";
    } else if (error.response?.status === 404) {
      errorMessage = "Data not found. Please contact support if this persists.";
    } else if (error.response?.status >= 500) {
      errorMessage = "Server error. Please try again later.";
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }

    setError(errorMessage);
    toast.error(errorMessage);
  }, []);

  const fetchGrades = useCallback(async (studentId) => {
  try {
    const response = await axiosInstance.get(`/cgpa/course-grade/${studentId}`);
    if (response.data?.success && response.data?.data?.results) {
      setGrades(response.data.data.results); // ✅ Only set the `results` array
      return response.data.data.results;
    }
    throw new Error("Invalid response format for grades");
  } catch (error) {
    handleError(error, "fetch grades");
    return null;
  }
}, [handleError]);

  const fetchCgpaData = useCallback(async (studentId) => {
    try {
      const response = await axiosInstance.get(`/cgpa/get/${studentId}`);
      if (response.data?.success && response.data?.data) {
        setCgpaData(response.data.data);
        return response.data.data;
      }
      throw new Error("Invalid response format for CGPA data");
    } catch (error) {
      handleError(error, "fetch CGPA data");
      return null;
    }
  }, [handleError]);

  const fetchCourseIds = useCallback(async (scholarId) => {
    try {
      const response = await axiosInstance.get(`/students/courses/${scholarId}`);
      if (response.data?.success && response.data?.data?.courses) {
        const courseIds = response.data.data.courses.map((item) => ({
          courseId: item.course._id,
          completed: item.completed,
          enrollmentId: item._id,
        }));
        setAllCourseId(courseIds);
        return courseIds;
      }
      throw new Error("Invalid response format for course IDs");
    } catch (error) {
      handleError(error, "fetch course IDs");
      return [];
    }
  }, [handleError]);

  // Fixed fetchStudentData - removed loading dependency
  const fetchStudentData = useCallback(async (forceRefresh = false) => {
    if (!student?._id || !user?.scholarId) {
      console.warn("Student ID or Scholar ID not available");
      return;
    }

    // Prevent multiple concurrent calls
    if (loadingRef.current && !forceRefresh) return;
    
    loadingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const [gradesData, cgpaData, courseIds] = await Promise.all([
        fetchGrades(student._id),
        fetchCgpaData(student._id),
        fetchCourseIds(user.scholarId)
      ]);

      if (forceRefresh) {
        toast.success("Student data updated successfully");
      }

    } catch (error) {
      handleError(error, "fetch student data");
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [student?._id, user?.scholarId, fetchGrades, fetchCgpaData, fetchCourseIds, handleError]);

  const fetchEnrolledCourses = useCallback(async () => {
    if (!allCourseId.length) return;

    try {
      const coursePromises = allCourseId.map(async ({ courseId, completed, enrollmentId }) => {
        try {
          const response = await axiosInstance.get(`/courses/get/${courseId}`);
          if (response.data?.success && response.data?.data) {
            return {
              ...response.data.data,
              completed,
              enrollmentId,
            };
          }
          throw new Error(`Failed to fetch course ${courseId}`);
        } catch (error) {
          console.error(`Error fetching course ${courseId}:`, error);
          return {
            _id: courseId,
            courseCode: 'ERROR',
            title: 'Failed to load course',
            credits: 0,
            completed,
            enrollmentId,
            error: true
          };
        }
      });

      const courseInfoArray = await Promise.all(coursePromises);
      
      const validCourses = courseInfoArray.filter(course => !course.error);
      const erroredCourses = courseInfoArray.filter(course => course.error);

      if (erroredCourses.length > 0) {
        toast.error(`Failed to load ${erroredCourses.length} course(s)`);
      }

      setEnrolledCourses(validCourses);
      
    } catch (error) {
      handleError(error, "fetch enrolled courses");
    }
  }, [allCourseId, handleError]);

  const refreshAllData = useCallback(() => {
    fetchStudentData(true);
  }, [fetchStudentData]);

  const getCourseById = useCallback((courseId) => {
    return enrolledCourses.find(course => course._id === courseId);
  }, [enrolledCourses]);

  const getCoursesBySemester = useCallback((semester) => {
    return enrolledCourses.filter(course => course.semester === semester);
  }, [enrolledCourses]);

  // Fixed useEffect for enrolled courses
  useEffect(() => {
    if (allCourseId.length > 0) {
      fetchEnrolledCourses();
    } else {
      // Only clear if we previously had courses
      setEnrolledCourses(prev => prev.length > 0 ? [] : prev);
    }
  }, [allCourseId, fetchEnrolledCourses]);

  // Fixed main useEffect - prevent flickering
  useEffect(() => {
    const studentId = student?._id;
    const scholarId = user?.scholarId;

    if (studentId && scholarId) {
      if (!initialLoadRef.current) {
        initialLoadRef.current = true;
        fetchStudentData();
      }
    } else {
      // Reset when user logs out
      if (initialLoadRef.current) {
        initialLoadRef.current = false;
        setEnrolledCourses([]);
        setCgpaData(null);
        setGrades([]);
        setAllCourseId([]);
        setError(null);
        loadingRef.current = false;
        setLoading(false);
      }
    }
  }, [student?._id, user?.scholarId, fetchStudentData]);

  // Context value with all necessary data and functions
  const value = useMemo(() => ({
    // Data
    enrolledCourses,
    cgpaData,
    grades,
    allCourseId,
    studentStats,
    
    // State
    loading,
    error,
    
    // Functions
    fetchStudentData,
    refreshAllData,
    getCourseById,
    getCoursesBySemester,
    
    // Computed values
    activeCourses: enrolledCourses.filter(course => !course.completed),
    completedCourses: enrolledCourses.filter(course => course.completed),
  }), [
    enrolledCourses,
    cgpaData,
    grades,
    allCourseId,
    studentStats,
    loading,
    error,
    fetchStudentData,
    refreshAllData,
    getCourseById,
    getCoursesBySemester
  ]);

  return (
    <StudentContext.Provider value={value}>
      {children}
    </StudentContext.Provider>
  );
};

export default StudentProvider;