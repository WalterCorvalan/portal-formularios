import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function Login() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await api.post("/login", {
        username: user,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("sectorName", user);

      // 👇 DECISIÓN DE NEGOCIO
      if (user === "admin") {
        navigate("/admin/forms");
      } else {
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
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 border border-slate-100">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-slate-900">Óptica Portal</h2>
          <p className="text-slate-500 mt-2">Ingreso por sector</p>
        </div>
        <div className="space-y-5">
          <input
            className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-500 outline-none transition-all"
            placeholder="Sector"
            onChange={(e) => setUser(e.target.value)}
          />
          <input
            type="password"
            className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-500 outline-none transition-all"
            placeholder="Contraseña"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg active:scale-95 transition-all"
          >
            {loading ? "Entrando..." : "Entrar al Sistema"}
          </button>
        </div>
      </div>
    </div>
  );
}
