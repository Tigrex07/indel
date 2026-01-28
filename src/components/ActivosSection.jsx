import { useState } from "react";
import { Search } from "lucide-react";
import { catalogoGrupos } from "../data/catalogoGrupos.js";

export default function ActivosSection({ onOpenCategory }) {
  const [search, setSearch] = useState("");

  const filtered = catalogoGrupos.filter(g =>
    g.nombre.toLowerCase().includes(search.toLowerCase()) ||
    g.clave.includes(search)
  );

  return (
    <div className="bg-white rounded-xl shadow-xl p-8 border border-emerald-200 space-y-8">
      <h2 className="text-2xl font-bold text-emerald-600">Activos Registrados</h2>

      {/* Buscador */}
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

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {filtered.map(({ clave, nombre, icon: Icon }) => (
          <button
            key={clave}
            onClick={() => onOpenCategory?.(clave)}
            className="text-left border rounded-xl p-5 shadow hover:shadow-lg hover:bg-emerald-100 transition-all duration-300"
          >
            <Icon size={32} className="text-emerald-600 mb-3" />
            <p className="text-sm text-gray-500 font-semibold">{clave}</p>
            <p className="text-base font-bold text-gray-800 leading-tight">{nombre}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
