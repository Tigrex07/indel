import { useState, useEffect } from "react";
import { Search, Boxes } from "lucide-react";

const API_URL = "https://corporacionperris.com/backend/api/grupos.php";

export default function ActivosSection({ onOpenCategory }) {
  const [search, setSearch] = useState("");
  const [catalogoGrupos, setCatalogoGrupos] = useState([]);

  /* =========================
     CARGAR GRUPOS DESDE BD
  ========================= */
  useEffect(() => {
    fetch(API_URL, {
      method: "GET",
      credentials: "include", // 🔐 sesión PHP
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setCatalogoGrupos(
            json.data.map(g => ({
              ...g,
              icon: Boxes // icono genérico
            }))
          );
        }
      })
      .catch(err => console.error("Error cargando grupos:", err));
  }, []);

  /* =========================
     FILTRO
  ========================= */
  const filtered = catalogoGrupos.filter(g =>
    g.nombre.toLowerCase().includes(search.toLowerCase()) ||
    g.clave.toString().includes(search)
  );

  return (
    <div className="bg-white rounded-xl shadow-xl p-8 border border-emerald-200 space-y-8">
      <h2 className="text-2xl font-bold text-emerald-600">
        Activos Registrados
      </h2>

      {/* BUSCADOR */}
      <div className="flex items-center bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2 flex-1">
        <Search size={18} className="text-emerald-600" />
        <input
          type="text"
          placeholder="Buscar grupo..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-transparent flex-1 ml-2 focus:outline-none text-gray-800"
        />
      </div>

      {/* GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {filtered.map(({ idGrupo, clave, nombre }) => (
          <button
            key={idGrupo}
            onClick={() => onOpenCategory?.(clave)}
            className="text-left border rounded-xl p-5 shadow hover:shadow-lg hover:bg-emerald-100 transition-all duration-300"
          >
          
            <p className="text-sm text-gray-500 font-semibold">
              {clave}
            </p>
            <p className="text-base font-bold text-gray-800 leading-tight">
              {nombre}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
