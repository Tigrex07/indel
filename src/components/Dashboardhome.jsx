import { Search, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function DashboardHome() {
  const [query, setQuery] = useState("");
  const [edificio, setEdificio] = useState("Todos");
  const [estado, setEstado] = useState("Todos");
  const [turno, setTurno] = useState("Todos");

  // Mock Data (Fake)
  const data = [
    { aula: "A-101", edificio: "A", capacidad: 32, estado: "Disponible", responsable: "Juan Pérez", turno: "Matutino" },
    { aula: "B-203", edificio: "B", capacidad: 28, estado: "Ocupado", responsable: "María López", turno: "Vespertino" },
    { aula: "C-305", edificio: "C", capacidad: 40, estado: "Mantenimiento", responsable: "Carlos Ruiz", turno: "Matutino" },
    { aula: "A-110", edificio: "A", capacidad: 25, estado: "Disponible", responsable: "Ana Ortega", turno: "Nocturno" },
    { aula: "D-402", edificio: "D", capacidad: 35, estado: "Ocupado", responsable: "Luis Torres", turno: "Vespertino" },
  ];

  // Filtro lógico
  const filtrado = data.filter((item) => {
    return (
      (query === "" ||
        item.aula.toLowerCase().includes(query.toLowerCase()) ||
        item.responsable.toLowerCase().includes(query.toLowerCase())) &&
      (edificio === "Todos" || item.edificio === edificio) &&
      (estado === "Todos" || item.estado === estado) &&
      (turno === "Todos" || item.turno === turno)
    );
  });

  const limpiar = () => {
    setQuery("");
    setEdificio("Todos");
    setEstado("Todos");
    setTurno("Todos");
  };

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold text-emerald-700">Dashboard general</h1>

      {/* FILTROS */}
      <div className="bg-white border border-emerald-200 rounded-xl p-5 shadow space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          {/* Buscar */}
          <div className="flex flex-col space-y-1">
            <label className="font-medium text-gray-700">Buscar:</label>
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600"/>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Aula o responsable..."
                className="w-full border rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Edificio */}
          <div className="flex flex-col space-y-1">
            <label className="font-medium text-gray-700">Docencia:</label>
            <div className="relative">
              <select
                value={edificio}
                onChange={(e) => setEdificio(e.target.value)}
                className="appearance-none border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-emerald-500"
              >
                <option>Todos</option>
                <option>A</option>
                <option>B</option>
                <option>C</option>
                <option>D</option>
              </select>
              <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"/>
            </div>
          </div>

          {/* Estado */}
          <div className="flex flex-col space-y-1">
            <label className="font-medium text-gray-700">Planta:</label>
            <div className="relative">
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                className="appearance-none border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-emerald-500"
              >
                <option>Alta</option>
                <option>Baja</option>
              </select>
              <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"/>
            </div>
          </div>

          {/* Turno NUEVO */}
          <div className="flex flex-col space-y-1">
            <label className="font-medium text-gray-700">Aula:</label>
            <div className="relative">
              <select
                value={turno}
                onChange={(e) => setTurno(e.target.value)}
                className="appearance-none border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-emerald-500"
              >
                <option>Todos</option>
                <option>Matutino</option>
                <option>Vespertino</option>
                <option>Nocturno</option>
              </select>
              <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"/>
            </div>
          </div>

        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={limpiar}
            className="bg-gray-300 text-gray-800 rounded-lg px-4 py-2 hover:bg-gray-400 transition"
          >
            Limpiar
          </button>
        </div>
      </div>

      {/* TABLA */}
      <div className="bg-white border border-emerald-200 rounded-xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-emerald-600 text-white">
            <tr>
              <th className="p-3">Aula</th>
              <th className="p-3">Edificio</th>
              <th className="p-3">Estado</th>
              <th className="p-3">Capacidad</th>
              <th className="p-3">Responsable</th>
              <th className="p-3">Turno</th>
            </tr>
          </thead>

          <tbody>
            {filtrado.length > 0 ? (
              filtrado.map((item, i) => (
                <tr key={i} className="border-t hover:bg-emerald-50">
                  <td className="p-3">{item.aula}</td>
                  <td className="p-3">{item.edificio}</td>
                  <td className="p-3">{item.estado}</td>
                  <td className="p-3">{item.capacidad}</td>
                  <td className="p-3">{item.responsable}</td>
                  <td className="p-3">{item.turno}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  No se encontraron resultados...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
