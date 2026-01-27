import { Search, ChevronDown, Copy, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Building2, Layers, Users } from "lucide-react";

const API_URL = "https://corporacionperris.com/backend/api/inventario.php";
const ITEMS_PER_PAGE = 7;

export default function DashboardHome() {
  const [query, setQuery] = useState("");
  const [edificio, setEdificio] = useState("Todos");
  const [grupo, setGrupo] = useState("Todos");

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [copiado, setCopiado] = useState("");

  /* =========================
     CARGAR DATOS
  ========================= */
  useEffect(() => {
    fetch(API_URL, { credentials: "include" })
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setData(json.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  /* =========================
     KPIs
  ========================= */
  const totalActivos = data.length;
  const totalEdificios = new Set(data.map((i) => i.edificio)).size;
  const totalGrupos = new Set(data.map((i) => i.grupo)).size;

  /* =========================
     FILTRO (CORRECTO)
  ========================= */
  const filtrado = data.filter((item) => {
    const q = query.toLowerCase();

    return (
      (q === "" ||
        item.nombre_activo.toLowerCase().includes(q) ||
        item.aula.toLowerCase().includes(q) ||
        item.edificio.toLowerCase().includes(q) ||
        item.grupo.toLowerCase().includes(q) ||
        item.marbete.includes(query)) &&
      (edificio === "Todos" || item.edificio === edificio) &&
      (grupo === "Todos" || item.grupo === grupo)
    );
  });

  /* =========================
     PAGINACIÓN
  ========================= */
  const totalPages = Math.ceil(filtrado.length / ITEMS_PER_PAGE);
  const inicio = (page - 1) * ITEMS_PER_PAGE;
  const paginaData = filtrado.slice(inicio, inicio + ITEMS_PER_PAGE);

  const cambiarPagina = (dir) => {
    setPage((p) => Math.min(Math.max(1, p + dir), totalPages));
  };

  const limpiar = () => {
    setQuery("");
    setEdificio("Todos");
    setGrupo("Todos");
    setPage(1);
  };

  const copiarMarbete = (m) => {
    navigator.clipboard.writeText(m);
    setCopiado(m);
    setTimeout(() => setCopiado(""), 1500);
  };

  if (loading) {
    return <p className="text-gray-600">Cargando datos…</p>;
  }

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold text-emerald-700">
        Dashboard general
      </h1>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <KPI icon={<Layers size={26} />} label="Total de Activos" value={totalActivos} />
        <KPI icon={<Building2 size={26} />} label="Edificios" value={totalEdificios} />
        <KPI icon={<Users size={26} />} label="Grupos" value={totalGrupos} />
      </div>

      {/* FILTROS */}
      <div className="bg-white border border-emerald-200 rounded-xl p-6 shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">

          {/* BUSCAR */}
          <div>
            <label className="font-medium text-gray-700">Buscar:</label>
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por nombre, aula, edificio o marbete"
                className="w-full border rounded-lg pl-10 pr-3 py-2.5 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* EDIFICIO */}
          <div>
            <label className="font-medium text-gray-700">Edificio:</label>
            <div className="relative">
              <select
                value={edificio}
                onChange={(e) => setEdificio(e.target.value)}
                className="appearance-none w-full border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-emerald-500"
              >
                <option>Todos</option>
                {[...new Set(data.map((i) => i.edificio))].map((e) => (
                  <option key={e}>{e}</option>
                ))}
              </select>
              <ChevronDown
                size={18}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
              />
            </div>
          </div>

          {/* GRUPO */}
          <div>
            <label className="font-medium text-gray-700">Grupo:</label>
            <div className="relative">
              <select
                value={grupo}
                onChange={(e) => setGrupo(e.target.value)}
                className="appearance-none w-full border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-emerald-500"
              >
                <option>Todos</option>
                {[...new Set(data.map((i) => i.grupo))].map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </select>
              <ChevronDown
                size={18}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
              />
            </div>
          </div>

          {/* LIMPIAR */}
          <div className="flex justify-end">
            <button
              onClick={limpiar}
              className="bg-gray-300 text-gray-800 px-5 py-2.5 rounded-lg hover:bg-gray-400 transition font-medium"
            >
              Limpiar
            </button>
          </div>
        </div>
      </div>

      {/* TABLA */}
      <div className="bg-white border border-emerald-200 rounded-xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-emerald-600 text-white">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Edificio</th>
              <th className="px-4 py-3">Aula</th>
              <th className="px-4 py-3">Grupo</th>
              <th className="px-4 py-3">Activo</th>
              <th className="px-4 py-3">Marbete</th>
            </tr>
          </thead>

          <tbody>
            {paginaData.length ? (
              paginaData.map((i) => (
                <tr key={i.marbete} className="border-t hover:bg-emerald-50">
                  <td className="px-4 py-3 font-medium">{i.nombre_activo}</td>
                  <td className="px-4 py-3">{i.edificio}</td>
                  <td className="px-4 py-3">{i.aula}</td>
                  <td className="px-4 py-3">{i.grupo}</td>

                  {/* ACTIVO (LA COSA) */}
                  <td className="px-4 py-3">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold text-sm">
                      {i.activo}
                    </span>
                  </td>

                  {/* MARBETE */}
                  <td
                    onClick={() => copiarMarbete(i.marbete)}
                    className="px-4 py-3 font-mono cursor-pointer flex items-center gap-2 hover:text-emerald-700"
                  >
                    {i.marbete}
                    {copiado === i.marbete ? (
                      <CheckCircle size={16} className="text-green-600" />
                    ) : (
                      <Copy size={16} className="text-gray-500" />
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-4 py-6 text-center text-gray-500">
                  No se encontraron resultados…
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINACIÓN */}
      <div className="flex justify-between items-center pt-4">
        <button
          onClick={() => cambiarPagina(-1)}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
        >
          Anterior
        </button>

        <span className="text-gray-700 font-medium">
          Página {page} de {totalPages}
        </span>

        <button
          onClick={() => cambiarPagina(1)}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>

    </div>
  );
}

/* KPI */
function KPI({ icon, label, value }) {
  return (
    <div className="bg-white border border-emerald-200 rounded-xl p-5 shadow flex items-center gap-4">
      <div className="bg-emerald-600 text-white p-3 rounded-lg">
        {icon}
      </div>
      <div>
        <p className="text-gray-600 text-sm">{label}</p>
        <p className="text-2xl font-bold text-emerald-700">{value}</p>
      </div>
    </div>
  );
}
