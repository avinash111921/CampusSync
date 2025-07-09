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
import ForgotPasswordForm from './components/ForgotPasswordForm.jsx';
import SignupForm from './components/SignupForm.jsx';

const App = () => {
  const { isLogin, isloading } = useAuthContext();

  if (isloading) {
    // Show loading screen while checking token and user
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600 text-lg animate-pulse">Loading...</p>
      </div>
    );
  }

  if (!isLogin) {
    // Show auth routes if not logged in
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route path="/forgot-password" element={<ForgotPasswordForm />} />
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
