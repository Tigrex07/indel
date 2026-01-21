import { useState } from "react";
import {
  Laptop,
  Monitor,
  Mouse,
  Tv,
  Printer,
  Projector,
  Book,
  Building2,
  Search,
  ChevronDown,
  Armchair,
  Cctv,
  BusFront,
  Toolbox,

} from "lucide-react";

export default function ActivosSection({ onOpenCategory }) {
  const [search, setSearch] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("Todos");

  const groups = [
    "Informática",
    "Mobiliario",
    "Audiovisual",
    "Edificios",
    "Consumibles"
  ];

  const categories = [
    { label: "Equipo de Computo", icon: <Laptop size={32} />, group: "Informática" },
    { label: "Equipo de transporte", icon: <BusFront size={32} />, group: "Informática" },
    { label: "Mobiliario y Equipo de Oficina", icon: <Armchair size={32} />, group: "Informática" },
    { label: "Equipo de Foto Cine y Grabacion (Camaras)", icon: <Cctv size={32} />, group: "Audiovisual" },
    { label: "Equipo de aparatos de Comunicaciones y Transportes", icon: <Projector size={32} />, group: "Audiovisual" },
    { label: "Herramientas y Maquinas", icon: <Toolbox size={32} />, group: "Informática" },
    { label: "Equipo de Laboratorio", icon: <Book size={32} />, group: "Mobiliario" },
    { label: "Maquinaria y Equipo", icon: <Building2 size={32} />, group: "Edificios" }
  ];

  const filtered = categories.filter(c =>
    (selectedGroup === "Todos" || c.group === selectedGroup) &&
    c.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-xl p-8 border border-emerald-200 space-y-8">
      <h2 className="text-2xl font-bold text-emerald-600">
        Activos Registrados
      </h2>

      {/* SEARCH + FILTERS */}
      <div className="flex flex-col md:flex-row gap-4">

        {/* BUSCADOR */}
        <div className="flex items-center bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2 flex-1">
          <Search size={18} className="text-emerald-600" />
          <input
            type="text"
            placeholder="Buscar activos..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent flex-1 ml-2 focus:outline-none text-gray-800"
          />
        </div>

        {/* SELECT DE GRUPOS */}
        <div className="relative">
          <select
            value={selectedGroup}
            onChange={e => setSelectedGroup(e.target.value)}
            className="appearance-none bg-emerald-600 text-white font-semibold px-4 py-2 rounded-lg pr-10 shadow hover:bg-emerald-700 transition"
          >
            <option value="Todos">Todos los grupos</option>
            {groups.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
          <ChevronDown
            size={20}
            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white"
          />
        </div>
      </div>

      {/* GRID DE CATEGORÍAS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {filtered.map(cat => (
          <button
            key={cat.label}
            onClick={() => onOpenCategory?.(cat.label)}
            className="flex flex-col items-center bg-emerald-100 hover:bg-emerald-200 rounded-xl p-6 shadow transition shadow-md hover:shadow-xl"
          >
            {cat.icon}
            <span className="mt-2 font-semibold text-gray-700">{cat.label}</span>
            <span className="text-xs text-gray-500">{cat.group}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
