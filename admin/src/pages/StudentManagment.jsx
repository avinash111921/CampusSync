import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminContext } from "../context/AdminContext";
import { useStudentContext } from "@/context/StudentContext";
import StudentTable from "../components/StudentTable";
import StudentModal from "../components/StudentModal";
import { Button } from "@/components/ui/button";
import { PlusCircle, Users, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";

export function StudentManagement() {
  const {
    fetchAllStudents,
    students,
    totalStudents,
    studentCurrentPage,
    studentTotalPages,
    setStudentCurrentPage,
    createStudent,
    removeStudent,
  } = useAdminContext();

  const { updateStudentProfile } = useStudentContext();

  const [openStudentModal, setOpenStudentModal] = useState(false);
  const [editStudentData, setEditStudentData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchAllStudents(studentCurrentPage);
  }, [studentCurrentPage]);

  const handleAddStudent = async (studentData) => {
    if (editStudentData?._id) {
      await updateStudentProfile(editStudentData.scholarId, studentData);
    } else {
      await createStudent(studentData);
    }
    await fetchAllStudents(studentCurrentPage);
    setEditStudentData(null);
    setOpenStudentModal(false);
  };

  const handleEditStudent = (id, data) => {
    setEditStudentData({ _id: id, ...data });
    setOpenStudentModal(true);
  };

  const handleDeleteStudent = async (id) => {
    await removeStudent(id);
    await fetchAllStudents(studentCurrentPage);
  };

  const filteredStudents = students.filter(student =>
    student.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.scholarId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Student Management</h1>
        <p className="text-muted-foreground">
          Manage all student records, profiles, and information.
        </p>
      </div>

      {/* Stats Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalStudents}</div>
          <p className="text-xs text-muted-foreground">
            Active students in the system
          </p>
        </CardContent>
      </Card>

      {/* Actions Bar */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students by scholarId..."
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
                setEditStudentData(null);
                setOpenStudentModal(true);
              }}
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Student
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>Students List</CardTitle>
          <p className="text-sm text-muted-foreground">
            {filteredStudents.length} of {totalStudents} students
          </p>
        </CardHeader>
        <CardContent>
          <StudentTable
            students={filteredStudents}
            onEdit={handleEditStudent}
            onDelete={handleDeleteStudent}
          />
        </CardContent>
      </Card>

      {studentTotalPages > 1 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-center items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setStudentCurrentPage(Math.max(1, studentCurrentPage - 1))}
                disabled={studentCurrentPage === 1}
              >
                Previous
              </Button>
              
              <div className="flex gap-2">
                {Array.from({ length: studentTotalPages }, (_, i) => (
                  <Button
                    key={i + 1}
                    variant={studentCurrentPage === i + 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStudentCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setStudentCurrentPage(Math.min(studentTotalPages, studentCurrentPage + 1))}
                disabled={studentCurrentPage === studentTotalPages}
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Student Modal */}
      <StudentModal
        open={openStudentModal}
        onClose={() => {
          setOpenStudentModal(false);
          setEditStudentData(null);
        }}
        onSave={handleAddStudent}
        initialData={editStudentData}
      />
    </div>
  );
}

export default StudentManagement;