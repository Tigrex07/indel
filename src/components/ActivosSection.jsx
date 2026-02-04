import { useState, useEffect } from "react";
import { Search } from "lucide-react";

const API_URL = "https://corporacionperris.com/backend/api/grupos.php";

export default function ActivosSection({ onOpenCategory }) {
  const [search, setSearch] = useState("");
  const [grupos, setGrupos] = useState([]);

  useEffect(() => {
    fetch(API_URL, { credentials: "include" })
      .then(r => r.json())
      .then(j => j.success && setGrupos(j.data));
  }, []);

  const filtered = grupos.filter(g =>
    g.nombre.toLowerCase().includes(search.toLowerCase()) ||
    g.clave.includes(search)
  );

  return (
    <div className="space-y-6">
      <input
        className="border p-2 rounded w-full"
        placeholder="Buscar grupo..."
        value={search}
        onChange={e=>setSearch(e.target.value)}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {filtered.map(g=>(
          <button
            key={g.idGrupo}
            onClick={()=>onOpenCategory(g.clave)}
            className="border rounded-lg p-4 hover:bg-emerald-100"
          >
            <p className="text-sm">{g.clave}</p>
            <p className="font-bold">{g.nombre}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
