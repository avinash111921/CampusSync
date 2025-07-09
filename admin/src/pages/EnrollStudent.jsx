import React, { useState, useEffect } from 'react';
import { useAdminContext } from '../context/AdminContext';
import { useStudentContext } from '../context/StudentContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, Users, BookOpen, CheckCircle, Info, Search } from 'lucide-react';

const EnrollStudentPage = () => {
  const { students, courses, loading, fetchAllStudents, fetchAllCourses } = useAdminContext();
  const { 
    selectedStudent,
    setSelectedStudent, 
    selectedCourse, 
    studentCourse, 
    getStudent, 
    getCourse, 
    enrollStudentInCourse, 
    getStudentCourses,
    setSelectedCourse 
  } = useStudentContext();

  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [courseSearchQuery, setCourseSearchQuery] = useState('');

  useEffect(() => {
    fetchAllStudents(1, 100); 
    fetchAllCourses(1, 100); 
  }, []);

  useEffect(() => {
    if (selectedStudentId) {
      getStudent(selectedStudentId);
      getStudentCourses(selectedStudentId);
    }
  }, [selectedStudentId]);

  useEffect(() => {
    if (selectedCourseId) {
      getCourse(selectedCourseId);
    }
  }, [selectedCourseId]);

  const filteredStudents = students.filter(student =>
    student.fullName.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
    student.scholarId.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
    student.branch.toLowerCase().includes(studentSearchQuery.toLowerCase())
  );

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(courseSearchQuery.toLowerCase()) ||
    course.courseCode.toLowerCase().includes(courseSearchQuery.toLowerCase())
  );

  const handleEnrollment = async () => {
    if (!selectedStudentId || !selectedCourseId) {
      return;
    }

    setIsEnrolling(true);
    try {
      await enrollStudentInCourse(selectedStudentId, selectedCourseId);
      await getStudentCourses(selectedStudentId);
      setSelectedCourseId('');
      setSelectedCourse(null);
      setCourseSearchQuery('');
    } catch (error) {
      console.error('Enrollment error:', error);
    } finally {
      setIsEnrolling(false);
    }
  };

  const isStudentEnrolledInCourse = (courseId) => {
    return studentCourse && studentCourse.some(enrollment => enrollment.course._id === courseId);
  };

  const availableCourses = filteredCourses.filter(course => !isStudentEnrolledInCourse(course._id));

  const handleStudentSelection = (studentId) => {
    setSelectedStudentId(studentId);
    setSelectedCourseId('');
    setSelectedCourse(null);
    setCourseSearchQuery('');
  };

  const handleReset = () => {
    setSelectedStudentId('');
    setSelectedCourseId('');
    setSelectedCourse(null);
    setSelectedStudent(null);
    setStudentSearchQuery('');
    setCourseSearchQuery('');
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Enroll Student in Course</h1>
        <p className="text-gray-600">Select a student and enroll them in available courses</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Select Student
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search students by name, Scholar ID, or department..."
                value={studentSearchQuery}
                onChange={(e) => setStudentSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedStudentId} onValueChange={handleStudentSelection}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a student" />
              </SelectTrigger>
              <SelectContent>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                  <SelectItem key={student.scholarId} value={student.scholarId}>
                    {student.fullName} ({student.scholarId}) - {student.branch}
                  </SelectItem>
                ))) : (
                <div className="px-3 py-2 text-sm text-gray-500">No students found</div>
                )}
              </SelectContent>
            </Select>

            {studentSearchQuery && (
              <p className="text-sm text-gray-500">
                {filteredStudents.length} student(s) found
              </p>
            )}

            {selectedStudent && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Student Details</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Name:</span> {selectedStudent.fullName}</p>
                  <p><span className="font-medium">Scholar ID:</span> {selectedStudent.scholarId}</p>
                  <p><span className="font-medium">Department:</span> {selectedStudent.branch}</p>
                </div>
              </div>
            )}

            {selectedStudentId && studentCourse && studentCourse.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold text-gray-900 mb-2">Current Enrollments ({studentCourse.length})</h4>
                <div className="flex flex-wrap gap-2">
                  {studentCourse.map((enrollment) => (
                    <Badge key={enrollment._id} variant="secondary" className="bg-green-100 text-green-800">
                      {enrollment.course.title} ({enrollment.course.courseCode})
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {selectedStudentId && studentCourse && studentCourse.length === 0 && (
              <div className="mt-4">
                <div className="flex items-center gap-2 p-3 bg-gray-50 text-gray-600 rounded-lg">
                  <Info className="w-4 h-4" />
                  <span className="text-sm">This student is not enrolled in any courses yet.</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Course Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Select Course
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedStudentId ? (
              <>
                {/* Course Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search courses by title or code..."
                    value={courseSearchQuery}
                    onChange={(e) => setCourseSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCourses.length > 0 ? (
                      availableCourses.map((course) => (
                        <SelectItem key={course._id} value={course._id}>
                          {course.title} - {course.courseCode}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-sm text-gray-500">
                        {courseSearchQuery ? 'No matching courses found' : 'No available courses'}
                      </div>
                    )}
                  </SelectContent>
                </Select>

                {courseSearchQuery && (
                  <p className="text-sm text-gray-500">
                    {availableCourses.length} course(s) available
                  </p>
                )}

                {availableCourses.length === 0 && studentCourse && studentCourse.length > 0 && !courseSearchQuery && (
                  <div className="flex items-center gap-2 p-3 bg-blue-50 text-blue-800 rounded-lg">
                    <Info className="w-4 h-4" />
                    <span className="text-sm">This student is already enrolled in all available courses.</span>
                  </div>
                )}

                {availableCourses.length === 0 && (!studentCourse || studentCourse.length === 0) && !courseSearchQuery && (
                  <div className="flex items-center gap-2 p-3 bg-gray-50 text-gray-600 rounded-lg">
                    <Info className="w-4 h-4" />
                    <span className="text-sm">Loading student enrollment data...</span>
                  </div>
                )}

                {selectedCourse && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg">
                    <h3 className="font-semibold text-green-900 mb-2">Course Details</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Title:</span> {selectedCourse.title}</p>
                      <p><span className="font-medium">Code:</span> {selectedCourse.courseCode}</p>
                      <p><span className="font-medium">Credits:</span> {selectedCourse.credits}</p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center gap-2 p-3 bg-blue-50 text-blue-800 rounded-lg">
                <Info className="w-4 h-4" />
                <span className="text-sm">Please select a student first to view available courses.</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Enrollment Action */}
      {selectedStudentId && selectedCourseId && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Confirm Enrollment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-yellow-50 p-4 rounded-lg mb-4">
              <h3 className="font-semibold text-yellow-900 mb-2">Enrollment Summary</h3>
              <p className="text-sm text-yellow-800">
                You are about to enroll <span className="font-medium">{selectedStudent?.fullName}</span> 
                {' '}in the course <span className="font-medium">{selectedCourse?.title}</span>.
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={handleEnrollment}
                disabled={isEnrolling || loading}
                className="flex-1"
              >
                {isEnrolling ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Enrolling...
                  </>
                ) : (
                  'Confirm Enrollment'
                )}
              </Button>
              
              <Button
                variant="outline"
                onClick={handleReset}
                disabled={isEnrolling || loading}
              >
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnrollStudentPage;