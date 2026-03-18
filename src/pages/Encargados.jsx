import React, { useState, useEffect } from "react";
import { 
  Search, ChevronRight, ArrowLeft, Plus, 
  Trash2, Loader2, X, Package, CheckCircle2, AlertTriangle, 
  Mail, Tag, Calendar, DollarSign, FileText, CheckSquare, Square, User
} from "lucide-react";

export default function Encargados() {
  const [encargados, setEncargados] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [docenteSeleccionado, setDocenteSeleccionado] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [inventario, setInventario] = useState([]);
  const [activosAsignados, setActivosAsignados] = useState([]);
  const [busquedaActivo, setBusquedaActivo] = useState("");
  const [seleccionados, setSeleccionados] = useState([]); 
  const [filtroPreset, setFiltroPreset] = useState("todos");
  const [asignando, setAsignando] = useState(false);

  const API_URL = "https://corporacionperris.com/backend/api/encargos.php";

  useEffect(() => { fetchDocentes(); }, []);

  useEffect(() => {
    if (showModal) {
      const cargarDatosModal = async () => {
        try {
          const [resInv, resEnc] = await Promise.all([
            fetch(`${API_URL}?ver_inventario=1`),
            fetch(API_URL)
          ]);
          const dataInv = await resInv.json();
          const dataEnc = await resEnc.json();
          if (dataInv.success) setInventario(dataInv.inventario || []);
          if (dataEnc.success) setActivosAsignados(dataEnc.data.map(e => e.id_activo));
        } catch (error) { console.error(error); }
      };
      cargarDatosModal();
      setSeleccionados([]); 
    }
  }, [showModal]);

  const fetchDocentes = async () => {
    try {
      const res = await fetch(`${API_URL}?ver_usuarios=1`);
      const json = await res.json();
      if (json.success) setEncargados(json.usuarios || []);
    } catch (error) { console.error(error); }
    setLoading(false);
  };

  const seleccionarDocente = async (docente) => {
    const res = await fetch(`${API_URL}?id_encargado=${docente.id}`);
    const json = await res.json();
    if (json.success) setDocenteSeleccionado({ ...docente, activos: json.data || [] });
  };

  const renderMarbete = (item) => {
    const ed = item.edificio_clv || "??";
    const au = item.aula_clv || "??";
    const gr = item.grupo_clv || "??";
    const clv = item.clave || item.clave_activo || "??";
    return `${ed}-${au}-${gr}-${clv}`;
  };

  const toggleSeleccion = (id) => {
    setSeleccionados(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleAsignarMultiple = async () => {
    if (seleccionados.length === 0) return;
    setAsignando(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_encargado: docenteSeleccionado.id,
          ids_activos: seleccionados
        })
      });
      const res = await response.json();
      if (res.success) {
        setShowModal(false);
        seleccionarDocente(docenteSeleccionado);
      }
    } catch (error) { alert("Error al asignar"); }
    finally { setAsignando(false); }
  };

  const eliminarAsignacion = async (idEncargo) => {
    if (!window.confirm("¿Liberar activo del resguardo?")) return;
    const res = await fetch(API_URL, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_encargo: idEncargo })
    });
    if ((await res.json()).success) seleccionarDocente(docenteSeleccionado);
  };

  const itemsFiltrados = (inventario || []).filter(item => {
    const yaAsignado = activosAsignados.includes(item.idActivo);
    const busquedaLower = busquedaActivo.toLowerCase();
    const cumpleBusqueda = 
      item.nombre?.toLowerCase().includes(busquedaLower) || 
      item.clave?.toLowerCase().includes(busquedaLower) ||
      item.referencia?.toLowerCase().includes(busquedaLower) ||
      item.edificio_clv?.toLowerCase().includes(busquedaLower);
    
    let cumplePreset = true;
    if (filtroPreset === "alto_valor") cumplePreset = parseFloat(item.importe) > 10000;

    return !yaAsignado && cumpleBusqueda && cumplePreset;
  });

  const seleccionarTodosVisibles = () => {
    const ids = itemsFiltrados.map(i => i.idActivo);
    setSeleccionados(ids);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-slate-50">
      <Loader2 className="animate-spin text-emerald-600" size={44} />
    </div>
  );

  if (!docenteSeleccionado) {
    return (
      <div className="p-7 max-w-7xl mx-auto space-y-7 animate-in fade-in duration-500">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <h1 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">Control de Resguardos</h1>
            <p className="text-emerald-600 font-bold text-xs uppercase tracking-[0.2em]">Gestión de Activos por Personal</p>
          </div>
          <div className="relative w-full md:w-85">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por nombre o empleado..." 
              className="w-full pl-12 pr-6 py-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-bold text-sm"
              value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {encargados.filter(e => e.nombre.toLowerCase().includes(busqueda.toLowerCase()) || e.numEmpleado.toString().includes(busqueda)).map(doc => (
            <div 
              key={doc.id} 
              onClick={() => seleccionarDocente(doc)} 
              className="group bg-white rounded-[2.5rem] p-7 shadow-sm border border-slate-100 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-100/50 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between h-full"
            >
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-5">
                  <div className="w-14 h-14 bg-emerald-600 text-white rounded-[1.2rem] flex items-center justify-center text-2xl font-black italic shadow-lg shadow-emerald-200 group-hover:scale-110 transition-transform">
                    {doc.nombre.charAt(0)}
                  </div>
                  <div className="bg-slate-50 text-slate-400 p-2 rounded-xl group-hover:text-emerald-500 transition-colors">
                    <ChevronRight size={20} />
                  </div>
                </div>

                <h3 className="text-sm font-black text-slate-800 uppercase italic leading-tight mb-3 group-hover:text-emerald-700 transition-colors truncate">
                  {doc.nombre}
                </h3>

                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-xl border border-emerald-100 w-fit">
                    <Tag size={12} strokeWidth={3} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{doc.rol || "Docente"}</span>
                  </div>
                  
                  <div className="flex flex-col gap-1.5 px-1">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Package size={12} />
                      <span className="text-[10px] font-bold uppercase tracking-tight">Empleado #{doc.numEmpleado}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Mail size={12} />
                      <span className="text-[10px] font-bold truncate lowercase italic">{doc.correo || "sin_correo@utn.edu.mx"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decoración sutil de fondo */}
              <div className="absolute -right-4 -bottom-4 text-slate-50 group-hover:text-emerald-50 transition-colors -rotate-12">
                <User size={80} strokeWidth={4} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-7 max-w-7xl mx-auto space-y-7 animate-in slide-in-from-bottom-5 duration-500">
      <button onClick={() => setDocenteSeleccionado(null)} className="flex items-center gap-2 text-slate-400 hover:text-emerald-600 font-black text-xs uppercase tracking-widest transition-all"><ArrowLeft size={16}/> Volver al listado</button>

      <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-[3rem] p-9 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h2 className="text-4xl font-black italic uppercase tracking-tighter leading-none mb-4">{docenteSeleccionado.nombre}</h2>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2.5 bg-white/10 px-4 py-2 rounded-full border border-white/20"><Mail size={14} className="text-emerald-300"/><span className="text-xs font-bold">{docenteSeleccionado.correo}</span></div>
              <div className="flex items-center gap-2.5 bg-white/10 px-4 py-2 rounded-full border border-white/20"><Tag size={14} className="text-emerald-300"/><span className="text-xs font-bold uppercase tracking-widest">{docenteSeleccionado.rol}</span></div>
            </div>
          </div>
          <button onClick={() => setShowModal(true)} className="bg-white hover:bg-emerald-50 text-emerald-700 px-9 py-4.5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-xl transition-all active:scale-95"><Plus size={20} strokeWidth={3}/> Asignar Activos</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {docenteSeleccionado.activos?.length > 0 ? docenteSeleccionado.activos.map(act => (
          <div key={act.id_encargo} className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm hover:shadow-lg transition-all relative group">
            <div className="flex justify-between items-start mb-5">
              <span className="bg-emerald-50 text-emerald-600 text-[9px] font-black px-3 py-1.5 rounded-xl border border-emerald-100 uppercase tracking-wider">
                MARBETE: {renderMarbete(act)}
              </span>
              <button onClick={() => eliminarAsignacion(act.id_encargo)} className="w-10 h-10 flex items-center justify-center bg-red-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={18} /></button>
            </div>
            <h4 className="text-base font-black text-slate-800 uppercase italic mb-4 leading-tight">{act.nombre_activo}</h4>
            <div className="grid grid-cols-2 gap-3 pt-5 border-t border-slate-100">
                <div className="space-y-1"><p className="text-[8px] font-black text-slate-300 uppercase">Valor</p><div className="flex items-center gap-1 text-emerald-600 font-black text-xs"><DollarSign size={12}/> {parseFloat(act.importe || 0).toLocaleString()}</div></div>
                <div className="space-y-1"><p className="text-[8px] font-black text-slate-300 uppercase">Ref.</p><div className="flex items-center gap-1 text-slate-600 font-bold text-[10px] truncate"><FileText size={12}/> {act.referencia || 'N/A'}</div></div>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem] flex flex-col items-center justify-center">
            <AlertTriangle className="text-slate-200 mb-3" size={40} />
            <p className="text-slate-400 font-black uppercase text-xs tracking-widest">Sin equipos asignados</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-md p-4">
          <div className="bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-emerald-50/30">
              <div>
                <h3 className="text-2xl font-black uppercase italic text-slate-800">Panel de Asignación</h3>
                <p className="text-emerald-600 font-bold text-[10px] uppercase tracking-widest">Seleccionados: {seleccionados.length} activos</p>
              </div>
              <button onClick={() => setShowModal(false)} className="w-11 h-11 bg-white rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all shadow-md"><X size={22}/></button>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="text" placeholder="Buscar por marbete, edificio, nombre..." className="w-full pl-13 pr-7 py-4 bg-slate-100 border-none rounded-2xl outline-none font-bold text-sm" onChange={(e) => setBusquedaActivo(e.target.value)} />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setFiltroPreset("todos")} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${filtroPreset === "todos" ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'bg-slate-100 text-slate-400'}`}>Todos</button>
                  <button onClick={() => setFiltroPreset("alto_valor")} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${filtroPreset === "alto_valor" ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'bg-slate-100 text-slate-400'}`}>+ $10k</button>
                </div>
              </div>

              <div className="flex justify-between items-center px-2">
                <button onClick={seleccionarTodosVisibles} className="text-emerald-600 font-black text-[10px] uppercase tracking-widest hover:underline decoration-2 underline-offset-4">Seleccionar visibles</button>
                <button onClick={() => setSeleccionados([])} className="text-slate-400 font-black text-[10px] uppercase tracking-widest hover:underline decoration-2 underline-offset-4">Limpiar</button>
              </div>

              <div className="max-h-[350px] overflow-y-auto pr-3 space-y-3 custom-scrollbar">
                {itemsFiltrados.length > 0 ? itemsFiltrados.map(item => (
                  <div 
                    key={item.idActivo} 
                    onClick={() => toggleSeleccion(item.idActivo)} 
                    className={`flex justify-between items-center p-5 rounded-2xl border transition-all cursor-pointer group ${seleccionados.includes(item.idActivo) ? 'border-emerald-500 bg-emerald-50/50 shadow-md' : 'border-slate-100 bg-white hover:border-emerald-300'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${seleccionados.includes(item.idActivo) ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-100 text-slate-200 group-hover:bg-emerald-100'}`}>
                        {seleccionados.includes(item.idActivo) ? <CheckSquare size={18}/> : <Square size={18}/>}
                      </div>
                      <div>
                        <div className="flex gap-2 items-center mb-0.5">
                          <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                            {renderMarbete(item)}
                          </span>
                          <span className="text-[8px] font-bold text-slate-300 uppercase truncate max-w-[100px]">Ref: {item.referencia || 'S/R'}</span>
                        </div>
                        <p className="text-sm font-black uppercase italic text-slate-800">{item.nombre}</p>
                        <p className="text-[10px] font-bold text-emerald-500 tracking-tight">${parseFloat(item.importe || 0).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-10 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                    <p className="text-slate-400 font-black uppercase text-[10px]">No se encontraron activos</p>
                  </div>
                )}
              </div>

              <button 
                onClick={handleAsignarMultiple}
                disabled={seleccionados.length === 0 || asignando}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 text-white py-5 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-emerald-200 transition-all flex items-center justify-center gap-3 active:scale-95"
              >
                {asignando ? <Loader2 className="animate-spin" /> : <><CheckCircle2 size={20}/> Confirmar {seleccionados.length} Resguardos</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
