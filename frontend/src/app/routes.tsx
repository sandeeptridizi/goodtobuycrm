import { createBrowserRouter, Navigate, Outlet } from "react-router";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import DashboardLayout from "./layouts/DashboardLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Properties from "./pages/Properties";
import CreateProperty from "./pages/CreateProperty";
import EditProperty from "./pages/EditProperty";
import ViewProperty from "./pages/ViewProperty";
import Buyers from "./pages/Buyers";
import CreateBuyer from "./pages/CreateBuyer";
import EditBuyer from "./pages/EditBuyer";
import ViewBuyer from "./pages/ViewBuyer";
import Sellers from "./pages/Sellers";
import CreateSeller from "./pages/CreateSeller";
import EditSeller from "./pages/EditSeller";
import ViewSeller from "./pages/ViewSeller";
import Enquiries from "./pages/Enquiries";
import ViewEnquiry from "./pages/ViewEnquiry";
import EditEnquiry from "./pages/EditEnquiry";
import Employees from "./pages/Employees";
import CreateEmployee from "./pages/CreateEmployee";
import EditEmployee from "./pages/EditEmployee";
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
          { path: "properties/:id/edit", Component: EditProperty },
          { path: "properties/:id", Component: ViewProperty },
          { path: "buyers", Component: Buyers },
          { path: "buyers/create", Component: CreateBuyer },
          { path: "buyers/:id/edit", Component: EditBuyer },
          { path: "buyers/:id", Component: ViewBuyer },
          { path: "sellers", Component: Sellers },
          { path: "sellers/create", Component: CreateSeller },
          { path: "sellers/:id/edit", Component: EditSeller },
          { path: "sellers/:id", Component: ViewSeller },
          { path: "enquiries", Component: Enquiries },
          { path: "enquiries/:id", Component: ViewEnquiry },
          { path: "enquiries/:id/edit", Component: EditEnquiry },
          { path: "employees", Component: Employees },
          { path: "employees/create", Component: CreateEmployee },
          { path: "employees/:id", Component: ViewEmployee },
          { path: "employees/:id/edit", Component: EditEmployee },
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
