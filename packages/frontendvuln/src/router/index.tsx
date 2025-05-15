import { createBrowserRouter } from "react-router";
import { DashboardPage } from "../pages/Dashboard";
import { RedirectPage } from "../pages/Redirect";
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
    path: "dashboard",
    element: <DashboardPage />,
  },
]);
