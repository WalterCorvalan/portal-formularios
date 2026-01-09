import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function Dashboard() {
  const [forms, setForms] = useState([]);
  const navigate = useNavigate();
  const sectorName = localStorage.getItem("sectorName");

  useEffect(() => {
    api
      .get("/forms")
      .then((res) => setForms(res.data))
      .catch(() => {
        localStorage.clear();
        navigate("/login");
      });
  }, [navigate]);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b shadow-sm px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-black text-slate-800">
            Panel · {sectorName}
          </h1>
          <p className="text-sm text-slate-500">Formularios disponibles</p>
        </div>

        <button
          onClick={logout}
          className="text-sm font-bold text-slate-500 hover:text-red-600 transition"
        >
          Cerrar sesión
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 p-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {forms.map((form) => (
            <div
              key={form.id}
              onClick={() => navigate(`/form/${form.id}`)}
              className="group cursor-pointer bg-blue-200 rounded-2xl p-6 shadow-md
                 hover:shadow-2xl hover:-translate-y-1 transition-all
                 border border-slate-100"
            >
              <div className="flex items-start justify-between">
                <div
                  className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center
                        text-indigo-500 font-black text-xl"
                >
                  📄
                </div>
              </div>

              <h2 className="mt-6 font-black text-lg text-slate-800 group-hover:text-indigo-700 transition">
                {form.name}
              </h2>

              <p className="text-sm text-slate-500 mt-2">
                Click para abrir el formulario
              </p>

              <div className="mt-6 text-xs font-bold text-indigo-500 flex items-center gap-1">
                Abrir
                <span className="group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
