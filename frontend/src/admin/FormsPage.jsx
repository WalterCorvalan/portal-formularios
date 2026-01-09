import { useEffect, useState } from "react";
import api from "../services/api";

export default function FormsPage() {
  const [forms, setForms] = useState([]);
  const [sectors, setSectors] = useState([]);

  const [name, setName] = useState("");
  const [embedUrl, setEmbedUrl] = useState("");

  const [selectedSector, setSelectedSector] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmbed, setEditEmbed] = useState("");

  const loadAll = async () => {
    const [f, s] = await Promise.all([
      api.get("/admin/forms"),
      api.get("/admin/sectors"),
    ]);
    setForms(f.data);
    setSectors(s.data);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const createForm = async () => {
    if (!name || !embedUrl) return;
    await api.post("/admin/forms", {
      name,
      embed_url: embedUrl,
    });
    setName("");
    setEmbedUrl("");
    loadAll();
  };

  const assign = async (formId) => {
    const sectorId = selectedSector[formId];
    if (!sectorId) return;
    await api.post(`/admin/forms/${formId}/assign/${sectorId}`);
    setSelectedSector({ ...selectedSector, [formId]: "" });
    loadAll();
  };

  const unassign = async (formId, sectorId) => {
    await api.delete(`/admin/forms/${formId}/assign/${sectorId}`);
    loadAll();
  };

  const startEdit = (f) => {
    setEditingId(f.id);
    setEditName(f.name);
    setEditEmbed(f.embed_url);
  };

  const saveEdit = async (id) => {
    await api.put(`/admin/forms/${id}`, {
      name: editName,
      embed_url: editEmbed,
    });
    setEditingId(null);
    loadAll();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-black text-slate-800">📄 Formularios</h1>
        <p className="text-slate-500">
          Creación, edición y asignación por sector
        </p>
      </div>

      {/* CREATE FORM */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <h2 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
          ➕ Nuevo formulario
        </h2>

        <div className="grid gap-4 md:grid-cols-5">
          <div className="md:col-span-2">
            <label className="text-xs font-bold text-slate-500">
              Nombre
            </label>
            <input
              className="input mt-1"
              placeholder="Ej: Reclamos"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-bold text-slate-500">
              Embed URL
            </label>
            <input
              className="input mt-1"
              placeholder="https://noteforms.com/..."
              value={embedUrl}
              onChange={(e) => setEmbedUrl(e.target.value)}
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={createForm}
              className="btn-primary w-full h-11 text-sm"
            >
              Crear
            </button>
          </div>
        </div>
      </div>

      {/* GRID */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {forms.map((f) => {
          const assigned = sectors.filter((s) =>
            s.forms.some((sf) => sf.id === f.id)
          );

          const isEditing = editingId === f.id;

          return (
            <div
              key={f.id}
              className="bg-zinc-300 rounded-2xl shadow-sm p-5 flex flex-col gap-4"
            >
              {/* TITLE */}
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1">
                  {isEditing ? (
                    <>
                      <input
                        className="input"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                      />
                      <input
                        className="input mt-2"
                        value={editEmbed}
                        onChange={(e) => setEditEmbed(e.target.value)}
                      />
                    </>
                  ) : (
                    <>
                      <h3 className="font-black text-lg truncate">
                        {f.name}
                      </h3>
                      <p className="text-xs text-slate-400 truncate">
                        {f.embed_url}
                      </p>
                    </>
                  )}
                </div>

                {!isEditing && (
                  <button
                    onClick={() => startEdit(f)}
                    className="text-slate-800 text-sm font-bold hover:underline"
                  >
                    ✏️
                  </button>
                )}
              </div>

              {/* SECTORS */}
              <div>
                <div className="text-xs font-bold text-slate-500 mb-2">
                  Sectores
                </div>

                <div className="flex flex-wrap gap-2">
                  {assigned.length > 0 ? (
                    assigned.map((s) => (
                      <span
                        key={s.id}
                        className="flex items-center gap-1.5 bg-indigo-50 text-slate-800 px-2.5 py-0.5 rounded-full text-xs font-semibold"
                      >
                        {s.name}
                        <button
                          onClick={() => unassign(f.id, s.id)}
                          className="hover:text-red-500"
                        >
                          ✕
                        </button>
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-red-500 font-semibold">
                      Sin asignar
                    </span>
                  )}
                </div>
              </div>

              {/* ACTIONS */}
              {isEditing ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => saveEdit(f.id)}
                    className="btn-primary flex-1"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="btn-secondary"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <select
                    className="input flex-1"
                    value={selectedSector[f.id] || ""}
                    onChange={(e) =>
                      setSelectedSector({
                        ...selectedSector,
                        [f.id]: e.target.value,
                      })
                    }
                  >
                    <option value="">Asignar sector</option>
                    {sectors.map((s) => (
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
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
