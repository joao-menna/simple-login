import { AdminPanelPage } from "../pages/AdminPanel";
import { createBrowserRouter } from "react-router";
import { MyAccountPage } from "../pages/MyAccount";
import { RedirectPage } from "../pages/Redirect";
import { LoginPage } from "../pages/Login";
import { DebugPage } from "../pages/Debug";

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
    path: "my-account",
    element: <MyAccountPage />,
  },
  {
    path: "admin-panel",
    element: <AdminPanelPage />,
  },
  {
    path: "debug",
    element: <DebugPage />,
  },
]);
