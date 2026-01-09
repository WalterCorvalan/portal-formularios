import { useEffect, useState } from "react";
import api from "../services/api";

export default function SectorsPage() {
  const [sectors, setSectors] = useState([]);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const load = () =>
    api.get("/admin/sectors").then(res => setSectors(res.data));

  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    if (!name || !password) {
      alert("Completar nombre y password");
      return;
    }

    await api.post("/admin/sectors", { name, password });
    setName("");
    setPassword("");
    load();
  };

  const remove = async (sector) => {
    if (!confirm(`Eliminar sector "${sector.name}"?`)) return;

    try {
      await api.delete(`/admin/sectors/${sector.id}`);
      load();
    } catch (err) {
      alert(
        err.response?.data?.detail ||
        "No se pudo eliminar el sector"
      );
    }
  };

  return (
    <>
      <h1 className="text-2xl font-black mb-6">Sectores</h1>

      {/* CREAR SECTOR */}
      <div className="bg-white p-6 rounded-3xl shadow mb-8">
        <div className="flex gap-4 flex-col sm:flex-row">
          <input
            placeholder="Nombre"
            value={name}
            onChange={e => setName(e.target.value)}
            className="input"
          />
          <input
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="input"
          />
          <button onClick={create} className="btn-primary">
            Crear
          </button>
        </div>
      </div>

      {/* LISTADO */}
      <div className="grid gap-4">
        {sectors.map(s => (
          <div
            key={s.id}
            className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
          >
            <div>
              <div className="font-bold">{s.name}</div>
              <div className="text-xs text-slate-400">
                ID: {s.id}
              </div>
            </div>

            <button
              onClick={() => remove(s)}
              className="text-sm font-bold text-red-600 hover:text-red-800"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
