import { Outlet, useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen flex bg-slate-100">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-white shadow-xl hidden md:flex flex-col">
        <div className="p-6 font-black text-lg text-indigo-600">
          Admin Panel
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <button
            onClick={() => navigate("/admin/sectors")}
            className="btn-admin"
          >
            Sectores
          </button>

          <button
            onClick={() => navigate("/admin/forms")}
            className="btn-admin"
          >
            Formularios
          </button>
        </nav>

        <button
          onClick={logout}
          className="m-4 text-sm text-red-500 font-bold"
        >
          Cerrar sesión
        </button>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
