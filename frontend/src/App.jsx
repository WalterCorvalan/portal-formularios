import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./admin/pages/Login";
import Dashboard from "./admin/pages/Dashboard";
import FormViewer from "./admin/pages/FormViewer";
import AdminDashboard from "./admin/AdminDashboard";
import AdminForms from "./admin/pages/AdminForms";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/form/:id" element={<FormViewer />} />

        {/* ADMIN */}
        <Route path="/admin" element={<AdminDashboard />}>
          <Route path="forms" element={<AdminForms />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}
