import { useEffect, useState } from "react";
import api from "../../services/api";

export default function FormsPage() {
  const [forms, setForms] = useState([]);
  const [sectors, setSectors] = useState([]);

  const [name, setName] = useState("");
  const [embedUrl, setEmbedUrl] = useState("");

  const [selectedSector, setSelectedSector] = useState({});

  const loadAll = async () => {
    const [f, s] = await Promise.all([
      api.get("/admin/forms"),
      api.get("/admin/sectors")
    ]);
    setForms(f.data);
    setSectors(s.data);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const createForm = async () => {
    if (!name || !embedUrl) return alert("Completar datos");
    await api.post("/admin/forms", {
      name,
      embed_url: embedUrl
    });
    setName("");
    setEmbedUrl("");
    loadAll();
  };

  const assign = async (formId) => {
    const sectorId = selectedSector[formId];
    if (!sectorId) return alert("Elegí un sector");

    await api.post(`/admin/forms/${formId}/assign/${sectorId}`);
    alert("Asignado");
  };

  return (
    <div className="space-y-10">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-black">Formularios</h1>
        <p className="text-slate-500">Gestión y asignación</p>
      </div>

      {/* CREATE FORM */}
      <div className="bg-white p-6 rounded-3xl shadow space-y-4">
        <h2 className="font-bold">Nuevo formulario</h2>

        <div className="grid gap-4 md:grid-cols-3">
          <input
            placeholder="Nombre"
            className="input"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <input
            placeholder="Embed URL"
            className="input"
            value={embedUrl}
            onChange={e => setEmbedUrl(e.target.value)}
          />
          <button onClick={createForm} className="btn-primary">
            Crear
          </button>
        </div>
      </div>

      {/* LIST */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {forms.map(f => (
          <div
            key={f.id}
            className="bg-white rounded-2xl shadow p-6 flex flex-col gap-4"
          >
            <div>
              <h3 className="font-black text-lg truncate">{f.name}</h3>
              <p className="text-xs text-slate-400 truncate">
                {f.embed_url}
              </p>
            </div>

            <div className="flex gap-2">
              <select
                className="input flex-1"
                value={selectedSector[f.id] || ""}
                onChange={e =>
                  setSelectedSector({
                    ...selectedSector,
                    [f.id]: e.target.value
                  })
                }
              >
                <option value="">Asignar a sector</option>
                {sectors.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>

              <button
                onClick={() => assign(f.id)}
                className="btn-secondary"
              >
                OK
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
