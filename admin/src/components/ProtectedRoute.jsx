import { Navigate } from "react-router-dom";
import { useAdminContext } from "../context/AdminContext.jsx";

const ProtectedRoute = ({ children }) => {
  const { isAdminLogin } = useAdminContext();

  if (!isAdminLogin) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;