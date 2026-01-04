import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

export default function FormViewer() {
  const { id } = useParams();
  const [form, setForm] = useState(null);

  useEffect(() => {
    api.get(`/forms/${id}`).then(res => setForm(res.data));
  }, [id]);

  if (!form) return null;

  return (
    <iframe
      src={form.embed_url}
      style={{ width: "100%", height: "100vh", border: "none" }}
    />
  );
}
