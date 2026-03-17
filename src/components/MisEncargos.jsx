import React, { useState, useEffect } from "react";
import { User, MapPin, Search, Info, ShieldCheck, AlertCircle, Loader2, X } from "lucide-react";
export default function MisEncargos() {
  const [activos, setActivos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [usuario, setUsuario] = useState({ id: null, nombre: "Victor Salcido", rol: "Docente" });
  const [seleccionado, setSeleccionado] = useState(null); // Para el modal de detalles

  useEffect(() => {
    const cargarTodo = async () => {
      let tempId = null;
      try {
        const res = await fetch("https://corporacionperris.com/backend/api/me.php", { credentials: "include" });
        const j = await res.json();
        
        if (j.success && j.usuario) {
          tempId = j.usuario.id || j.usuario.id_usuario || j.usuario.id_persona;
          setUsuario({ id: tempId, nombre: j.usuario.nombre, rol: j.usuario.rol });
        } else {
          const localData = localStorage.getItem("sesion_activa");
          if (localData) {
            const u = JSON.parse(localData);
            tempId = u.id || u.id_usuario || u.id_persona;
            setUsuario({ id: tempId, nombre: u.nombre, rol: u.rol });
          }
        }
      } catch (e) { console.error(e); }

      if (tempId) {
        try {
          const resActivos = await fetch(`https://corporacionperris.com/backend/api/encargos.php?id_encargado=${tempId}`);
          const data = await resActivos.json();
          if (data.success) setActivos(data.data);
        } catch (err) { console.error(err); }
      }
      setLoading(false);
    };
    cargarTodo();
  }, []);

  const filtrados = activos.filter(a => 
    a.nombre_activo?.toLowerCase().includes(busqueda.toLowerCase()) ||
    a.clave_activo?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700 relative">
      
      {/* HEADER */}
      <div className="bg-[#0f172a] rounded-[3rem] p-10 shadow-2xl flex flex-col md:flex-row justify-between items-center border border-slate-800">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-emerald-600 rounded-[2rem] flex items-center justify-center text-white shadow-lg">
            <User size={40} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">
              {usuario.nombre}
            </h1>
            <p className="text-emerald-400 font-bold text-xs uppercase tracking-[0.2em]">
              {usuario.rol} • <span className="text-white">ID: #{usuario.id || "..."}</span>
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-slate-500 font-bold text-[10px] uppercase mb-1 tracking-widest">Activos en resguardo</p>
          <p className="text-7xl font-black text-emerald-500 italic leading-none">{activos.length}</p>
        </div>
      </div>

      {/* BUSCADOR */}
      <div className="relative max-w-2xl mx-auto">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-600" size={20} />
        <input 
          type="text" 
          placeholder="Filtrar por nombre o clave..." 
          className="w-full pl-16 pr-8 py-5 bg-white rounded-full shadow-xl border-none outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-sm transition-all"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {/* GRID DE ACTIVOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full py-20 text-center"><Loader2 className="animate-spin mx-auto text-emerald-500" size={48} /></div>
        ) : filtrados.length > 0 ? (
          filtrados.map((act) => (
            <div key={act.id_encargo} className="bg-white rounded-[3rem] p-8 shadow-xl border border-slate-50 hover:scale-[1.02] transition-all group">
              <div className="flex justify-between mb-6">
                <span className="bg-slate-900 text-white text-[9px] font-black px-4 py-2 rounded-xl uppercase italic tracking-widest">{act.clave_activo || "S/N"}</span>
                <ShieldCheck className="text-emerald-500" size={22} />
              </div>
              <h3 className="text-2xl font-black text-slate-800 uppercase italic mb-6 leading-tight group-hover:text-emerald-600 transition-colors">{act.nombre_activo}</h3>
              
              <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase mb-8">
                <MapPin size={16} className="text-emerald-500" /> ID: <b className="text-slate-700">{act.id_activo}</b>
              </div>

              <button 
                onClick={() => setSeleccionado(act)}
                className="w-full py-4 bg-slate-50 text-slate-900 rounded-2xl font-black text-[9px] uppercase tracking-[0.2em] hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <Info size={14} /> Ver detalles del activo
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-full py-24 text-center bg-white rounded-[4rem] border-4 border-dashed border-slate-100">
            <AlertCircle size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-400 font-black uppercase text-xs tracking-widest">No hay activos asignados</p>
          </div>
        )}
      </div>

      {/* MODAL DE INFORMACIÓN (Se abre al dar clic) */}
      {seleccionado && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] p-10 max-w-lg w-full shadow-2xl relative animate-in zoom-in duration-300">
            <button onClick={() => setSeleccionado(null)} className="absolute top-8 right-8 text-slate-400 hover:text-red-500 transition-colors">
              <X size={30} />
            </button>
            
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
              <Info size={32} />
            </div>

            <h2 className="text-3xl font-black text-slate-900 uppercase italic mb-2">{seleccionado.nombre_activo}</h2>
            <p className="text-emerald-500 font-black text-xs uppercase tracking-widest mb-8">Información General</p>

            <div className="space-y-4">
              <div className="bg-slate-50 p-5 rounded-2xl flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase">Clave de Inventario</span>
                <span className="text-sm font-black text-slate-800">{seleccionado.clave_activo || "N/A"}</span>
              </div>
              <div className="bg-slate-50 p-5 rounded-2xl flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase">ID del Sistema</span>
                <span className="text-sm font-black text-slate-800">#{seleccionado.id_activo}</span>
              </div>
              <div className="bg-slate-50 p-5 rounded-2xl flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase">Estado</span>
                <span className="bg-emerald-500 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase">Asignado</span>
              </div>
            </div>

            <button 
              onClick={() => setSeleccionado(null)}
              className="w-full mt-8 py-5 bg-[#0f172a] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all"
            >
              Cerrar Ventana
            </button>
          </div>
        </div>
      )}
    </div>
  );
}