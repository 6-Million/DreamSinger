import { getToken } from "./token";
import { Navigate } from "react-router-dom";
//路由，token验证，没有token则跳转到登录页面
function AuthRoute({ children }) {
  const token = getToken();
  if (!token) {
    return <Navigate to="/Login" replace />;
  }
  return <>{children}</>; // Render the children components
}

export default AuthRoute;
