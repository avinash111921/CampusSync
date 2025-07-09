import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Updated form fields with Admission Year
const formFields = [
  {
    label: "Scholar ID",
    name: "scholarId",
    type: "text",
    pattern: "^[0-9]{6,12}$",
    placeholder: "e.g., 2023001",
  },
  {
    label: "Full Name",
    name: "fullName",
    type: "text",
    minLength: 3,
    placeholder: "e.g., John Doe",
  },
  {
    label: "Branch",
    name: "branch",
    type: "text",
    placeholder: "e.g., CSE, ECE",
  },
  {
    label: "Semester",
    name: "semester",
    type: "number",
    min: 1,
    max: 8,
    placeholder: "1-8",
  },
  {
    label: "Admission Year",
    name: "admissionYear",
    type: "number",
    min: 2000,
    max: 2099,
    placeholder: "e.g., 2023",
  },
];

// Include admissionYear in initialState
const initialState = {
  scholarId: "",
  fullName: "",
  branch: "",
  semester: "",
  admissionYear: "",
};

const StudentModal = ({ open, onClose, onSave, initialData = null }) => {
  const [studentData, setStudentData] = useState(initialState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setStudentData({
        ...initialState,
        ...initialData,
      });
      setErrors({});
    }
  }, [open, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudentData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const { scholarId, fullName, branch, semester, admissionYear } = studentData;

    if (!scholarId.trim()) {
      newErrors.scholarId = "Scholar ID is required";
    } else if (!/^[0-9]{6,12}$/.test(scholarId)) {
      newErrors.scholarId = "Scholar ID must be 6-12 digits";
    }

    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (fullName.trim().length < 3) {
      newErrors.fullName = "Name must be at least 3 characters";
    }

    if (!branch.trim()) {
      newErrors.branch = "Branch is required";
    }

    if (!semester) {
      newErrors.semester = "Semester is required";
    } else if (isNaN(semester) || semester < 1 || semester > 8) {
      newErrors.semester = "Semester must be between 1 and 8";
    }

    if (!admissionYear) {
      newErrors.admissionYear = "Admission year is required";
    } else if (isNaN(admissionYear) || admissionYear < 2000 || admissionYear > 2099) {
      newErrors.admissionYear = "Admission year must be between 2000 and 2099";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(studentData);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {initialData?.scholarId ? "Edit Student" : "Add Student"}
            </DialogTitle>
            <DialogDescription>
              {initialData?.scholarId
                ? "Modify student information below and save changes."
                : "Fill in the student details to add a new record."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {formFields.map(({ label, name, type = "text", ...props }) => (
              <div key={name} className="grid gap-1">
                <div className="flex items-center justify-between">
                  <Label htmlFor={name}>{label}</Label>
                  {errors[name] && (
                    <span className="text-xs text-red-500">{errors[name]}</span>
                  )}
                </div>
                <Input
                  id={name}
                  name={name}
                  type={type}
                  value={studentData[name]}
                  onChange={handleChange}
                  disabled={
                    (name === "scholarId" && !!initialData?.scholarId) ||
                    (name === "admissionYear" && !!initialData?.scholarId)
                  }
                  className={cn(errors[name] && "border-red-500")}
                  {...props}
                />
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {initialData?.scholarId ? "Update Student" : "Create Student"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default StudentModal;
