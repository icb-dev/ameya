import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./admin/components/ProtectedRoute";
import Login from "./admin/pages/Login";
import AdminHome from "./admin/pages/AdminHome";
import CommercialProject from "./admin/pages/CommercialProject";
import ResidentialProject from "./admin/pages/ResidentialProject";
import AllProjects from "./admin/pages/AllProjects";
import EditProject from "./admin/pages/EditProject";
import ChangePassword from "./admin/pages/ChangePassword";
import Home from "./admin/pages/Home";
import About from "./admin/pages/About";
import Blogs from "./admin/pages/Blogs";
import NewBlog from "./admin/pages/NewBlog";
import EditBlog from "./admin/pages/EditBlog";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/projects"
          element={
            <ProtectedRoute>
              <AllProjects />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/projects/:projectId/edit"
          element={
            <ProtectedRoute>
              <EditProject />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/commercial"
          element={
            <ProtectedRoute>
              <CommercialProject />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/residential"
          element={
            <ProtectedRoute>
              <ResidentialProject />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/change-password"
          element={
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/about"
          element={
            <ProtectedRoute>
              <About />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/blogs"
          element={
            <ProtectedRoute>
              <Blogs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/blogs/new"
          element={
            <ProtectedRoute>
              <NewBlog />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/blogs/:id/edit"
          element={
            <ProtectedRoute>
              <EditBlog />
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route
          path="*"
          element={<Navigate to="/admin" />}
        />
      </Routes>
    </AuthProvider>
  );
}
