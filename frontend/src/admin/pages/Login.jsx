import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("sector"); // sector | admin
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      alert("Completá los datos");
      return;
    }

    setLoading(true);

    try {
      if (mode === "admin") {
        const res = await api.post("/admin/login", {
          username,
          password,
        });

        localStorage.setItem("adminToken", res.data.token);
        navigate("/admin/forms");
      } else {
        const res = await api.post("/login", {
          username,
          password,
        });

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("sectorName", username);
        navigate("/dashboard");
      }
    } catch {
      alert("Credenciales incorrectas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 border border-slate-100 space-y-6">

        <div className="text-center">
          <h2 className="text-3xl font-black text-slate-900">
            Portal de Acceso
          </h2>
          <p className="text-slate-500 mt-2">
            Seleccioná tu tipo de ingreso
          </p>
        </div>

        {/* SELECTOR DE ROL */}
        <div className="flex gap-2">
          <button
            onClick={() => setMode("sector")}
            className={`flex-1 py-3 rounded-xl font-bold ${
              mode === "sector"
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            Sector
          </button>

          <button
            onClick={() => setMode("admin")}
            className={`flex-1 py-3 rounded-xl font-bold ${
              mode === "admin"
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            Admin
          </button>
        </div>

        {/* INPUTS */}
        <div className="space-y-4">
          <input
            placeholder="Usuario"
            className="input"
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="input"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="btn-primary w-full"
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </div>
    </div>
  );
}
