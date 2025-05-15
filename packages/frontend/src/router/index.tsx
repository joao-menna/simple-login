import { createBrowserRouter } from "react-router-dom";
import { DashboardPage } from "../pages/Dashboard";
import { RedirectPage } from "../pages/Redirect";
import { RegisterPage } from "../pages/Register";
import { LoginPage } from "../pages/Login";

export const router = createBrowserRouter([
  {
    path: "*",
    element: <RedirectPage />,
  },
  {
    path: "login",
    element: <LoginPage />,
  },
  {
    path: "register",
    element: <RegisterPage />,
  },
  {
    path: "dashboard",
    element: <DashboardPage />,
  },
]);
