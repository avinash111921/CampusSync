import { BookOpen, Award, Calendar, TrendingUp, Clock, GraduationCap, RefreshCw, AlertCircle } from 'lucide-react';
import { useMemo } from 'react';
import StatCard from '../components/StatCard.jsx';
import { useAuthContext } from '../context/AuthContexts';
import { useStudentContext } from '../context/StudentData.jsx';
import { useNavigate } from 'react-router-dom';
const DashboardContent = () => {
  const { student } = useAuthContext();
  const { 
    enrolledCourses, 
    cgpaData, 
    studentStats, 
    loading, 
    error, 
    refreshAllData,
    activeCourses,
    completedCourses 
  } = useStudentContext();
  const navigate = useNavigate();
  // Memoized computed values for better performance
  const dashboardStats = useMemo(() => {
    const recentCourses = activeCourses.slice(0, 3);
    const recentGrades = cgpaData?.semesters?.slice(-3) || [];
    
    // Calculate progress percentage
    const progressPercentage = enrolledCourses.length > 0 
      ? Math.round((completedCourses.length / enrolledCourses.length) * 100)
      : 0;

    // Get current semester SGPA
    const currentSemesterGrade = cgpaData?.semesters?.find(
      sem => sem.semester === student?.semester
    );

    return {
      recentCourses,
      recentGrades,
      progressPercentage,
      currentSemesterGrade,
      totalCredits: studentStats.totalCredits,
      completedCredits: studentStats.completedCredits
    };
  }, [activeCourses, cgpaData, enrolledCourses, completedCourses, student, studentStats]);

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="space-y-6">
      <div className="bg-gray-200 animate-pulse h-32 rounded-lg"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-gray-200 animate-pulse h-24 rounded-lg"></div>
        ))}
      </div>
    </div>
  );

  // Error state component
  const ErrorState = () => (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-red-800 mb-2">Unable to Load Dashboard</h3>
      <p className="text-red-600 mb-4">{error}</p>
      <button
        onClick={refreshAllData}
        className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Retry
      </button>
    </div>
  );

  // Enhanced welcome card with more information
  const WelcomeCard = () => (
    <div className="bg-gradient-to-br from-green-500 via-blue-600 to-purple-700 text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              Welcome back, {student?.fullName || 'Student'}! 👋
            </h2>
            <div className="space-y-1 opacity-90">
              <p>Scholar ID: {student?.scholarId}</p>
              <p>{student?.branch} • Current Semester: {student?.semester}</p>
              <p>Academic Progress: {dashboardStats.progressPercentage}% Complete</p>
            </div>
          </div>
          <div className="text-right">
            <GraduationCap className="w-16 h-16 opacity-30" />
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Academic Progress</span>
            <span>{dashboardStats.progressPercentage}%</span>
          </div>
          <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${dashboardStats.progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );

  // Enhanced stats cards with better data
  const StatsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        icon={BookOpen}
        title="Total Courses"
        value={enrolledCourses.length}
        subtitle={`${activeCourses.length} active`}
        borderColor="border-blue-500"
        iconColor="text-blue-500"
      />
      
      <StatCard
        icon={Award}
        title="Current CGPA"
        value={cgpaData?.currentCGPA ? cgpaData.currentCGPA.toFixed(2) : 'N/A'}
        subtitle={dashboardStats.currentSemesterGrade ? `SGPA: ${dashboardStats.currentSemesterGrade.sgpa}` : 'No data'}
        borderColor="border-green-500"
        iconColor="text-green-500"
      />
      
      <StatCard
        icon={TrendingUp}
        title="Credits Earned"
        value={`${dashboardStats.completedCredits}/${dashboardStats.totalCredits}`}
        subtitle={`${dashboardStats.totalCredits - dashboardStats.completedCredits} remaining`}
        borderColor="border-purple-500"
        iconColor="text-purple-500"
      />

      <StatCard
        icon={Calendar}
        title="Current Semester"
        value={student?.semester || 'N/A'}
        subtitle={`${activeCourses.length} courses`}
        borderColor="border-orange-500"
        iconColor="text-orange-500"
      />
    </div>
  );

  // Enhanced recent courses section
  const RecentCoursesCard = () => (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold flex items-center">
          <BookOpen className="w-5 h-5 mr-2 text-blue-500" />
          Active Courses
        </h3>
        <span className="text-sm text-gray-500">{activeCourses.length} courses</span>
      </div>
      
      <div className="space-y-3">
        {dashboardStats.recentCourses.length > 0 ? (
          dashboardStats.recentCourses.map((course) => (
            <div key={course._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex-1">
                <p className="font-medium text-gray-900">{course.title}</p>
                <p className="text-sm text-gray-600">
                  {course.courseCode} • {course.credits} Credits
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  Sem {course.semester}
                </span>
                <Clock className="w-4 h-4 text-yellow-500" />
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No active courses found</p>
          </div>
        )}
      </div>
      
      {activeCourses.length > 3 && (
        <div className="mt-4 text-center">
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View all {activeCourses.length} courses →
          </button>
        </div>
      )}
    </div>
  );

  // Enhanced academic performance section
  const AcademicPerformanceCard = () => (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold flex items-center">
          <Award className="w-5 h-5 mr-2 text-green-500" />
          Academic Performance
        </h3>
        <span className="text-sm text-gray-500">
          {cgpaData?.semesters?.length || 0} semesters
        </span>
      </div>
      
      <div className="space-y-3">
        {dashboardStats.recentGrades.length > 0 ? (
          dashboardStats.recentGrades.map((grade, index) => (
            <div key={grade.semester} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <span className="font-medium">Semester {grade.semester}</span>
                {index === 0 && (
                  <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    Latest
                  </span>
                )}
              </div>
              <div className="text-right">
                <span className="text-green-600 font-bold">SGPA: {grade.sgpa}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Award className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No grade data available</p>
          </div>
        )}
      </div>
      
      {cgpaData?.currentCGPA && (
        <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-green-800">Overall CGPA</span>
            <span className="text-xl font-bold text-green-600">
              {cgpaData.currentCGPA.toFixed(2)}
            </span>
          </div>
        </div>
      )}
    </div>
  );

  // Handle loading state
  if (loading) {
    return <LoadingSkeleton />;
  }

  // Handle error state
  if (error) {
    return <ErrorState />;
  }

  return (
    <div className="space-y-6">
      <WelcomeCard />
      <StatsCards />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentCoursesCard />
        <AcademicPerformanceCard />
      </div>
      
      {/* Quick actions */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button onClick={() => navigate('/courses')} className="flex items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
            <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
            <span className="text-blue-600 font-medium">View All Courses</span>
          </button>
          <button onClick={() => navigate('/grades')} className="flex items-center justify-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
            <Award className="w-5 h-5 mr-2 text-green-600" />
            <span className="text-green-600 font-medium">View Grades</span>
          </button>
          <button 
            onClick={refreshAllData}
            className="flex items-center justify-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
          >
            <RefreshCw className="w-5 h-5 mr-2 text-purple-600" />
            <span className="text-purple-600 font-medium">Refresh Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;