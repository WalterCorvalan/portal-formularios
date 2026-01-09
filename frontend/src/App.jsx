import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

/* SECTOR */
import Login from "./admin/pages/Login";
import Dashboard from "./admin/pages/Dashboard";
import FormViewer from "./admin/pages/FormViewer";

/* ADMIN */
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import FormsPage from "./admin/FormsPage";
import SectorsPage from "./admin/SectorsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ===== SECTOR ===== */}
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/form/:id" element={<FormViewer />} />

        {/* ===== ADMIN ===== */}
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route path="/admin" element={<AdminDashboard />}>
          <Route index element={<Navigate to="sectors" />} />
          <Route path="sectors" element={<SectorsPage />} />
          <Route path="forms" element={<FormsPage />} />
        </Route>

        {/* ===== FALLBACK ===== */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}
