import { AdminPanelPage } from "../pages/AdminPanel";
import { createBrowserRouter, Link, Outlet } from "react-router-dom";
import { MyAccountPage } from "../pages/MyAccount";
import { LoginPage } from "../pages/Login";
import { RedirectPage } from "../pages/Redirect";
import { ProtectedRoute } from "../components/ProtectedRoute";

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
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "my-account",
        element: (
          <ProtectedRoute>
            <MyAccountPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin-panel",
        element: (
          <ProtectedRoute>
            <AdminPanelPage />
          </ProtectedRoute>
        ),
      }
    ],
  },
]);
