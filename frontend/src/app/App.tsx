import { RouterProvider } from "react-router";
import { router, AuthProvider } from "./routes";

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
