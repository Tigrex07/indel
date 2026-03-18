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
    <div className="max-w-[1600px] mx-auto space-y-6 animate-in fade-in duration-500 pb-10 px-4 xl:px-0">
      
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-black text-gray-800 tracking-tight uppercase italic leading-none">
          Dashboard <span className="text-emerald-600">Home</span>
        </h1>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2 ml-1">Control General de Activos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPI icon={<Layers size={24} />} label="Total Activos" value={totalActivos} />
        <KPI icon={<Building2 size={24} />} label="Edificios" value={totalEdificios} />
        <KPI icon={<Users size={24} />} label="Categorías" value={totalGrupos} />
      </div>

      {/* FILTROS DINÁMICOS */}
      <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-end">
          
          <div className="space-y-1.5 lg:col-span-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Buscador</label>
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" />
              <input
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                placeholder="Nombre, marbete..."
                className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-11 pr-4 py-3 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Edificio</label>
            <select
              value={edificio}
              onChange={(e) => { setEdificio(e.target.value); setPage(1); }}
              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-emerald-500 cursor-pointer transition-all"
            >
              <option>Todos</option>
              {[...new Set(activosActivos.map((i) => i.edificio))].sort().map((e) => <option key={e}>{e}</option>)}
            </select>
          </div>

          <div className={`space-y-1.5 transition-all duration-300 ${edificio === "Todos" ? "opacity-30 pointer-events-none" : "opacity-100"}`}>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Aula</label>
            <select
              value={aula}
              onChange={(e) => { setAula(e.target.value); setPage(1); }}
              disabled={edificio === "Todos"}
              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-emerald-500 cursor-pointer transition-all disabled:bg-slate-100"
            >
              <option>Todas</option>
              {aulasDisponibles.map((a) => <option key={a}>{a}</option>)}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Grupo</label>
            <select
              value={grupo}
              onChange={(e) => { setGrupo(e.target.value); setPage(1); }}
              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-emerald-500 cursor-pointer transition-all"
            >
              <option>Todos</option>
              {[...new Set(activosActivos.map((i) => i.grupo))].sort().map((g) => <option key={g}>{g}</option>)}
            </select>
          </div>

          {/* 🟢 BOTÓN REINICIAR VERDE */}
          <button
            onClick={() => {setQuery(""); setEdificio("Todos"); setAula("Todas"); setGrupo("Todos"); setPage(1);}}
            className="flex items-center justify-center gap-2 bg-emerald-600 text-white py-3.5 rounded-xl hover:bg-emerald-700 hover:scale-[1.02] active:scale-95 transition-all font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-emerald-100"
          >
            <RotateCcw size={16} />
            Reiniciar
          </button>
        </div>
      </div>

      {/* 📋 TABLA CON ENMARCADO VERDE (ESTILO UNIFICADO) */}
      <div className="bg-white rounded-[2.5rem] border-2 border-emerald-600 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              {/* CABECERA VERDE ESMERALDA */}
              <tr className="bg-emerald-600">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-50 border-b border-emerald-700/50 italic">Activo</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-50 border-b border-emerald-700/50 italic">Edificio</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-50 border-b border-emerald-700/50 italic">Aula</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-50 border-b border-emerald-700/50 italic">Categoría</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-50 border-b border-emerald-700/50 text-right italic">Marbete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginaData.length ? (
                paginaData.map((i) => (
                  <tr key={i.idActivo} onClick={() => abrirActivo(i)} className="hover:bg-emerald-50/50 cursor-pointer transition-all group">
                    <td className="px-8 py-5 text-sm font-black text-slate-700 uppercase group-hover:text-emerald-700 transition-colors tracking-tighter leading-tight">
                      {i.nombre}
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <Building2 size={12} className="text-emerald-500" />
                        <span className="text-[11px] font-bold text-slate-500 uppercase">{i.edificio}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-[10px] font-black text-slate-400 uppercase bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg group-hover:bg-white transition-colors">
                        {i.aula}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase italic">
                      {i.grupo}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button
                        onClick={(e) => copiarMarbete(e, i.marbete)}
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl font-mono text-[10px] font-black border transition-all
                          ${copiado === i.marbete 
                            ? "bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-100" 
                            : "bg-slate-50 border-slate-100 text-slate-400 hover:border-emerald-400 hover:text-emerald-600 group-hover:bg-white"}`}
                      >
                        {i.marbete}
                        {copiado === i.marbete ? <CheckCircle size={14} /> : <Copy size={12} className="opacity-30" />}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5" className="py-24 text-center text-slate-300 font-black uppercase tracking-[0.3em] text-[10px]">Sin coincidencias encontradas</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 📟 PANEL DE PAGINACIÓN VERDE CLARO */}
        <div className="px-8 py-5 bg-emerald-50 border-t border-emerald-100 flex justify-between items-center">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="w-12 h-10 flex items-center justify-center bg-white border border-emerald-200 rounded-xl text-emerald-600 hover:bg-emerald-600 hover:text-white disabled:opacity-30 transition-all active:scale-90 shadow-sm"
          >
            <ArrowRight size={20} className="rotate-180" strokeWidth={3} />
          </button>
          
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] font-black text-emerald-700 uppercase tracking-[0.2em] italic">
              Página <span className="text-emerald-900 mx-1">{page}</span> de {totalPages}
            </span>
          </div>

          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="w-12 h-10 flex items-center justify-center bg-white border border-emerald-200 rounded-xl text-emerald-600 hover:bg-emerald-600 hover:text-white disabled:opacity-30 transition-all active:scale-90 shadow-sm"
          >
            <ArrowRight size={20} strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* MODAL */}
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
    <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm flex items-center gap-6 group hover:border-emerald-200 transition-all cursor-default">
      <div className="p-5 bg-emerald-50 text-emerald-600 rounded-[1.5rem] group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 shadow-sm shadow-emerald-50">
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2 italic">{label}</span>
        <span className="text-4xl font-black text-slate-800 tracking-tighter leading-none italic uppercase tabular-nums">
          {value.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
