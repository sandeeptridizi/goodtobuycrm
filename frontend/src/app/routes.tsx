import { createBrowserRouter, Navigate, Outlet } from "react-router";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import DashboardLayout from "./layouts/DashboardLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Properties from "./pages/Properties";
import CreateProperty from "./pages/CreateProperty";
import ViewProperty from "./pages/ViewProperty";
import Buyers from "./pages/Buyers";
import ViewBuyer from "./pages/ViewBuyer";
import Sellers from "./pages/Sellers";
import ViewSeller from "./pages/ViewSeller";
import Enquiries from "./pages/Enquiries";
import Employees from "./pages/Employees";
import ViewEmployee from "./pages/ViewEmployee";

function RequireAuth() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#004274] to-[#002847]">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    window.location.href = "/login";
    return null;
  }

  return <Outlet />;
}

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    element: <RequireAuth />,
    children: [
      {
        path: "/",
        Component: DashboardLayout,
        children: [
          { index: true, Component: Dashboard },
          { path: "properties", Component: Properties },
          { path: "properties/create", Component: CreateProperty },
          { path: "properties/:id", Component: ViewProperty },
          { path: "buyers", Component: Buyers },
          { path: "buyers/:id", Component: ViewBuyer },
          { path: "sellers", Component: Sellers },
          { path: "sellers/:id", Component: ViewSeller },
          { path: "enquiries", Component: Enquiries },
          { path: "employees", Component: Employees },
          { path: "employees/:id", Component: ViewEmployee },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

export { AuthProvider };
