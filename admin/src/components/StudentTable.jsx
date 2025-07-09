import { useState } from "react";

import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";

import { Trash2, Pencil } from "lucide-react";

import StudentModal from "./StudentModal";

const StudentTable = ({ students, onDelete, onEdit }) => {
  const [editStudent, setEditStudent] = useState(null);

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">All Students</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Scholar ID</TableHead>
            <TableHead>Name</TableHead>
            {/* <TableHead>Email</TableHead> */}
            <TableHead>Branch</TableHead>
            <TableHead>Semester</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.scholarId}>
              <TableCell>{student.scholarId}</TableCell>
              <TableCell>{student.fullName}</TableCell>
              {/* <TableCell>{student.email}</TableCell> */}
              <TableCell>{student.branch}</TableCell>
              <TableCell>{student.semester}</TableCell>
              <TableCell className="flex justify-end gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditStudent(student)}
                >
                  <Pencil className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onDelete(student.scholarId)}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Remove
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {editStudent && (
        <StudentModal
          open={true}
          onClose={() => setEditStudent(null)}
          initialData={editStudent}
          onSave={(updatedData) => {
            onEdit(editStudent.scholarId, updatedData);
            setEditStudent(null);
          }}
        />
      )}
    </div>
  );
};

export default StudentTable;
