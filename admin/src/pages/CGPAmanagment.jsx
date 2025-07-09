import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAdminContext } from '../context/AdminContext';
import { useCourseContext } from '../context/GradeContext';

const getGradeColor = (grade) => {
  const colors = {
    A: 'bg-green-100 text-green-800',
    B: 'bg-blue-100 text-blue-800',
    C: 'bg-yellow-100 text-yellow-800',
    D: 'bg-orange-100 text-orange-800',
    E: 'bg-red-100 text-red-800',
    F: 'bg-gray-100 text-gray-800',
  };
  return colors[grade] || 'bg-gray-100 text-gray-800';
};

const GradeManagement = () => {
  const { students, fetchAllStudents, courses, fetchAllCourses } = useAdminContext();
  const { addStudentGrade, getStudentCourseGrades, courseGrades } = useCourseContext();

  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [semester, setSemester] = useState('');
  const [grade, setGrade] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const gradePointMap = { A: 10, B: 9, C: 8, D: 7, E: 6, F: 0 };

  useEffect(() => {
    fetchAllStudents();
    fetchAllCourses();
  }, []);

  useEffect(() => {
    if (selectedStudentId) {
      getStudentCourseGrades(selectedStudentId);
      // console.log("Selected studentId:", selectedStudentId);
    }
  }, [selectedStudentId]);

  // Filter students based on search query
  const filteredStudents = students.filter(student =>
    student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.scholarId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addGrade = async () => {
    if (!selectedStudentId || !selectedCourseId || !semester || !grade) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      await addStudentGrade(selectedStudentId, {
        semester: parseInt(semester),
        courseId: selectedCourseId,
        grade,
      });

      // ✅ Re-fetch updated grades after adding
      await getStudentCourseGrades(selectedStudentId);

      toast.success('Grade added successfully');
      setSemester('');
      setGrade('');
      setSelectedCourseId('');
    } catch (error) {
      console.error('Error adding grade:', error);
      toast.error('Failed to add grade');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Grade Management</h1>

        <div className="space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search students by name or scholar ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Select Student</Label>
              <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent>
                  {filteredStudents.length > 0 && filteredStudents.map((s) => (
                    <SelectItem key={s._id} value={s._id}>
                      {s.fullName} ({s.scholarId})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {searchQuery && (
                <p className="text-sm text-gray-500">
                  {filteredStudents.length} student(s) found
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Select Course</Label>
              <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((c) => (
                    <SelectItem key={c._id} value={c._id}>
                      {c.title} ({c.courseCode})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Semester</Label>
              <Select value={semester} onValueChange={setSemester}>
                <SelectTrigger>
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <SelectItem key={sem} value={sem.toString()}>
                      Semester {sem}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Grade</Label>
              <Select value={grade} onValueChange={setGrade}>
                <SelectTrigger>
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(gradePointMap).map(([g, points]) => (
                    <SelectItem key={g} value={g}>
                      {g} ({points} pts)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={addGrade}
            disabled={!selectedStudentId || !selectedCourseId || !semester || !grade || loading}
            className="w-full"
          >
            {loading ? 'Adding Grade...' : 'Add Grade'}
          </Button>

          {selectedStudentId && courseGrades && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-4">Grades for Selected Student</h2>

              {courseGrades.results?.length === 0 ? (
                <p className="text-gray-500 italic">No grades available yet for this student.</p>
              ) : (
                courseGrades.results?.map((sem) => (
                  <div key={sem.semester} className="mb-6">
                    <h3 className="font-bold mb-2">Semester {sem.semester}</h3>
                    <p className="mb-2">
                      CGPA: <span className="font-medium">{sem.cgpa}</span>
                    </p>
                    <div className="space-y-1">
                      {sem.courses?.map((c, idx) => (
                        <div key={idx} className="flex justify-between p-2 bg-white rounded border">
                          <span>{c.course?.title || 'Course Not Found'}</span>
                          <Badge className={getGradeColor(c.grade)}>{c.grade}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
              {courseGrades.results?.length > 0 && (
                <p className="mt-4">
                  SGPA: <span className="font-bold text-blue-600">{courseGrades.currentSGPA}</span>
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GradeManagement;