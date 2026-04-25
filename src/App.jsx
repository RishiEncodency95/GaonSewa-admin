import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import AdminLayout from "./layouts/AdminLayout";

import Dashboard from "./pages/Dashboard";
import Passengers from "./pages/Passengers";
import Partners from "./pages/Partners";
import Hero from "./pages/home/Hero";
import Login from "./pages/Login";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Companies from "./pages/superAdmin/Companies";
import Branches from "./pages/superAdmin/Branches";
import UserList from "./pages/UserList";

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
                  <Route path="/passengers" element={<Passengers />} />
                  <Route path="/drivers/partners" element={<Partners />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/orders" element={<Orders />} />

                  {/* ── Super Admin / Admin Routes ── */}
                  <Route path="/companies" element={<Companies />} />
                  <Route path="/branches" element={<Branches />} />
                  <Route path="/roles" element={<div className="p-6 text-xl">Roles Page (Coming Soon)</div>} />
                  <Route path="/addOccupation" element={<div className="p-6 text-xl">Add Occupation (Coming Soon)</div>} />
                  <Route path="/addUser" element={<div className="p-6 text-xl">Add User (Coming Soon)</div>} />
                  <Route path="/userList" element={<UserList />} />
                  <Route path="/addBlog" element={<div className="p-6 text-xl">Add Blog (Coming Soon)</div>} />
                  <Route path="/blogList" element={<div className="p-6 text-xl">Blog List (Coming Soon)</div>} />
                  <Route path="/faq" element={<div className="p-6 text-xl">FAQ (Coming Soon)</div>} />

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
