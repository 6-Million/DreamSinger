import SignUp from "../Views/SignUp";
//import Profile from "./Views/Profile";
import Login from "../Views/Login";
import NotFound from "../Views/NotFound";
import First from "../Views/first";

import { createBrowserRouter } from "react-router-dom";
import AuthRoute from "../utils/AuthRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthRoute>
        <First />
      </AuthRoute>
    ),
  },
  {
    path: "/Login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
