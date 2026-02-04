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
  <div className="space-y-8">

    {/* TÍTULO */}
    <div className="flex items-center gap-3">
      <Search size={26} className="text-emerald-700 opacity-70" />
      <h2 className="text-3xl font-bold text-emerald-700 tracking-tight">
        Grupos de Activos
      </h2>
    </div>

    {/* BUSCADOR */}
    <div className="relative max-w-md">
      <Search
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600"
      />
      <input
        className="w-full pl-10 pr-3 py-2.5 border border-emerald-200 rounded-lg
                   focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
        placeholder="Buscar grupos..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>

    {/* GRID DE GRUPOS */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {filtered.map((g) => (
        <button
          key={g.idGrupo}
          onClick={() => onOpenCategory(g.clave, g.nombre, g.idGrupo)}
          className="bg-white border border-emerald-200 rounded-xl p-5 shadow-sm
                     hover:shadow-md hover:bg-emerald-50 hover:scale-[1.02]
                     active:scale-[0.98] transition-all text-left flex flex-col gap-2"
        >
          <div className="flex items-center gap-2 text-emerald-700">
            {/* Icono del grupo */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 opacity-80"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 7l9-4 9 4-9 4-9-4z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 17l9 4 9-4"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 12l9 4 9-4"
              />
            </svg>

            <span className="font-semibold text-sm">{g.clave}</span>
          </div>

          <p className="text-gray-800 font-bold text-lg leading-tight">
            {g.nombre}
          </p>
        </button>
      ))}

      {filtered.length === 0 && (
        <p className="col-span-full text-center text-gray-500">
          No se encontraron grupos
        </p>
      )}
    </div>

  </div>
);
}
