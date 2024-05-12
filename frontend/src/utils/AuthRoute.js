import { getToken } from "./token";
import { Navigate } from "react-router-dom";

function AuthRoute({ children }) {
  const token = getToken();
  if (!token) {
    return <Navigate to="/Login" replace />;
  }
  return <>{children}</>; // Render the children components
}

export default AuthRoute;
