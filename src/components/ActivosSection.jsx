import { useState } from "react";
import {
  Laptop,
  Mouse,
  Monitor,
  Printer,
  Projector,
  Cctv,
  Tv,
  BusFront,
  Armchair,
  Book,
  Building2,
  Search,
  Toolbox,
  Wrench,
  Camera,
  LucideRadio,
  Server,
  HardDrive,
  Cpu
} from "lucide-react";

export default function ActivosSection({ onOpenCategory }) {
  const [search, setSearch] = useState("");

  const categories = [
    { label: "Equipo de Computo", icon: <Laptop size={32} /> },
    { label: "Equipo de Transporte", icon: <BusFront size={32} /> },
    { label: "Mobiliario y Equipo de Oficina", icon: <Armchair size={32} /> },
    { label: "Equipo Fotográfico y de Grabación", icon: <Camera size={32} /> },
    { label: "Equipo de Comunicaciones y Transmisión", icon: <Projector size={32} /> },
    { label: "Equipo de Telecomunicaciones", icon: <LucideRadio size={32} /> },
    { label: "Herramientas y Maquinaria", icon: <Toolbox size={32} /> },
    { label: "Equipo de Laboratorio", icon: <Book size={32} /> },
    { label: "Equipo de Medición y Ensayo", icon: <Wrench size={32} /> },
    { label: "Equipo Industrial", icon: <Building2 size={32} /> },
    { label: "Equipo Médico", icon: <Cctv size={32} /> },
    { label: "Equipo de Procesamiento", icon: <Cpu size={32} /> },
    { label: "Equipo de Almacenamiento", icon: <HardDrive size={32} /> },
    { label: "Equipo Audiovisual", icon: <Tv size={32} /> },
    { label: "Equipo de Impresión", icon: <Printer size={32} /> },
    { label: "Servidores y Redes", icon: <Server size={32} /> },
    { label: "Accesorios de Computo", icon: <Mouse size={32} /> },
    { label: "Monitores y Pantallas", icon: <Monitor size={32} /> }
  ];

  const filtered = categories.filter(c =>
    c.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-xl p-8 border border-emerald-200 space-y-8">
      <h2 className="text-2xl font-bold text-emerald-600">Activos Registrados</h2>

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

      {/* GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {filtered.map(cat => (
          <button
            key={cat.label}
            onClick={() => onOpenCategory?.(cat.label)}
            className="flex flex-col items-center bg-emerald-100 hover:bg-emerald-200 rounded-xl p-6 shadow transition shadow-md hover:shadow-xl"
          >
            {cat.icon}
            <span className="mt-2 font-semibold text-gray-700">
              {cat.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
