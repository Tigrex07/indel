import { useEffect, useState, useMemo } from "react";
import {
  Search,
  DoorOpen,
  Plus,
  Pencil,
  X,
  ShieldOff,
  ShieldCheck,
  ChevronLeft,
  Settings2,
  ArrowUpRight
} from "lucide-react";

const API_URL = "https://corporacionperris.com/backend/api/aulas.php";

export default function AulasSection({
  idEdificio,
  nombreEdificio,
  claveEdificio,
  onBack,
  onSelectAula
}) {
  const [search, setSearch] = useState("");
  const [aulas, setAulas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState("activas");

  const [showModal, setShowModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [aulaActual, setAulaActual] = useState({
    idAula: null,
    nombre: "",
    clave: ""
  });

  const cargarAulas = () => {
    if (!idEdificio) return;
    setLoading(true);
    fetch(`${API_URL}?edificio=${idEdificio}&estado=${filtroEstado}`, {
      credentials: "include",
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) setAulas(json.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    cargarAulas();
  }, [idEdificio, filtroEstado]);

  const filtered = useMemo(() => {
    return aulas.filter(
      (a) =>
        a.nombre.toLowerCase().includes(search.toLowerCase()) ||
        a.clave.toString().includes(search)
    );
  }, [aulas, search]);

  const abrirCrear = () => {
    setModoEdicion(false);
    setAulaActual({ idAula: null, nombre: "", clave: "" });
    setShowModal(true);
  };

  const abrirEditar = (aula) => {
    setModoEdicion(true);
    setAulaActual({
      idAula: aula.idAula,
      nombre: aula.nombre,
      clave: aula.clave
    });
    setShowModal(true);
  };

  const guardarAula = async () => {
    if (!aulaActual.nombre || !aulaActual.clave) {
      alert("Completa todos los campos");
      return;
    }
    const metodo = modoEdicion ? "PUT" : "POST";
    const bodyData = {
      nombre: aulaActual.nombre,
      clave: aulaActual.clave,
      idEdificio
    };
    if (modoEdicion) bodyData.idAula = aulaActual.idAula;

    await fetch(API_URL, {
      method: metodo,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyData),
    });

    setShowModal(false);
    cargarAulas();
  };

  const cambiarEstadoAula = async (aula) => {
    const mensaje = aula.actividad === 1 ? "¿Inactivar aula?" : "¿Activar aula?";
    if (!window.confirm(mensaje)) return;

    await fetch(API_URL, {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idAula: aula.idAula }),
    });
    cargarAulas();
  };

  if (!idEdificio) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* 🚪 HEADER DE AULAS */}
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
              <h2 className="text-3xl font-black italic tracking-tighter text-slate-800 uppercase leading-none">Aulas</h2>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100 italic">{claveEdificio}</span>
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-1">{nombreEdificio}</p>
          </div>
        </div>

        {/* BÚSQUEDA Y FILTROS */}
        <div className="flex flex-col md:flex-row items-center gap-4 flex-1 max-w-4xl justify-end">
          <div className="relative w-full md:w-80 group">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 group-focus-within:scale-110 transition-transform" />
            <input
              type="text"
              placeholder="Buscar por nombre o clave..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-6 py-3.5 rounded-2xl border-2 border-slate-50 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none transition-all font-bold text-slate-600 placeholder:text-slate-300"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="flex-1 md:flex-none bg-white border-2 border-slate-100 rounded-2xl px-5 py-3.5 text-[11px] font-black uppercase tracking-widest text-slate-500 outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="activas">🟢 Activas</option>
              <option value="inactivas">🔴 Inactivas</option>
            </select>

            <button
              onClick={abrirCrear}
              className="bg-emerald-600 text-white px-6 py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-50 active:scale-95 font-black text-[11px] uppercase tracking-widest whitespace-nowrap"
            >
              <Plus size={18} strokeWidth={3} />
              Añadir Aula
            </button>
          </div>
        </div>
      </div>

      {/* 📦 GRID DE AULAS */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Sincronizando Espacios...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((aula) => (
            <div
              key={aula.idAula}
              onClick={() => aula.actividad === 1 && onSelectAula(aula)}
              className={`group relative rounded-[2rem] p-7 transition-all duration-500 border-2 cursor-pointer
                ${aula.actividad === 0 
                  ? "bg-slate-50 border-slate-100 opacity-60" 
                  : "bg-white border-slate-50 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-100/20 hover:-translate-y-1"}`}
            >
              <div className="flex justify-between items-start mb-5">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${aula.actividad === 1 ? 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white' : 'bg-slate-200 text-slate-400'}`}>
                  <DoorOpen size={22} />
                </div>
                
                <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                  <button
                    onClick={(e) => { e.stopPropagation(); abrirEditar(aula); }}
                    className="p-2.5 bg-white border border-slate-100 rounded-xl shadow-sm hover:text-emerald-600 transition-all"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); cambiarEstadoAula(aula); }}
                    className={`p-2.5 bg-white border border-slate-100 rounded-xl shadow-sm transition-all ${aula.actividad === 1 ? 'hover:text-amber-500' : 'hover:text-emerald-500'}`}
                  >
                    {aula.actividad === 1 ? <ShieldOff size={14} /> : <ShieldCheck size={14} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md">{aula.clave}</span>
                  {aula.actividad === 1 && (
                    <ArrowUpRight size={14} className="text-slate-200 group-hover:text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  )}
                </div>
                <h3 className="text-lg font-black text-slate-700 leading-tight uppercase italic tracking-tighter group-hover:text-emerald-700 transition-colors">
                  {aula.nombre}
                </h3>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full bg-slate-50/50 border-2 border-dashed border-slate-100 rounded-[2.5rem] py-20 flex flex-col items-center justify-center">
              <DoorOpen size={48} className="text-slate-200 mb-4" />
              <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">No se encontraron aulas</p>
            </div>
          )}
        </div>
      )}

      {/* 🚪 MODAL DE AULA */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[200] p-4 animate-in fade-in duration-300">
          <div className="bg-white p-10 rounded-[2.5rem] w-full max-w-[420px] space-y-8 shadow-2xl border border-white">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-black italic tracking-tighter text-slate-800 uppercase leading-none">
                  {modoEdicion ? "Editar\nAula" : "Nueva\nAula"}
                </h3>
                <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mt-2">{nombreEdificio}</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Clave de Aula</label>
                <input
                  type="text"
                  value={aulaActual.clave}
                  onChange={(e) => setAulaActual({ ...aulaActual, clave: e.target.value })}
                  placeholder="Ej: A-101"
                  className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 focus:bg-white focus:border-emerald-500 outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Nombre del Aula</label>
                <input
                  type="text"
                  value={aulaActual.nombre}
                  onChange={(e) => setAulaActual({ ...aulaActual, nombre: e.target.value })}
                  placeholder="Ej: LABORATORIO DE REDES"
                  className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 focus:bg-white focus:border-emerald-500 outline-none transition-all uppercase"
                />
              </div>
            </div>

            <button
              onClick={guardarAula}
              className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 flex items-center justify-center gap-2"
            >
              <Settings2 size={16} /> {modoEdicion ? "Actualizar Aula" : "Registrar Aula"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
