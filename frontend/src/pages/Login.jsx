import { useState } from "react";
import api from "../services/api";

export default function Login() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    const res = await api.post("/login", {
      user,
      password,
    });
    localStorage.setItem("token", res.data.token);
    window.location.href = "/dashboard";
  };

  return (
    <div>
      <h2>Ingreso por sector</h2>
      <input placeholder="Sector" onChange={e => setUser(e.target.value)} />
      <input type="password" placeholder="Contraseña" onChange={e => setPassword(e.target.value)} />
      <button onClick={login}>Ingresar</button>
    </div>
  );
}
