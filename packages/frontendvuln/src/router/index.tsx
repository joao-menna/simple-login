import { AdminPanelPage } from "../pages/AdminPanel";
import { createBrowserRouter, Link, Outlet } from "react-router";
import { MyAccountPage } from "../pages/MyAccount";
import { LoginPage } from "../pages/Login";
import { DebugPage } from "../pages/Debug";
import { RedirectPage } from "../pages/Redirect";

function RootLayout() {
  return (
    <div>
      <nav className="bg-gray-800 text-white p-4">
        <div className="max-w-7xl mx-auto flex space-x-4">
          <Link to="/my-account" className="hover:text-gray-300">My Account</Link>
          <Link to="/admin-panel" className="hover:text-gray-300">Admin Panel</Link>
          <Link to="/debug" className="hover:text-gray-300">Debug</Link>
        </div>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RedirectPage />,
  },
  {
    path: "/",
    element: <RootLayout />,
    children: [

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
    ],
  },
  {
    path: "login",
    element: <LoginPage />,
  },
]);
