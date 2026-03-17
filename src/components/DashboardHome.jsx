import { Search, ChevronDown, Copy, CheckCircle, Building2, Layers, Users, Filter, RotateCcw, ArrowRight, MapPin } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import ActivoModal from "../components/ActivoModal";

const API_URL = "https://corporacionperris.com/backend/api/inventario.php";
const API_MODAL = "https://corporacionperris.com/backend/api/activoModal.php";
const ITEMS_PER_PAGE = 8;

export default function DashboardHome() {
  const [query, setQuery] = useState("");
  const [edificio, setEdificio] = useState("Todos");
  const [aula, setAula] = useState("Todas");
  const [grupo, setGrupo] = useState("Todos");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [copiado, setCopiado] = useState("");
  const [activoSeleccionado, setActivoSeleccionado] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetch(API_URL, { credentials: "include" })
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) setData(json.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const activosActivos = data.filter(i => i.actividad === 1);

  const aulasDisponibles = useMemo(() => {
    if (edificio === "Todos") return [];
    const filtradosPorEdificio = activosActivos.filter(i => i.edificio === edificio);
    return [...new Set(filtradosPorEdificio.map(i => i.aula))].sort();
  }, [edificio, activosActivos]);

  useEffect(() => {
    setAula("Todas");
  }, [edificio]);

  const filtrado = activosActivos.filter((item) => {
    const q = query.toLowerCase();
    return (
      (q === "" ||
        (item.nombre || "").toLowerCase().includes(q) ||
        (item.aula || "").toLowerCase().includes(q) ||
        (item.edificio || "").toLowerCase().includes(q) ||
        (item.grupo || "").toLowerCase().includes(q) ||
        (item.marbete || "").includes(query)) &&
      (edificio === "Todos" || item.edificio === edificio) &&
      (aula === "Todas" || item.aula === aula) &&
      (grupo === "Todos" || item.grupo === grupo)
    );
  });

  const totalPages = Math.ceil(filtrado.length / ITEMS_PER_PAGE) || 1;
  const paginaData = filtrado.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const totalActivos = activosActivos.length;
  const totalEdificios = new Set(activosActivos.map((i) => i.edificio)).size;
  const totalGrupos = new Set(activosActivos.map((i) => i.grupo)).size;

  const copiarMarbete = (e, m) => {
    e.stopPropagation();
    navigator.clipboard.writeText(m);
    setCopiado(m);
    setTimeout(() => setCopiado(""), 1500);
  };

  const abrirActivo = async (activo) => {
    try {
      const res = await fetch(`${API_MODAL}?idActivo=${activo.idActivo}`, { credentials: "include" });
      const json = await res.json();
      if (json.success && json.data.length > 0) {
        setActivoSeleccionado(json.data[0]);
        setEditMode(false);
      }
    } catch (error) { console.error(error); }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-96 gap-3">
      <div className="w-10 h-10 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
      <p className="text-[10px] font-black text-emerald-600 tracking-[0.3em]">CARGANDO SISTEMA</p>
    </div>
  );

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 animate-in fade-in duration-500 pb-10">
      
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-black text-gray-800 tracking-tight uppercase italic">
          Dashboard <span className="text-emerald-600">Home</span>
        </h1>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Control General de Activos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPI icon={<Layers size={24} />} label="Total Activos" value={totalActivos} />
        <KPI icon={<Building2 size={24} />} label="Edificios" value={totalEdificios} />
        <KPI icon={<Users size={24} />} label="Categorías" value={totalGrupos} />
      </div>

      {/* FILTROS DINÁMICOS */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 items-end">
          
          <div className="space-y-1.5 lg:col-span-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Buscador</label>
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500/50" />
              <input
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                placeholder="Buscar activo..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm font-semibold text-gray-700 outline-none focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Edificio</label>
            <select
              value={edificio}
              onChange={(e) => { setEdificio(e.target.value); setPage(1); }}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option>Todos</option>
              {[...new Set(activosActivos.map((i) => i.edificio))].sort().map((e) => <option key={e}>{e}</option>)}
            </select>
          </div>

          <div className={`space-y-1.5 transition-all duration-300 ${edificio === "Todos" ? "opacity-30 pointer-events-none" : "opacity-100"}`}>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Aula</label>
            <select
              value={aula}
              onChange={(e) => { setAula(e.target.value); setPage(1); }}
              disabled={edificio === "Todos"}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 outline-none focus:border-emerald-500 cursor-pointer disabled:bg-gray-100"
            >
              <option>Todas</option>
              {aulasDisponibles.map((a) => <option key={a}>{a}</option>)}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Grupo</label>
            <select
              value={grupo}
              onChange={(e) => { setGrupo(e.target.value); setPage(1); }}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option>Todos</option>
              {[...new Set(activosActivos.map((i) => i.grupo))].sort().map((g) => <option key={g}>{g}</option>)}
            </select>
          </div>

          <button
            onClick={() => {setQuery(""); setEdificio("Todos"); setAula("Todas"); setGrupo("Todos"); setPage(1);}}
            className="flex items-center justify-center gap-2 bg-gray-800 text-white py-3 rounded-xl hover:bg-emerald-600 transition-all font-bold text-xs uppercase tracking-widest"
          >
            <RotateCcw size={16} />
            Reiniciar
          </button>
        </div>
      </div>

      {/* TABLA DE ACTIVOS ACTUALIZADA */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-400 tracking-widest">Nombre del Activo</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-400 tracking-widest">Edificio</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-400 tracking-widest">Aula</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-400 tracking-widest">Grupo</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-400 tracking-widest text-right">Marbete</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {paginaData.length ? (
              paginaData.map((i) => (
                <tr key={i.idActivo} onClick={() => abrirActivo(i)} className="hover:bg-emerald-50/40 cursor-pointer transition-colors group">
                  <td className="px-6 py-4 text-sm font-bold text-gray-800 uppercase group-hover:text-emerald-600">
                    {i.nombre}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-semibold text-gray-600 flex items-center gap-2">
                        <Building2 size={14} className="text-emerald-500" /> {i.edificio}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-black text-gray-400 uppercase bg-gray-100 px-2 py-1 rounded-md">
                        {i.aula}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">
                    {i.grupo}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={(e) => copiarMarbete(e, i.marbete)}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-xs font-bold border transition-all
                        ${copiado === i.marbete 
                          ? "bg-emerald-600 border-emerald-600 text-white" 
                          : "bg-gray-50 border-gray-200 text-gray-400 hover:border-emerald-400 hover:text-emerald-600"}`}
                    >
                      {i.marbete}
                      {copiado === i.marbete ? <CheckCircle size={14} /> : <Copy size={14} className="opacity-30" />}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5" className="py-20 text-center text-gray-300 font-bold uppercase text-xs">Sin coincidencias</td></tr>
            )}
          </tbody>
        </table>
        
        {/* PAGINACIÓN */}
        <div className="px-8 py-4 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-emerald-600 disabled:opacity-20 transition-all shadow-sm"
          >
            <ArrowRight size={18} className="rotate-180" />
          </button>
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest italic">
            Página <span className="text-emerald-600 font-black text-sm">{page}</span> de {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-emerald-600 disabled:opacity-20 transition-all shadow-sm"
          >
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {activoSeleccionado && (
        <ActivoModal
          activo={activoSeleccionado}
          onClose={() => setActivoSeleccionado(null)}
          editMode={editMode}
          setEditMode={setEditMode}
        />
      )}
    </div>
  );
}

function KPI({ icon, label, value }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center gap-5 group hover:border-emerald-200 transition-all">
      <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1.5">{label}</span>
        <span className="text-3xl font-black text-gray-800 tracking-tighter leading-none italic">{value.toLocaleString()}</span>
      </div>
    </div>
  );
}