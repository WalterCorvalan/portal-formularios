import { Outlet, useNavigate } from "react-router-dom";

export default function AdminLayout() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r hidden md:flex flex-col">
        <div className="h-20 flex items-center justify-center font-black text-indigo-600 text-xl">
          Admin Panel
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <button
            onClick={() => navigate("/admin/forms")}
            className="w-full text-left px-4 py-3 rounded-xl font-semibold hover:bg-indigo-50"
          >
            Formularios
          </button>
        </nav>

        <button
          onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}
          className="m-4 text-sm font-bold text-red-500"
        >
          Cerrar sesión
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 md:p-10">
        <Outlet />
      </main>
    </div>
  );
}
