import { useEffect, useState } from "react";
import api from "../../services/api";

export default function SectorsPage() {
  const [sectors, setSectors] = useState([]);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const load = () =>
    api.get("/admin/sectors").then(res => setSectors(res.data));

  useEffect(load, []);

  const create = async () => {
    await api.post("/admin/sectors", { name, password });
    setName(""); setPassword("");
    load();
  };

  return (
    <>
      <h1 className="text-2xl font-black mb-6">Sectores</h1>

      <div className="bg-white p-6 rounded-3xl shadow mb-8">
        <div className="flex gap-4 flex-col sm:flex-row">
          <input placeholder="Nombre" value={name}
            onChange={e => setName(e.target.value)} className="input" />
          <input placeholder="Password" value={password}
            onChange={e => setPassword(e.target.value)} className="input" />
          <button onClick={create} className="btn-primary">
            Crear
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {sectors.map(s => (
          <div key={s.id} className="bg-white p-4 rounded-xl shadow">
            {s.name}
          </div>
        ))}
      </div>
    </>
  );
}
