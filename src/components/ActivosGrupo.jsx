import { useEffect, useState, useMemo } from "react";
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Hash, 
  Building2, 
  DoorOpen, 
  DollarSign,
  Monitor
} from "lucide-react";
import ActivoModal from "./ActivoModal";

const API_LIST = "https://corporacionperris.com/backend/api/activoModal.php";
const ITEMS_PER_PAGE = 10;

export default function ActivosGrupo({ grupoClave, grupoNombre, onBack }) {
  const [data, setData] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [page, setPage] = useState(1);
  const [activoSeleccionado, setActivoSeleccionado] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const cargar = () => {
    if (!grupoClave) return;
    setLoading(true);
    fetch(`${API_LIST}?grupo=${grupoClave}`, { credentials: "include" })
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setData(json.data);
          setPage(1);
        } else {
          setData([]);
        }
      })
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    cargar();
  }, [grupoClave]);

  const filtrado = useMemo(() => {
    return data.filter(i =>
      i.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      i.aula?.toString().includes(busqueda) ||
      i.edificio?.toString().includes(busqueda) ||
      i.marbete?.includes(busqueda)
    );
  }, [data, busqueda]);

  const totalPages = Math.ceil(filtrado.length / ITEMS_PER_PAGE);
  const inicio = (page - 1) * ITEMS_PER_PAGE;
  const paginaData = filtrado.slice(inicio, inicio + ITEMS_PER_PAGE);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* 🟢 HEADER DE GRUPO */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <button 
            onClick={onBack}
            className="group flex items-center justify-center w-12 h-12 bg-slate-50 rounded-2xl text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 transition-all active:scale-90"
          >
            <ChevronLeft size={24} />
          </button>
          
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-black italic tracking-tighter text-slate-800 uppercase leading-none">Activos</h2>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100 italic">{grupoClave}</span>
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-1">{grupoNombre}</p>
          </div>
        </div>

        <div className="relative w-full xl:w-[450px] group">
          <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-600 group-focus-within:scale-110 transition-transform" />
          <input
            type="text"
            placeholder="Filtrar activos..."
            value={busqueda}
            onChange={(e) => { setBusqueda(e.target.value); setPage(1); }}
            className="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-slate-50 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none transition-all font-bold text-slate-600 placeholder:text-slate-300"
          />
        </div>
      </div>

      {/* 📋 TABLA CON ENMARCADO VERDE */}
      <div className="bg-white rounded-[2.5rem] border-2 border-emerald-600 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            {/* CABECERA VERDE SÓLIDO */}
            <thead>
              <tr className="bg-emerald-600">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-50 border-b border-emerald-700/50">
                  <div className="flex items-center gap-2"><Monitor size={14} /> Equipo</div>
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-50 border-b border-emerald-700/50">
                  <div className="flex items-center gap-2"><Building2 size={14} /> Ubicación</div>
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-50 border-b border-emerald-700/50 text-center">
                  <div className="flex items-center gap-2 justify-center"><Hash size={14} /> ID / Marbete</div>
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-50 border-b border-emerald-700/50 text-right">
                  <div className="flex items-center gap-2 justify-end"><DollarSign size={14} /> Importe</div>
                </th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-20 text-center">
                    <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Cargando...</p>
                  </td>
                </tr>
              ) : paginaData.map((i) => {
                const numActivo = i.marbete?.split("-").pop();
                return (
                  <tr
                    key={i.idActivo}
                    onClick={() => { setActivoSeleccionado(i); setEditMode(false); }}
                    className="group hover:bg-emerald-50 transition-all cursor-pointer"
                  >
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-700 uppercase group-hover:text-emerald-700 transition-colors tracking-tight">
                          {i.nombre}
                        </span>
                        <span className="text-[10px] text-slate-300 font-bold uppercase tracking-tighter mt-1 italic">Inventario de Grupo</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-slate-500 uppercase bg-slate-100 px-2 py-1 rounded-md group-hover:bg-white transition-colors">{i.edificio}</span>
                        <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md group-hover:bg-white transition-colors">{i.aula}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-center gap-2">
                        <span className="bg-slate-800 text-white px-2 py-1 rounded-lg font-mono text-[10px] font-bold group-hover:bg-emerald-600 transition-colors">
                          {numActivo}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400 font-medium tracking-tight">
                          {i.marbete}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm font-black text-slate-700 text-right tabular-nums">
                      {i.importe ? `$${Number(i.importe).toLocaleString()}` : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* 📟 PIE DE TABLA (PAGINACIÓN) VERDE CLARO */}
        {totalPages > 1 && (
          <div className="bg-emerald-50 px-8 py-6 border-t border-emerald-100 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <p className="text-[10px] font-black text-emerald-700 uppercase tracking-[0.2em]">
                Página {page} <span className="text-emerald-300 mx-1">/</span> {totalPages}
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="w-12 h-10 flex items-center justify-center bg-white border border-emerald-200 rounded-xl text-emerald-600 hover:bg-emerald-600 hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-emerald-600 transition-all active:scale-95 shadow-sm"
              >
                <ChevronLeft size={20} strokeWidth={3} />
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
                className="w-12 h-10 flex items-center justify-center bg-white border border-emerald-200 rounded-xl text-emerald-600 hover:bg-emerald-600 hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-emerald-600 transition-all active:scale-95 shadow-sm"
              >
                <ChevronRight size={20} strokeWidth={3} />
              </button>
            </div>
          </div>
        )}
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
