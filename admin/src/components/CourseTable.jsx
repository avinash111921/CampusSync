import { useState } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil } from "lucide-react";
import CourseModal from "./CourseModal";

const CourseTable = ({ courses, onDelete, onEdit }) => {
  const [editCourse, setEditCourse] = useState(null);

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">All Courses</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Credits</TableHead>
            <TableHead>Branch</TableHead>
            <TableHead>Semester</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.map((course) => (
            <TableRow key={course._id}>
              <TableCell>{course.courseCode}</TableCell>
              <TableCell>{course.title}</TableCell>
              <TableCell>{course.credits}</TableCell>
              <TableCell>{course.branch}</TableCell>
              <TableCell>{course.semester}</TableCell>
              <TableCell className="flex justify-end gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditCourse(course)}
                >
                  <Pencil className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onDelete(course._id)}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Remove
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {editCourse && (
        <CourseModal
          open={true}
          onClose={() => setEditCourse(null)}
          initialData={editCourse}
          onSave={(updatedData) => {
            onEdit(editCourse._id, updatedData);
            setEditCourse(null);
          }}
        />
      )}
    </div>
  );
};

export default CourseTable;
