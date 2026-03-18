import { useState, useMemo, useEffect } from "react";
import { 
  Search, 
  ChevronLeft, 
  Package, 
  Tag, 
  Calendar, 
  DollarSign, 
  ArrowUpRight,
  ClipboardList
} from "lucide-react";
import ActivoModal from "./ActivoModal";

export default function ActivosAula({
  idAula,
  nombreAula,
  claveAula,
  onBack
}) {
  const [activos, setActivos] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedActivo, setSelectedActivo] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!idAula) return;

    const fetchActivos = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `https://corporacionperris.com/backend/api/activoModal.php?aula=${idAula}`,
          { credentials: "include" }
        );
        const data = await res.json();
        if (!data.success) {
          setError(data.message || "Error cargando activos");
          setActivos([]);
          return;
        }
        setActivos(Array.isArray(data.data) ? data.data : []);
      } catch (err) {
        setError("No se pudo conectar con el servidor");
        setActivos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivos();
  }, [idAula]);

  const filtered = useMemo(() => {
    return activos.filter(a =>
      a?.nombre?.toLowerCase().includes(search.toLowerCase()) ||
      a?.clave?.toString().includes(search)
    );
  }, [activos, search]);

  const handleSave = async () => {
    try {
      const res = await fetch(
        "https://corporacionperris.com/backend/php/updateActivo.php",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(selectedActivo)
        }
      );
      const data = await res.json();
      if (!data.success) {
        alert(data.message);
        return;
      }
      setActivos(prev =>
        prev.map(a => a.idActivo === selectedActivo.idActivo ? selectedActivo : a)
      );
      setEditMode(false);
      alert("Activo actualizado correctamente");
    } catch {
      alert("Error actualizando activo");
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 animate-pulse">
      <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Sincronizando Inventario...</p>
    </div>
  );

  if (error) return (
    <div className="p-20 text-center bg-red-50 rounded-[2.5rem] border-2 border-dashed border-red-100">
      <p className="text-red-500 font-black uppercase tracking-widest text-xs">{error}</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* 📦 HEADER DE INVENTARIO */}
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
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100 italic">{claveAula}</span>
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-1">{nombreAula}</p>
          </div>
        </div>

        <div className="relative w-full xl:w-[450px] group">
          <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-600 group-focus-within:scale-110 transition-transform" />
          <input
            type="text"
            placeholder="Filtrar activos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-slate-50 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none transition-all font-bold text-slate-600 placeholder:text-slate-300"
          />
        </div>
      </div>

      {/* 📋 LISTADO DE ACTIVOS CON MARCOS VERDES */}
      <div className="bg-white rounded-[2.5rem] border-2 border-emerald-600 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            {/* CABECERA VERDE ESMERALDA */}
            <thead>
              <tr className="bg-emerald-600">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-50 border-b border-emerald-700/50">
                  <div className="flex items-center gap-2"><Tag size={14} /> Identificación</div>
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-50 border-b border-emerald-700/50">
                  <div className="flex items-center gap-2"><ClipboardList size={14} /> Descripción</div>
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-50 border-b border-emerald-700/50">
                  <div className="flex items-center gap-2"><Calendar size={14} /> Registro</div>
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-50 border-b border-emerald-700/50 text-right">
                  <div className="flex items-center gap-2 justify-end"><DollarSign size={14} /> Valor</div>
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-50 border-b border-emerald-700/50 text-center">
                  Estado
                </th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-50">
              {filtered.map((activo) => (
                <tr
                  key={activo.idActivo}
                  onClick={() => {
                    setSelectedActivo(activo);
                    setEditMode(false);
                  }}
                  className="group hover:bg-emerald-50/50 transition-all cursor-pointer"
                >
                  <td className="px-8 py-6">
                    <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      {activo.clave}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-700 uppercase group-hover:text-emerald-700 transition-colors tracking-tight leading-tight">{activo.nombre}</span>
                      <span className="text-[10px] text-slate-300 font-medium">Suministros de aula</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-xs font-bold text-slate-500 tabular-nums">
                    {activo.fecha}
                  </td>
                  <td className="px-8 py-6 text-sm font-black text-slate-700 text-right tabular-nums">
                    {activo.importe ? `$${parseFloat(activo.importe).toLocaleString('es-MX')}` : "—"}
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border
                        ${activo.actividad == 1
                          ? "bg-green-50 text-green-600 border-green-100"
                          : "bg-red-50 text-red-600 border-red-100"
                        }`}>
                        {activo.actividad == 1 ? "Operativo" : "Dañado"}
                      </span>
                      <ArrowUpRight size={16} className="text-slate-200 group-hover:text-emerald-400 transition-all" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="py-24 flex flex-col items-center justify-center opacity-40">
              <Package size={48} className="text-slate-300 mb-3" />
              <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">Sin resultados</p>
            </div>
          )}
        </div>

        {/* 📟 PIE DE TABLA VERDE CLARO (Simetría con Grupos) */}
        <div className="bg-emerald-50 px-8 py-6 border-t border-emerald-100 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <p className="text-[10px] font-black text-emerald-700 uppercase tracking-[0.2em]">
              Total en aula: <span className="ml-1 text-emerald-900">{filtered.length} Activos</span>
            </p>
          </div>
          
          <div className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">
            Sincronización completa
          </div>
        </div>
      </div>

      {selectedActivo && (
        <ActivoModal
          activo={selectedActivo}
          onClose={() => setSelectedActivo(null)}
          editMode={editMode}
          setEditMode={setEditMode}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
