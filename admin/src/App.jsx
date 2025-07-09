import { LoginForm } from "./components/login-form";
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layout/DashboardLayout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import CourseManagement from "./pages/CourseManagement";
import StudentManagement from "./pages/StudentManagment"; // Fixed typo: StudentManagment -> StudentManagement
import { useAdminContext } from "./context/AdminContext";
import EnrollStudentPage from "./pages/EnrollStudent";
import GradeManagement from "./pages/CGPAmanagment.jsx";
function App() {
  const { isAdminLogin, token } = useAdminContext();

  // console.log("isAdminLogin", isAdminLogin);
  // console.log(token);

  return (
    <Routes>
      {/* Login route */}
      <Route
        path="/login"
        element={isAdminLogin && token ? <Navigate to="/dashboard" replace /> : <LoginForm />}
      />

      {/* Protected dashboard routes with consistent layout */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/students"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <StudentManagement />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/courses"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <CourseManagement />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/enrollCourse"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <EnrollStudentPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/cgpa"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <GradeManagement/>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Redirect root to appropriate page */}
      <Route 
        path="/" 
        element={<Navigate to={isAdminLogin && token ? "/dashboard" : "/login"} replace />} 
      />

      {/* Redirect everything else */}
      <Route 
        path="*" 
        element={<Navigate to={isAdminLogin && token ? "/dashboard" : "/login"} replace />} 
      />
    </Routes>
  );
}

export default App;