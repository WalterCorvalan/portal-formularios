import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    try {
      const res = await api.post("/admin/login", { username, password });
      localStorage.setItem("adminToken", res.data.token);
      navigate("/admin");
    } catch {
      alert("Credenciales inválidas");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-sm">
        <h1 className="text-2xl font-black text-center mb-6">
          Admin Panel
        </h1>

        <input
          placeholder="Usuario"
          className="w-full mb-4 p-4 rounded-xl bg-slate-50"
          onChange={e => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          className="w-full mb-6 p-4 rounded-xl bg-slate-50"
          onChange={e => setPassword(e.target.value)}
        />

        <button
          onClick={login}
          className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl"
        >
          Entrar
        </button>
      </div>
    </div>
  );
}
