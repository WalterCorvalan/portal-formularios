import { useEffect, useState } from "react";
import api from "../services/api";

export default function FormsPage() {
  const [forms, setForms] = useState([]);
  const [sectors, setSectors] = useState([]);

  const [name, setName] = useState("");
  const [embedUrl, setEmbedUrl] = useState("");

  const [selectedSector, setSelectedSector] = useState({});

  // 👇 edición
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
    if (!name || !embedUrl) return alert("Completar datos");

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
    if (!sectorId) return alert("Elegí un sector");

    await api.post(`/admin/forms/${formId}/assign/${sectorId}`);
    setSelectedSector({ ...selectedSector, [formId]: "" });
    loadAll();
  };

  const unassign = async (formId, sectorId) => {
    if (!confirm("¿Desasignar este formulario del sector?")) return;

    await api.delete(`/admin/forms/${formId}/assign/${sectorId}`);
    loadAll();
  };

  // ✏️ editar
  const startEdit = (f) => {
    setEditingId(f.id);
    setEditName(f.name);
    setEditEmbed(f.embed_url);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditEmbed("");
  };

  const saveEdit = async (id) => {
    if (!editName || !editEmbed) return alert("Datos incompletos");

    await api.put(`/admin/forms/${id}`, {
      name: editName,
      embed_url: editEmbed,
    });

    cancelEdit();
    loadAll();
  };

  return (
    <div className="space-y-10">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-black">Formularios</h1>
        <p className="text-slate-500">Gestión, asignación y edición</p>
      </div>

      {/* CREATE FORM */}
      <div className="bg-white p-6 rounded-3xl shadow space-y-4">
        <h2 className="font-bold">Nuevo formulario</h2>

        <div className="grid gap-4 md:grid-cols-3">
          <input
            placeholder="Nombre"
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            placeholder="Embed URL"
            className="input"
            value={embedUrl}
            onChange={(e) => setEmbedUrl(e.target.value)}
          />
          <button onClick={createForm} className="btn-primary">
            Crear
          </button>
        </div>
      </div>

      {/* LIST */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {forms.map((f) => {
          const assigned = sectors.filter((s) =>
            s.forms.some((sf) => sf.id === f.id)
          );

          const isEditing = editingId === f.id;

          return (
            <div
              key={f.id}
              className="bg-white rounded-2xl shadow p-6 flex flex-col gap-4"
            >
              {/* INFO / EDIT */}
              <div className="space-y-2">
                {isEditing ? (
                  <>
                    <input
                      className="input"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                    <input
                      className="input"
                      value={editEmbed}
                      onChange={(e) => setEditEmbed(e.target.value)}
                    />
                  </>
                ) : (
                  <>
                    <h3 className="font-black text-lg truncate">{f.name}</h3>
                    <p className="text-xs text-slate-400 truncate">
                      {f.embed_url}
                    </p>
                  </>
                )}
              </div>

              {/* ASSIGNED */}
              <div className="space-y-1">
                {assigned.length > 0 ? (
                  assigned.map((s) => (
                    <div
                      key={s.id}
                      className="flex justify-between items-center bg-slate-100 px-3 py-1 rounded-lg text-sm"
                    >
                      <span>{s.name}</span>
                      <button
                        onClick={() => unassign(f.id, s.id)}
                        className="text-red-500 font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-red-500">
                    No asignado a ningún sector
                  </div>
                )}
              </div>

              {/* ACTIONS */}
              {isEditing ? (
                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => saveEdit(f.id)}
                    className="btn-primary flex-1"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="btn-secondary"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex gap-2 mt-auto">
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
                      <option value="">Asignar a sector</option>
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

                  <button
                    onClick={() => startEdit(f)}
                    className="text-sm font-bold text-slate-500 hover:text-slate-800 mt-2"
                  >
                    ✏️ Editar
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
