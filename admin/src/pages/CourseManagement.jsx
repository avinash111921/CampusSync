import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminContext } from "../context/AdminContext";
import { useStudentContext } from "@/context/StudentContext";
import CourseTable from "../components/CourseTable";
import CourseModal from "../components/CourseModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, BookOpen, Search, Filter, TrendingUp } from "lucide-react";

export function CourseManagement() {
  const {
    fetchAllCourses,
    courses,
    totalCourses,
    courseCurrentPage,
    courseTotalPages,
    setCourseCurrentPage,
    createCourse,
    removeCourse,
  } = useAdminContext();

  const { updateCourse } = useStudentContext();

  const [openCourseModal, setOpenCourseModal] = useState(false);
  const [editCourseData, setEditCourseData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchAllCourses(courseCurrentPage);
  }, [courseCurrentPage, fetchAllCourses]);

  const handleAddCourse = async (courseData) => {
    try {
      if (editCourseData?._id) {
        await updateCourse(editCourseData._id, courseData);
      } else {
        await createCourse(courseData);
      }
      await fetchAllCourses(courseCurrentPage);
      setEditCourseData(null);
      setOpenCourseModal(false);
    } catch (error) {
      console.error("Error saving course:", error);
    }
  };

  const handleEditCourse = (id, data) => {
    setEditCourseData({ _id: id, ...data });
    setOpenCourseModal(true);
  };

  const handleDeleteCourse = async (id) => {
    try {
      await removeCourse(id);
      await fetchAllCourses(courseCurrentPage);
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  // Safe filtering with null checks
  const filteredCourses = courses?.filter(course =>
    course?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course?.courseCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(course?.semester).toLowerCase().includes(searchTerm.toLowerCase()) ||
    course?.branch?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Calculate stats with safe checks
  const activeCourses = courses?.filter(course => course?.status === 'active').length || 0;
  const totalEnrollments = courses?.reduce((sum, course) => sum + (course?.enrolledStudents || 0), 0) || 0;
  const avgEnrollment = totalCourses > 0 ? Math.round(totalEnrollments / totalCourses) : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Course Management</h1>
        <p className="text-muted-foreground">
          Manage all courses, curriculum, and academic programs.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCourses || 0}</div>
            <p className="text-xs text-muted-foreground">
              Available courses
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Actions Bar */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
            <Button
              onClick={() => {
                setEditCourseData(null);
                setOpenCourseModal(true);
              }}
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Course
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Courses Table */}
      <Card>
        <CardHeader>
          <CardTitle>Courses List</CardTitle>
          <p className="text-sm text-muted-foreground">
            {filteredCourses.length} of {totalCourses || 0} courses
          </p>
        </CardHeader>
        <CardContent>
          {filteredCourses.length > 0 ? (
            <CourseTable
              courses={filteredCourses}
              onEdit={handleEditCourse}
              onDelete={handleDeleteCourse}
            />
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? "No courses found matching your search." : "No courses available."}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {courseTotalPages > 1 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-center items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCourseCurrentPage(Math.max(1, courseCurrentPage - 1))}
                disabled={courseCurrentPage === 1}
              >
                Previous
              </Button>
              
              <div className="flex gap-2">
                {Array.from({ length: courseTotalPages }, (_, i) => (
                  <Button
                    key={i + 1}
                    variant={courseCurrentPage === i + 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCourseCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCourseCurrentPage(Math.min(courseTotalPages, courseCurrentPage + 1))}
                disabled={courseCurrentPage === courseTotalPages}
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Course Modal */}
      <CourseModal
        open={openCourseModal}
        onClose={() => {
          setOpenCourseModal(false);
          setEditCourseData(null);
        }}
        onSave={handleAddCourse}
        initialData={editCourseData}
      />
    </div>
  );
}

export default CourseManagement;