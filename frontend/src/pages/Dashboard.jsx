import { useEffect, useState } from "react";
import api from "../services/api";

export default function Dashboard() {
  const [forms, setForms] = useState([]);

  useEffect(() => {
    api.get("/forms").then(res => setForms(res.data));
  }, []);

  return (
    <div>
      <h2>Formularios</h2>
      {forms.map(f => (
        <div key={f.id}>
          <a href={`/form/${f.id}`}>{f.name}</a>
        </div>
      ))}
    </div>
  );
}
