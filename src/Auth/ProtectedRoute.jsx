import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("username"); // Check if user is logged in

  return isAuthenticated ? children : <Navigate to="/" replace />; // Redirect to login if not authenticated
};

export default ProtectedRoute;
