import { useStudentContext } from '../context/StudentData.jsx';
import { useMemo } from 'react';

const GradesContent = () => {
  const { enrolledCourses, cgpaData, grades, loading, error } = useStudentContext();

  // Memoized grade lookup for better performance
  const gradeMap = useMemo(() => {
    const map = new Map();
    if (grades && Array.isArray(grades)) {
      grades.forEach(semester => {
        if (semester.courses && Array.isArray(semester.courses)) {
          semester.courses.forEach(item => {
            if (item?.course?._id) {
              map.set(item.course._id, item.grade);
            }
          });
        }
      });
    }
    return map;
  }, [grades]);

  // Optimized grade lookup function
  const getCourseGrade = (courseId) => {
    return gradeMap.get(courseId) || 'N/A';
  };

  // Memoized completed courses
  const completedCourses = useMemo(() => {
    return enrolledCourses?.filter(course => course.completed) || [];
  }, [enrolledCourses]);

  // Calculate additional statistics
  const statistics = useMemo(() => {
    if (!completedCourses.length) return null;
    
    const totalCredits = completedCourses.reduce((sum, course) => sum + (course.credits || 0), 0);
    const gradedCourses = completedCourses.filter(course => getCourseGrade(course._id) !== 'N/A');
    
    return {
      totalCredits,
      gradedCourses: gradedCourses.length,
      totalCourses: completedCourses.length,
      ungradedCourses: completedCourses.length - gradedCourses.length
    };
  }, [completedCourses, gradeMap]);

  // Grade color mapping
  const getGradeColor = (grade) => {
    if (grade === 'N/A') return 'bg-gray-100 text-gray-800';
    
    const gradeValue = grade.toUpperCase();
    switch (gradeValue) {
      case 'A+':
      case 'A':
        return 'bg-green-100 text-green-800';
      case 'A-':
      case 'B+':
        return 'bg-blue-100 text-blue-800';
      case 'B':
      case 'B-':
        return 'bg-yellow-100 text-yellow-800';
      case 'C+':
      case 'C':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-gray-50 p-4 rounded-lg">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Academic Records</h2>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 mb-2">
            <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Unable to Load Academic Records</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Academic Records</h2>
        {statistics && (
          <div className="text-sm text-gray-600">
            {statistics.gradedCourses} of {statistics.totalCourses} courses graded
          </div>
        )}
      </div>

      {/* Overall Performance Card */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold">Overall Performance</h3>
          <div className="text-right">
            <p className="text-sm text-gray-600">Current SGPA</p>
            <p className="text-3xl font-bold text-green-600">
              {cgpaData?.currentCGPA || 'N/A'}
            </p>
            {statistics && (
              <p className="text-xs text-gray-500 mt-1">
                {statistics.totalCredits} credits completed
              </p>
            )}
          </div>
        </div>

        {/* Semester Performance Grid */}
        {grades && grades.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {grades.map((grade) => (
              <div key={grade.semester} className="bg-gray-50 p-4 rounded-lg text-center hover:bg-gray-100 transition-colors">
                <p className="text-sm text-gray-600">Semester {grade.semester}</p>
                <p className="text-2xl font-bold text-blue-600">{grade.cgpa || 'N/A'}</p>
                <p className="text-xs text-gray-500">CGPA</p>
                {grade.courses && (
                  <p className="text-xs text-gray-400 mt-1">
                    {grade.courses.length} courses
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No semester data available</p>
          </div>
        )}
      </div>

      {/* Course Grades Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Course Grades</h3>
          {statistics?.ungradedCourses > 0 && (
            <span className="text-sm text-amber-600 bg-amber-50 px-2 py-1 rounded">
              {statistics.ungradedCourses} courses pending grades
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-3 font-semibold text-gray-700">Course</th>
                <th className="pb-3 font-semibold text-gray-700">Code</th>
                <th className="pb-3 font-semibold text-gray-700">Credits</th>
                <th className="pb-3 font-semibold text-gray-700">Grade</th>
              </tr>
            </thead>
            <tbody>
              {completedCourses.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center text-gray-500 py-8">
                    <div className="flex flex-col items-center">
                      <svg className="w-12 h-12 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-lg font-medium">No completed courses</p>
                      <p className="text-sm">Grades will appear here once courses are completed</p>
                    </div>
                  </td>
                </tr>
              ) : (
                completedCourses.map(course => {
                  const grade = getCourseGrade(course._id);
                  return (
                    <tr key={course._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 font-medium">{course.title}</td>
                      <td className="py-3 text-gray-600">{course.courseCode}</td>
                      <td className="py-3 text-gray-600">{course.credits}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded text-sm font-medium ${getGradeColor(grade)}`}>
                          {grade}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Summary Statistics */}
        {statistics && completedCourses.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Total Completed Courses: {statistics.totalCourses}</span>
              <span>Total Credits: {statistics.totalCredits}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GradesContent;