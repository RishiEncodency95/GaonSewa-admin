import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Hero from "./pages/home/Hero";
import Login from "./pages/Login";
import Companies from "./pages/superAdmin/Companies";
import Branches from "./pages/superAdmin/Branches";
import AddRole from "./pages/superAdmin/AddRole";
import AddSidebar from "./pages/add_by_admin/AddSidebar";
import RoleRights from "./pages/add_by_admin/role_rights/RoleRights";
import AddUser from "./pages/users/AddUser";
import UsersList from "./pages/users/UsersList";


const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <BrowserRouter>
      {/* Global Toaster Container */}
      <Toaster richColors position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/hero" element={<Hero />} />
                  {/* ── Super Admin / Admin Routes ── */}
                  <Route path="/companies" element={<Companies />} />
                  <Route path="/branches" element={<Branches />} />
                  <Route path="/roles" element={<AddRole />} />
                  <Route path="/roleRights" element={<RoleRights />} />
                  <Route path="/addSidebar" element={<AddSidebar />} />
                  <Route path="/usersList" element={<UsersList />} />
                  <Route path="/addUser" element={<AddUser />} />
                  <Route path="*" element={<div className="p-6 text-2xl font-bold text-red-500">404 - Page Not Found</div>} />
                </Routes>
              </AdminLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
