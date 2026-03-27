import { createBrowserRouter } from "react-router";
import DashboardLayout from "./layouts/DashboardLayout";
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

export const router = createBrowserRouter([
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
]);