import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api";

export default function FormViewer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);

  useEffect(() => {
    api
      .get(`/forms/${id}`)
      .then((res) => setForm(res.data))
      .catch(() => navigate("/dashboard"));
  }, [id, navigate]);

  if (!form)
    return (
      <div className="h-screen flex items-center justify-center font-bold text-slate-300">
        Cargando...
      </div>
    );

  return (
    // En FormViewer.jsx:
    <div className="h-screen flex flex-col bg-slate-50">
      {/* Header adaptable: px-4 en móvil, px-8 en PC */}
      <div className="bg-white border-b px-4 md:px-8 py-4 flex items-center justify-between shadow-sm">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 font-bold text-slate-500"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M15 19l-7-7 7-7"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="hidden sm:inline">Volver al Menú</span>{" "}
          {/* Texto oculto en móviles muy pequeños */}
        </button>
        <h1 className="text-lg md:text-xl font-black truncate md:max-w-none">
          {form.name}
        </h1>
        <div className="w-10 md:w-24"></div>
      </div>

      <div className="flex-1 p-3 md:p-6">
        {/* En móvil quitamos un poco de redondeado para ganar espacio visual */}
        <div className="w-full h-full bg-white rounded-2xl md:rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200">
          <iframe src={form.embed_url} className="w-full h-full border-none" />
        </div>
      </div>
    </div>
  );
}
