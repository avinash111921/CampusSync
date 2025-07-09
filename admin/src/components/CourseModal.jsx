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

const formFields = [
    {
      label: "Course Code",
      name: "courseCode",
      type: "text",
      placeholder: "e.g., CS101",
    },
    {
      label: "Title",
      name: "title",
      type: "text",
      placeholder: "e.g., Data Structures",
    },
    {
      label: "Credits",
      name: "credits",
      type: "number",
      min: 1,
      max: 10,
      placeholder: "1-10",
    },
    {
      label: "Branch",
      name: "branch",
      type: "text",
      placeholder: "e.g., CSE",
    },
    {
      label: "Semester",
      name: "semester",
      type: "number",
      min: 1,
      max: 8,
      placeholder: "1-8",
    },
  ];
  
const initialState = {
  courseCode: "",
  title: "",
  credits: "",
  branch: "",
  semester: "",
};

const CourseModal = ({ open, onClose, onSave, initialData = null }) => {

  const [courseData, setCourseData] = useState(initialState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setCourseData({
        ...initialState,
        ...initialData,
      });
      setErrors({});
    }
  }, [open, initialData]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const { courseCode, title, credits, branch, semester } = courseData;

    if (!courseCode.trim()) {
        newErrors.courseCode = "Course code is required";
    } else if (!/^[A-Z0-9]{3,10}$/i.test(courseCode)) {
        newErrors.courseCode = "Invalid course code format";
    }

    if (!title.trim()) {
        newErrors.title = "Title is required";
    }

    const creditNum = Number(credits);
    if (!credits || isNaN(creditNum) || creditNum < 1 || creditNum > 10) {
        newErrors.credits = "Credits must be between 1 and 10";
    }

    if (!branch.trim()) {
        newErrors.branch = "Branch is required";
    }

    const sem = Number(semester);
    if (!semester || isNaN(sem) || sem < 1 || sem > 8) {
        newErrors.semester = "Semester must be between 1 and 8";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
};

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave({ ...courseData, _id: initialData?._id });
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{initialData?._id ? "Edit Course" : "Add Course"}</DialogTitle>
            <DialogDescription>
              {initialData?._id
                ? "Modify course information and save changes."
                : "Fill in the course details to create a new record."}
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
                  value={courseData[name]}
                  onChange={handleChange}
                  // disabled={name === "courseCode" && !!initialData?._id}
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
              {initialData?._id ? "Update Course" : "Create Course"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CourseModal;
