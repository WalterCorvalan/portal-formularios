import { NavLink, Outlet, useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* NAVBAR */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* LEFT */}
          <div className="flex items-center gap-6">
            <h1 className="font-black text-lg text-slate-800">
              Admin Panel
            </h1>

            <nav className="flex gap-4">
              <NavLink
                to="/admin/forms"
                className={({ isActive }) =>
                  `text-sm font-bold ${
                    isActive
                      ? "text-slate-800"
                      : "text-slate-500 hover:text-indigo-700"
                  }`
                }
              >
                Formularios
              </NavLink>

              <NavLink
                to="/admin/sectors"
                className={({ isActive }) =>
                  `text-sm font-bold ${
                    isActive
                      ? "text-slate-800"
                      : "text-slate-500 hover:text-indigo-700"
                  }`
                }
              >
                Sectores
              </NavLink>
            </nav>
          </div>

          {/* RIGHT */}
          <button
            onClick={logout}
            className="text-sm font-bold text-slate-500 hover:text-red-600"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      {/* CONTENT */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
