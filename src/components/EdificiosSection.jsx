import { useEffect, useState, useMemo } from "react";
import { 
  Search, Building2, Plus, Pencil, X, 
  ShieldOff, ShieldCheck, MapPin, 
  Settings2, ArrowUpRight
} from "lucide-react";

const API_URL = "https://corporacionperris.com/backend/api/edificios.php";

export default function EdificiosSection({ onSelectEdificio }) {
  const [search, setSearch] = useState("");
  const [catalogoEdificios, setCatalogoEdificios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState("activos");
  const [showModal, setShowModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  
  const [edificioActual, setEdificioActual] = useState({
    idEdificio: null,
    nombre: "",
    clave: ""
  });

  const cargarEdificios = () => {
    setLoading(true);
    fetch(`${API_URL}?estado=${filtroEstado}`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setCatalogoEdificios(json.data);
      })
      .catch((err) => console.error("Error:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    cargarEdificios();
  }, [filtroEstado]);

  const filtered = useMemo(() => {
    return catalogoEdificios.filter((e) =>
      e.nombre.toLowerCase().includes(search.toLowerCase()) ||
      e.clave.toString().includes(search)
    );
  }, [catalogoEdificios, search]);

  const abrirCrear = () => {
    setModoEdicion(false);
    setEdificioActual({ idEdificio: null, nombre: "", clave: "" });
    setShowModal(true);
  };

  const abrirEditar = (edificio) => {
    setModoEdicion(true);
    setEdificioActual({
      idEdificio: edificio.idEdificio,
      nombre: edificio.nombre,
      clave: edificio.clave
    });
    setShowModal(true);
  };

  const guardarEdificio = async () => {
    if (!edificioActual.nombre || !edificioActual.clave) {
      alert("Completa todos los campos");
      return;
    }
    const metodo = modoEdicion ? "PUT" : "POST";
    try {
      const bodyData = { nombre: edificioActual.nombre, clave: edificioActual.clave };
      if (modoEdicion) bodyData.idEdificio = edificioActual.idEdificio;

      const response = await fetch(API_URL, {
        method: metodo,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const json = await response.json();
      if (json.success) {
        setShowModal(false);
        cargarEdificios();
      }
    } catch (error) {
      alert("Error de conexión");
    }
  };

  const cambiarEstadoEdificio = async (edificio) => {
    if (!window.confirm(`¿Seguro que deseas cambiar el estado de ${edificio.nombre}?`)) return;
    try {
      const response = await fetch(API_URL, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idEdificio: edificio.idEdificio }),
      });
      const json = await response.json();
      if (json.success) cargarEdificios();
    } catch (error) {
      alert("Error de conexión");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* 🏢 HEADER INTEGRADO CON BÚSQUEDA */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-100 transition-transform hover:scale-105">
            <Building2 size={24} className="text-white" />
          </div>
          <h2 className="text-3xl font-black italic tracking-tighter text-slate-800 uppercase">Edificios</h2>
        </div>

        {/* CONTROLES DEL HEADER */}
        <div className="flex flex-col md:flex-row items-center gap-4 flex-1 max-w-4xl justify-end">
          <div className="relative w-full md:w-96 group">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 group-focus-within:scale-110 transition-transform" />
            <input
              type="text"
              placeholder="Buscar edificio..."
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
              <option value="activos">🟢 Activos</option>
              <option value="inactivos">🔴 Inactivos</option>
            </select>

            <button
              onClick={abrirCrear}
              className="bg-emerald-600 text-white px-6 py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-50 active:scale-95 font-black text-[11px] uppercase tracking-widest whitespace-nowrap"
            >
              <Plus size={18} strokeWidth={3} />
              Nuevo Edificio
            </button>
          </div>
        </div>
      </div>

      {/* 📦 GRID DE CARDS */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Cargando Edificios...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((edificio) => (
            <div
              key={edificio.idEdificio}
              onClick={() => edificio.actividad === 1 && onSelectEdificio(edificio)}
              className={`group relative rounded-[2rem] p-7 transition-all duration-500 border-2 cursor-pointer overflow-hidden
                ${edificio.actividad === 0 
                  ? "bg-slate-50 border-slate-100 opacity-60" 
                  : "bg-white border-slate-50 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-100/20 hover:-translate-y-1"}`}
            >
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-5">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${edificio.actividad === 1 ? 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white group-hover:rotate-6' : 'bg-slate-200 text-slate-400'}`}>
                    <MapPin size={22} />
                  </div>
                  
                  {/* ACCIONES FLOTANTES */}
                  <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                    <button
                      onClick={(e) => { e.stopPropagation(); abrirEditar(edificio); }}
                      className="p-2.5 bg-white border border-slate-100 rounded-xl shadow-sm hover:text-emerald-600 hover:border-emerald-200 transition-all"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); cambiarEstadoEdificio(edificio); }}
                      className={`p-2.5 bg-white border border-slate-100 rounded-xl shadow-sm transition-all ${edificio.actividad === 1 ? 'hover:text-amber-500 hover:border-amber-200' : 'hover:text-emerald-500 hover:border-emerald-200'}`}
                    >
                      {edificio.actividad === 1 ? <ShieldOff size={14} /> : <ShieldCheck size={14} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md">{edificio.clave}</span>
                    {edificio.actividad === 1 && (
                      <ArrowUpRight size={14} className="text-slate-200 group-hover:text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    )}
                  </div>
                  <h3 className="text-lg font-black text-slate-700 leading-tight uppercase italic tracking-tighter group-hover:text-emerald-700 transition-colors">
                    {edificio.nombre}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🏢 MODAL REDUCIDO */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[200] p-4 animate-in fade-in duration-300">
          <div className="bg-white p-10 rounded-[2.5rem] w-full max-w-[420px] space-y-8 shadow-2xl border border-white">
            <div className="flex justify-between items-start">
              <h3 className="text-2xl font-black italic tracking-tighter text-slate-800 uppercase leading-none">
                {modoEdicion ? "Editar\nEdificio" : "Nuevo\nEdificio"}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Clave del Edificio</label>
                <input
                  type="text"
                  value={edificioActual.clave}
                  onChange={(e) => setEdificioActual({ ...edificioActual, clave: e.target.value })}
                  placeholder="Ej: ED-A"
                  className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 focus:bg-white focus:border-emerald-500 outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Nombre Completo</label>
                <input
                  type="text"
                  value={edificioActual.nombre}
                  onChange={(e) => setEdificioActual({ ...edificioActual, nombre: e.target.value })}
                  placeholder="Ej: EDIFICIO ACADÉMICO A"
                  className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 focus:bg-white focus:border-emerald-500 outline-none transition-all uppercase"
                />
              </div>
            </div>

            <button
              onClick={guardarEdificio}
              className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 flex items-center justify-center gap-2"
            >
              <Settings2 size={16} /> {modoEdicion ? "Guardar Cambios" : "Crear Registro"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
