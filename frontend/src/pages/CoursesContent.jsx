import { useMemo } from 'react';
import CourseCard from '../components/CourseCard.jsx';
import { useStudentContext } from '../context/StudentData.jsx';
import { useAuthContext } from '../context/AuthContexts.jsx';

const CoursesContent = () => {
  const { enrolledCourses, fetchStudentData } = useStudentContext();
  const { isloading } = useAuthContext();

  // Memoize filtered courses to prevent unnecessary re-renders
  const { activeCourses, completedCourses } = useMemo(() => {
    const active = enrolledCourses.filter(course => !course.completed);
    const completed = enrolledCourses.filter(course => course.completed);
    return { activeCourses: active, completedCourses: completed };
  }, [enrolledCourses]);

  const handleRetry = () => {
    fetchStudentData();
  };

  // Loading skeleton component
  const CoursesSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="bg-gray-200 rounded-lg h-48 w-full"></div>
        </div>
      ))}
    </div>
  );

  // Empty state component
  const EmptyState = ({ title, message, icon, actionButton }) => (
    <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
      <div className="mx-auto w-12 h-12 text-gray-400 mb-4">
        {icon}
      </div>
      <h4 className="text-lg font-medium text-gray-900 mb-2">{title}</h4>
      <p className="text-gray-600 mb-4">{message}</p>
      {actionButton}
    </div>
  );

  // Course section component
  const CourseSection = ({ title, courses, isLoading, emptyStateConfig }) => (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {courses.length} {courses.length === 1 ? 'course' : 'courses'}
        </span>
      </div>
      
      {isLoading ? (
        <CoursesSkeleton />
      ) : courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <CourseCard 
              key={course.enrollmentId} 
              course={course} 
              showSemester={true} 
            />
          ))}
        </div>
      ) : (
        <EmptyState {...emptyStateConfig} />
      )}
    </section>
  );

  // Icons for empty states
  const BookOpenIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );

  const CheckCircleIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Courses</h2>
          <p className="text-gray-600 mt-1">
            Manage your enrolled and completed courses
          </p>
        </div>
        
        {/* Summary stats */}
        <div className="flex gap-4 text-sm">
          <div className="bg-blue-50 text-blue-700 px-3 py-2 rounded-lg">
            <span className="font-semibold">{activeCourses.length}</span> Active
          </div>
          <div className="bg-green-50 text-green-700 px-3 py-2 rounded-lg">
            <span className="font-semibold">{completedCourses.length}</span> Completed
          </div>
        </div>
      </div>

      {/* Error state */}
      {!isloading && enrolledCourses.length === 0 && (
        <EmptyState
          title="No Courses Found"
          message="It looks like you haven't enrolled in any courses yet. Contact your administrator if this seems incorrect."
          icon={<BookOpenIcon />}
          actionButton={
            <button
              onClick={handleRetry}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Retry
            </button>
          }
        />
      )}

      {/* Active Courses Section */}
      <CourseSection
        title="Currently Enrolled"
        courses={activeCourses}
        isLoading={isloading}
        emptyStateConfig={{
          title: "No Active Courses",
          message: "You don't have any active courses at the moment. New courses will appear here when you enroll.",
          icon: <BookOpenIcon />
        }}
      />

      {/* Completed Courses Section */}
      <CourseSection
        title="Completed Courses"
        courses={completedCourses}
        isLoading={isloading}
        emptyStateConfig={{
          title: "No Completed Courses",
          message: "Courses you've successfully completed will appear here. Keep up the great work!",
          icon: <CheckCircleIcon />
        }}
      />
    </div>
  );
};

export default CoursesContent;