import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminContext } from "../context/AdminContext";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, TrendingUp, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Dashboard() {
    const navigate = useNavigate();
  const {
    fetchAllStudents,
    fetchAllCourses,
    totalStudents,
    totalCourses,
    studentCurrentPage,
    courseCurrentPage,
  } = useAdminContext();

  useEffect(() => {
    fetchAllStudents(studentCurrentPage);
    fetchAllCourses(courseCurrentPage);
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your admin dashboard. Here's an overview of your system.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              Active students in system
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCourses}</div>
            <p className="text-xs text-muted-foreground">
              Available courses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enrollment Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalCourses > 0 ? Math.round((totalStudents / totalCourses) * 100) / 100 : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Students per course
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Date().toLocaleDateString('en-US', { month: 'long' })}
            </div>
            <p className="text-xs text-muted-foreground">
              Current period
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <p className="text-sm text-muted-foreground">
            Manage your students and courses efficiently
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="font-semibold">Student Management</h3>
              <div className="space-y-2">
                <Button onClick={() => navigate('/students')} variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  View All Students
                </Button>
                <Button onClick={() => navigate('/students')} variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Add New Student
                </Button>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold">Course Management</h3>
              <div className="space-y-2">
                <Button onClick={() => navigate('/courses')} variant="outline" className="w-full justify-start">
                  <BookOpen className="w-4 h-4 mr-2" />
                  View All Courses
                </Button>
                <Button onClick={() => navigate('/courses')} variant="outline" className="w-full justify-start">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Add New Course
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">System initialized</p>
                <p className="text-xs text-muted-foreground">Welcome to the admin dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">Ready for management</p>
                <p className="text-xs text-muted-foreground">Students and courses can be managed</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Dashboard;