// src/App.jsx
import { useState, useEffect } from "react";

export default function App() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(null);
  const [forms, setForms] = useState([]);

  const login = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, password }),
      });

      if (!res.ok) throw new Error("Credenciales inválidas");

      const data = await res.json();
      setToken(data.token);
    } catch (err) {
      console.error(err.message);
      alert("Login fallido");
    }
  };

  useEffect(() => {
    if (!token) return;

    const fetchForms = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/forms", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Error fetching forms");

        const data = await res.json();
        setForms(data);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchForms();
  }, [token]);

  if (!token)
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Login</h1>
        <input
          placeholder="Usuario"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          className="border p-2 mb-2 w-full"
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 mb-2 w-full"
        />
        <button
          onClick={login}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Entrar
        </button>
      </div>
    );

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Forms disponibles</h1>
      {forms.length === 0 && <p>No hay formularios asignados.</p>}
      <ul>
        {forms.map((form) => (
          <li key={form.id} className="mb-4">
            <h2 className="font-semibold">{form.name}</h2>
            <iframe
              src={form.embed_url}
              className="w-full h-96 border"
              title={form.name}
            ></iframe>
          </li>
        ))}
      </ul>
    </div>
  );
}
