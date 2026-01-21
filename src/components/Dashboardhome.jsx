import { Search, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

export default function DashboardHome() {
  const [query, setQuery] = useState("");
  const [edificio, setEdificio] = useState("Todos");
  const [grupo, setGrupo] = useState("Todos");

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Cargar datos reales desde IONOS
  useEffect(() => {
    fetch("https://corporacionperris.com/backend/read.php")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setData(json.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // 🔹 Filtro compatible con números y texto
  const filtrado = data.filter((item) => {
    return (
      (query === "" ||
        item.aula.toString().includes(query) ||
        item.activo.toString().includes(query)) &&
      (edificio === "Todos" || item.edificio === edificio) &&
      (grupo === "Todos" || item.grupo === grupo)
    );
  });

  const limpiar = () => {
    setQuery("");
    setEdificio("Todos");
    setGrupo("Todos");
  };

  if (loading) {
    return <p className="text-gray-600">Cargando datos…</p>;
  }

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold text-emerald-700">
        Dashboard general
      </h1>

      {/* FILTROS */}
      <div className="bg-white border border-emerald-200 rounded-xl p-5 shadow space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          {/* Buscar */}
          <div className="flex flex-col space-y-1">
            <label className="font-medium text-gray-700">Buscar:</label>
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Aula o activo..."
                className="w-full border rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Edificio */}
          <div className="flex flex-col space-y-1">
            <label className="font-medium text-gray-700">Edificio:</label>
            <div className="relative">
              <select
                value={edificio}
                onChange={(e) => setEdificio(e.target.value)}
                className="appearance-none border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-emerald-500"
              >
                <option>Todos</option>
                {[...new Set(data.map((item) => item.edificio))].map((ed) => (
                  <option key={ed} value={ed}>
                    {ed}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={18}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
              />
            </div>
          </div>

          {/* Grupo */}
          <div className="flex flex-col space-y-1">
            <label className="font-medium text-gray-700">Grupo:</label>
            <div className="relative">
              <select
                value={grupo}
                onChange={(e) => setGrupo(e.target.value)}
                className="appearance-none border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-emerald-500"
              >
                <option>Todos</option>
                {[...new Set(data.map((item) => item.grupo))].map((gr) => (
                  <option key={gr} value={gr}>
                    {gr}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={18}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
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
              <th className="p-3">Edificio</th>
              <th className="p-3">Aula</th>
              <th className="p-3">Grupo</th>
              <th className="p-3">Activo</th>
            </tr>
          </thead>
          <tbody>
            {filtrado.length > 0 ? (
              filtrado.map((item, i) => (
                <tr key={i} className="border-t hover:bg-emerald-50">
                  <td className="p-3">{item.edificio}</td>
                  <td className="p-3">{item.aula}</td>
                  <td className="p-3">{item.grupo}</td>
                  <td className="p-3">{item.activo}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  No se encontraron resultados…
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}