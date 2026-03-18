import React, { useState, useEffect } from "react";
import { 
  User, Search, Info, ShieldCheck, AlertCircle, Loader2, 
  Package, DollarSign, FileText, ChevronRight, Tag 
} from "lucide-react";
import ActivoModal from "../components/ActivoModal";

export default function MisEncargos() {
  const [activos, setActivos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [usuario, setUsuario] = useState({ id: null, nombre: "Cargando...", rol: "Docente" });
  const [activoParaDetalle, setActivoParaDetalle] = useState(null);

  const API_URL = "https://corporacionperris.com/backend/api/encargos.php";

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
          const resActivos = await fetch(`${API_URL}?id_encargado=${tempId}`);
          const data = await resActivos.json();
          if (data.success) setActivos(data.data);
        } catch (err) { console.error(err); }
      }
      setLoading(false);
    };
    cargarTodo();
  }, []);

  const renderMarbete = (item) => {
    const ed = item.edificio_clv || "??";
    const au = item.aula_clv || "??";
    const gr = item.grupo_clv || "??";
    const clv = item.clave_activo || "??";
    return `${ed}-${au}-${gr}-${clv}`;
  };

  const filtrados = activos.filter(a => 
    a.nombre_activo?.toLowerCase().includes(busqueda.toLowerCase()) ||
    a.clave_activo?.toLowerCase().includes(busqueda.toLowerCase()) ||
    renderMarbete(a).toLowerCase().includes(busqueda.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-slate-50">
      <Loader2 className="animate-spin text-emerald-600" size={44} />
    </div>
  );

  return (
    <div className="p-7 max-w-7xl mx-auto space-y-7 animate-in fade-in duration-500">
      
      {/* HEADER VERDE CON BUSCADOR INTEGRADO */}
      <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-[3rem] p-9 text-white shadow-2xl relative overflow-hidden">
        {/* Decoración de fondo */}
        <div className="absolute -right-6 -bottom-6 text-white/10 -rotate-12">
          <ShieldCheck size={200} strokeWidth={1} />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-[2rem] flex items-center justify-center border border-white/30 shadow-lg">
              <User size={40} strokeWidth={2.5} />
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-4xl font-black italic uppercase tracking-tighter leading-none mb-3">
                {usuario.nombre}
              </h2>
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-3">
                <div className="flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full border border-white/20">
                  <Tag size={14} className="text-emerald-300"/>
                  <span className="text-[10px] font-black uppercase tracking-widest">{usuario.rol}</span>
                </div>
                <span className="text-emerald-100/70 font-bold text-xs">ID: #{usuario.id}</span>
                <span className="bg-emerald-500/40 px-3 py-1 rounded-lg text-[10px] font-black border border-emerald-400/30 italic">
                  {activos.length} EQUIPOS
                </span>
              </div>
            </div>
          </div>

          {/* BARRA DE BÚSQUEDA INTEGRADA EN EL HEADER */}
          <div className="relative w-full lg:w-96 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-200 group-focus-within:text-white transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Buscar en mi resguardo..." 
              className="w-full pl-13 pr-6 py-4 bg-white/10 border border-white/20 rounded-2xl outline-none focus:bg-white/20 focus:border-white/40 transition-all font-bold text-sm placeholder:text-emerald-200/50 text-white"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* GRID DE ACTIVOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtrados.length > 0 ? (
          filtrados.map((act) => (
            <div 
              key={act.id_encargo} 
              onClick={() => setActivoParaDetalle(act)}
              className="group bg-white rounded-[2.5rem] p-7 border border-slate-100 shadow-sm hover:border-emerald-500 hover:shadow-xl hover:-translate-y-2 active:scale-95 transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col justify-between"
            >
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-5">
                  <span className="bg-emerald-50 text-emerald-600 text-[9px] font-black px-3 py-1.5 rounded-xl border border-emerald-100 uppercase tracking-wider">
                    MARBETE: {renderMarbete(act)}
                  </span>
                  <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
                    <Package size={18} />
                  </div>
                </div>

                <h4 className="text-base font-black uppercase italic mb-4 leading-tight text-slate-800 group-hover:text-emerald-700 transition-colors">
                  {act.nombre_activo}
                </h4>
                
                <div className="grid grid-cols-2 gap-3 pt-5 border-t border-slate-100">
                  <div className="space-y-1">
                    <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Valor</p>
                    <div className="flex items-center gap-1 text-emerald-600 font-black text-xs">
                      <DollarSign size={12} strokeWidth={3}/> 
                      {parseFloat(act.importe || 0).toLocaleString()}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Folio</p>
                    <div className="flex items-center gap-1 text-slate-600 font-bold text-[10px] truncate">
                      <FileText size={12}/> {act.folioVR || 'N/A'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Marca de agua decorativa en la tarjeta */}
              <div className="absolute -right-4 -bottom-4 text-slate-50 group-hover:text-emerald-50 transition-colors -rotate-12">
                <ShieldCheck size={80} strokeWidth={4} />
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem] flex flex-col items-center justify-center">
            <AlertCircle className="text-slate-200 mb-3" size={40} />
            <p className="text-slate-400 font-black uppercase text-xs tracking-widest">Sin resultados en tu resguardo</p>
          </div>
        )}
      </div>

      {/* MODAL PRO */}
      {activoParaDetalle && (
        <ActivoModal 
          activo={{
            ...activoParaDetalle,
            nombre: activoParaDetalle.nombre_activo,
            clave: activoParaDetalle.clave_activo,
            marbete: renderMarbete(activoParaDetalle),
            importe: activoParaDetalle.importe,
            referencia: activoParaDetalle.referencia,
            fecha_documento: activoParaDetalle.fecha_adquisicion,
            fecha: activoParaDetalle.fecha_adquisicion,
            edificio: activoParaDetalle.edificio_clv,
            aula: activoParaDetalle.aula_clv,
            grupo: activoParaDetalle.grupo_clv,
            descripcion: activoParaDetalle.descripcion || "Información técnica resguardada por el usuario.",
            tipo_documento: activoParaDetalle.tipo_documento || "Asignación Directa",
            folioVR: activoParaDetalle.folioVR || "N/A",
            actividad: 1 
          }}
          // FORZAMOS MODO LECTURA
          isReadOnly={true} 
          editMode={false} 
          setEditMode={() => {}} // Función vacía para que no haga nada
          onClose={() => setActivoParaDetalle(null)}
          onSave={() => {}}
        />
      )}
    </div>
  );
}
