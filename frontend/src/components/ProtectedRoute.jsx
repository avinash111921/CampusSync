import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContexts";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuthContext();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;