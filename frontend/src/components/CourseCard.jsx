const CourseCard = ({ course, showSemester = false }) => {
  return (
    <div className="relative bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 flex flex-col justify-between">
      <div className="mb-4 space-y-1">
        <h3 className="text-xl font-semibold text-gray-800 truncate">
          {course.title}
        </h3>
        <p className="text-sm text-gray-500">Code: {course.courseCode}</p>
        {showSemester && (
          <p className="text-sm text-gray-500">Semester: {course.semester}</p>
        )}
      </div>

      <div className="flex justify-between items-center mt-auto">
        <span className="text-sm font-medium text-blue-800 bg-blue-50 px-2 py-1 rounded-md">
          {course.credits} Credits
        </span>

        {/* Completion Badge - bottom right */}
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full ${
            course.completed
              ? 'bg-green-100 text-green-700'
              : 'bg-yellow-100 text-yellow-700'
          }`}
        >
          {course.completed ? 'Completed' : 'In Progress'}
        </span>
      </div>
    </div>
  );
};

export default CourseCard;
