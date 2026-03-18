import { useEffect, useState } from "react";
import { 
  Plus, Pencil, X, Search, ShieldOff, ShieldCheck, 
  Layers, LayoutGrid, CheckCircle2, AlertCircle 
} from "lucide-react";

const API_URL = "https://corporacionperris.com/backend/api/grupos.php";

export default function ActivosSection({ onOpenCategory }) {
  const [grupos, setGrupos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState("activos");

  const [form, setForm] = useState({
    idGrupo: null,
    nombre: "",
    clave: ""
  });

  const cargar = () => {
    fetch(API_URL, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "read" })
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) setGrupos(json.data);
      });
  };

  useEffect(() => {
    cargar();
  }, []);

  const gruposFiltrados = grupos.filter(g => {
    if (filtroEstado === "activos") return g.actividad == 1;
    if (filtroEstado === "inactivos") return g.actividad == 0;
    return true;
  }).filter(g =>
    g.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    (g.clave ?? "").toString().includes(busqueda)
  );

  const abrirNuevo = () => {
    setEditando(false);
    setForm({ idGrupo: null, nombre: "", clave: "" });
    setModal(true);
  };

  const abrirEditar = (grupo) => {
    setEditando(true);
    setForm({
      idGrupo: grupo.idGrupo,
      nombre: grupo.nombre,
      clave: grupo.clave
    });
    setModal(true);
  };

  const guardar = () => {
    if (!form.nombre.trim() || !form.clave.trim()) {
      alert("Todos los campos son obligatorios");
      return;
    }

    fetch(API_URL, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: editando ? "update" : "create",
        idGrupo: form.idGrupo,
        nombre: form.nombre,
        clave: form.clave
      })
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setModal(false);
          cargar();
        } else {
          alert(json.message || "Error");
        }
      });
  };

  const toggleActivo = (grupo) => {
    fetch(API_URL, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "toggle",
        idGrupo: grupo.idGrupo
      })
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) cargar();
      });
  };

  const totalGrupos = grupos.length;
  const activos = grupos.filter(g => g.actividad == 1).length;
  const inactivos = grupos.filter(g => g.actividad == 0).length;

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      
      {/* 🟢 HEADER PRINCIPAL */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200 rotate-3 transition-transform hover:rotate-0">
            <LayoutGrid size={28} className="text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-black italic tracking-tighter text-slate-800 uppercase">Gestión de Grupos</h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Control de Categorías de Inventario</p>
          </div>
        </div>

        <button
          onClick={abrirNuevo}
          className="bg-emerald-600 text-white px-8 py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 active:scale-95 font-black text-xs uppercase tracking-widest"
        >
          <Plus size={20} strokeWidth={3} />
          Nuevo Grupo
        </button>
      </div>

      {/* 🟢 BARRA DE CONTROL (Buscador + Filtros + KPIs) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* BUSCADOR Y SELECT */}
        <div className="lg:col-span-7 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 group">
            <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-600 transition-transform group-focus-within:scale-110" />
            <input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre o clave..."
              className="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-slate-100 bg-white focus:border-emerald-500 outline-none transition-all shadow-sm font-bold text-slate-600 placeholder:text-slate-300"
            />
          </div>

          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="bg-white border-2 border-slate-100 rounded-2xl px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500 outline-none focus:border-emerald-500 cursor-pointer shadow-sm transition-all"
          >
            <option value="activos">🟢 Activos</option>
            <option value="inactivos">🔴 Inactivos</option>
            <option value="todos">⚪ Todos</option>
          </select>
        </div>

        {/* KPIs ESTILIZADOS */}
        <div className="lg:col-span-5 flex gap-4">
          {[
            { label: 'Total', val: totalGrupos, color: 'emerald', icon: <Layers size={14}/> },
            { label: 'Activos', val: activos, color: 'emerald', icon: <CheckCircle2 size={14}/> },
            { label: 'Bajas', val: inactivos, color: 'slate', icon: <AlertCircle size={14}/> }
          ].map((kpi, i) => (
            <div key={i} className="flex-1 bg-white border border-slate-100 rounded-[1.8rem] p-4 shadow-sm flex flex-col items-center justify-center relative overflow-hidden group">
              <div className={`absolute top-0 right-0 w-12 h-12 bg-${kpi.color}-50 rounded-bl-[2rem] flex items-center justify-center text-${kpi.color}-500 opacity-50`}>
                {kpi.icon}
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{kpi.label}</p>
              <p className={`text-2xl font-black text-${kpi.color === 'emerald' ? 'emerald-600' : 'slate-500'}`}>{kpi.val}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 🟢 GRID DE CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {gruposFiltrados.map(grupo => (
          <div
            key={grupo.idGrupo}
            className={`group relative rounded-[2.5rem] p-8 shadow-sm transition-all duration-500 cursor-pointer border-2 overflow-hidden
              ${grupo.actividad == 1
                ? "bg-white border-slate-100 hover:border-emerald-400 hover:shadow-2xl hover:shadow-emerald-100 hover:-translate-y-2"
                : "bg-slate-50 border-slate-200 opacity-70 grayscale"
              }`}
            onClick={() => onOpenCategory(grupo)}
          >
            {/* Decoración de fondo */}
            <div className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full opacity-5 transition-transform group-hover:scale-150 ${grupo.actividad == 1 ? 'bg-emerald-600' : 'bg-slate-600'}`}></div>

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-colors ${grupo.actividad == 1 ? 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white' : 'bg-slate-200 text-slate-500'}`}>
                  <Layers size={22} />
                </div>
                
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                  <button
                    onClick={(e) => { e.stopPropagation(); abrirEditar(grupo); }}
                    className="p-2.5 bg-white border border-slate-100 rounded-xl shadow-lg hover:text-emerald-600 transition-colors"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleActivo(grupo); }}
                    className={`p-2.5 bg-white border border-slate-100 rounded-xl shadow-lg transition-colors ${grupo.actividad == 1 ? 'hover:text-red-500' : 'hover:text-emerald-500'}`}
                  >
                    {grupo.actividad == 1 ? <ShieldOff size={16} /> : <ShieldCheck size={16} />}
                  </button>
                </div>
              </div>

              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 mb-2 block">ID CLAVE: {grupo.clave}</span>
              <h3 className="text-xl font-black text-slate-800 leading-tight uppercase italic tracking-tighter group-hover:text-emerald-700 transition-colors">
                {grupo.nombre}
              </h3>

              {grupo.actividad != 1 && (
                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-red-500 rounded-lg">
                   <AlertCircle size={12} />
                   <span className="text-[10px] font-black uppercase">En pausa</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 🟢 MODAL ESTILIZADO */}
      {modal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[200] p-4 animate-in fade-in duration-300">
          <div className="bg-white p-10 rounded-[3rem] w-full max-w-[450px] space-y-8 shadow-2xl animate-in zoom-in duration-300 border border-white">
            
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black italic tracking-tighter text-slate-800 uppercase">
                  {editando ? "Editar Grupo" : "Crear Grupo"}
                </h3>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Completa los datos técnicos</p>
              </div>
              <button onClick={() => setModal(false)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Clave Numérica</label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={form.clave}
                  onChange={(e) => setForm({ ...form, clave: e.target.value.replace(/\D/g, "") })}
                  placeholder="Ej: 1020"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-700 focus:bg-white focus:border-emerald-500 outline-none transition-all shadow-inner"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nombre del Grupo</label>
                <input
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  placeholder="Ej: MOBILIARIO DE OFICINA"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-700 focus:bg-white focus:border-emerald-500 outline-none transition-all shadow-inner uppercase"
                />
              </div>
            </div>

            <button
              onClick={guardar}
              className="w-full bg-emerald-600 text-white py-5 rounded-[1.8rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 active:scale-95"
            >
              {editando ? "Actualizar Registro" : "Registrar Grupo"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
