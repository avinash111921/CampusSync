import { Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm.jsx';
import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';
import DashboardContent from './pages/DashboardContent.jsx';
import CoursesContent from './pages/CoursesContent.jsx';
import GradesContent from './pages/GradesContent.jsx';
import ProfileContent from './components/ProfileContent.jsx';
import { useAuthContext } from './context/AuthContexts.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import ForgotPassword from './components/ForgotPassword.jsx'; // Updated import
import ResetPassword from './components/RestPassword.jsx';   // New import
import SignupForm from './components/SignupForm.jsx';

const App = () => {
  const { isLogin } = useAuthContext();


  if (!isLogin) {
    // Show auth routes if not logged in
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
      </div>
    );
  }

  // Main app routes (user is logged in)
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardContent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses"
              element={
                <ProtectedRoute>
                  <CoursesContent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/grades"
              element={
                <ProtectedRoute>
                  <GradesContent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfileContent />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;