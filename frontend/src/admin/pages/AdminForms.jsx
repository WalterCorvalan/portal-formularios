import { useEffect, useState } from "react";
import api from "../../services/api";

export default function AdminForms() {
  const [forms, setForms] = useState([]);

  useEffect(() => {
    api.get("/admin/forms").then(res => setForms(res.data));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-black mb-6">Formularios</h1>

      <div className="grid gap-4 md:grid-cols-3">
        {forms.map(f => (
          <div key={f.id} className="bg-white p-4 rounded-xl shadow">
            <div className="font-bold">{f.name}</div>
            <div className="text-sm text-slate-500">
              {f.active ? "Activo" : "Inactivo"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
