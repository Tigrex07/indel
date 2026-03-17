import React, { useState, useEffect } from "react";
import { 
  Users, Search, ChevronRight, ArrowLeft, Plus, 
  Trash2, Loader2, X, Package, CheckCircle2, AlertTriangle 
} from "lucide-react";

export default function Encargados() {
  const [encargados, setEncargados] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [docenteSeleccionado, setDocenteSeleccionado] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [inventario, setInventario] = useState([]); // Equipos totales
  const [activosAsignados, setActivosAsignados] = useState([]); // IDs de lo que ya está ocupado
  const [busquedaActivo, setBusquedaActivo] = useState("");
  const [asignando, setAsignando] = useState(null);

  const API_URL = "https://corporacionperris.com/backend/api/encargos.php";

  useEffect(() => { fetchDocentes(); }, []);

  // Al abrir el modal, traemos el inventario y también TODOS los encargos actuales para comparar
  useEffect(() => {
    if (showModal) {
      const cargarDatosModal = async () => {
        const [resInv, resEnc] = await Promise.all([
          fetch(`${API_URL}?ver_inventario=1`),
          fetch(API_URL) // Trae todos los encargos existentes
        ]);
        const dataInv = await resInv.json();
        const dataEnc = await resEnc.json();
        
        if (dataInv.success) setInventario(dataInv.inventario);
        if (dataEnc.success) {
          // Guardamos solo los IDs de los activos que ya están en uso
          const ocupados = dataEnc.data.map(e => e.id_activo);
          setActivosAsignados(ocupados);
        }
      };
      cargarDatosModal();
    }
  }, [showModal]);

  const fetchDocentes = async () => {
    const res = await fetch(`${API_URL}?ver_usuarios=1`);
    const json = await res.json();
    if (json.success) setEncargados(json.usuarios);
    setLoading(false);
  };

  const seleccionarDocente = async (docente) => {
    const res = await fetch(`${API_URL}?id_encargado=${docente.id}`);
    const json = await res.json();
    if (json.success) setDocenteSeleccionado({ ...docente, activos: json.data });
  };

  const handleAsignar = async (idActivo) => {
    setAsignando(idActivo);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_encargado: docenteSeleccionado.id,
          id_activo: idActivo
        })
      });
      const res = await response.json();
      if (res.success) {
        setShowModal(false);
        seleccionarDocente(docenteSeleccionado);
      }
    } catch (error) {
      alert("Error al conectar con el servidor");
    } finally {
      setAsignando(null);
    }
  };

  const eliminarAsignacion = async (idEncargo) => {
    if (!window.confirm("¿Deseas liberar este activo del resguardo?")) return;
    const res = await fetch(API_URL, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_encargo: idEncargo })
    });
    const result = await res.json();
    if (result.success) seleccionarDocente(docenteSeleccionado);
  };

  // Filtrar inventario: Solo lo que NO esté asignado ya
  const inventarioDisponible = inventario.filter(item => 
    !activosAsignados.includes(item.idActivo) &&
    (item.nombre.toLowerCase().includes(busquedaActivo.toLowerCase()) || 
     item.clave.toLowerCase().includes(busquedaActivo.toLowerCase()))
  );

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-slate-50">
      <Loader2 className="animate-spin text-emerald-500" size={48} />
    </div>
  );

  if (!docenteSeleccionado) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter">Control de Resguardos</h1>
            <p className="text-emerald-600 font-bold text-xs uppercase tracking-[0.3em]">Gestión de Activos por Personal</p>
          </div>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar docente..." 
              className="w-full pl-12 pr-6 py-4 bg-white border-none rounded-3xl shadow-xl shadow-slate-200/50 outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-bold text-sm"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {encargados.filter(e => e.nombre.toLowerCase().includes(busqueda.toLowerCase())).map(doc => (
            <div 
              key={doc.id} 
              onClick={() => seleccionarDocente(doc)} 
              className="group bg-white rounded-[3rem] p-8 shadow-xl shadow-slate-200/40 border border-transparent hover:border-emerald-500 hover:scale-[1.02] transition-all cursor-pointer relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-2xl font-black italic transform group-hover:rotate-12 transition-transform">
                  {doc.nombre.charAt(0)}
                </div>
                <ChevronRight className="text-slate-200 group-hover:text-emerald-500 transition-colors" size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-800 uppercase italic leading-tight">{doc.nombre}</h3>
              <p className="text-[10px] font-black text-emerald-500 mt-2 tracking-widest uppercase bg-emerald-50 w-fit px-3 py-1 rounded-full">Emp: #{doc.numEmpleado}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in slide-in-from-bottom-8 duration-500">
      <button 
        onClick={() => setDocenteSeleccionado(null)} 
        className="flex items-center gap-2 text-slate-400 hover:text-emerald-600 font-black text-xs uppercase tracking-widest transition-all"
      >
        <ArrowLeft size={16}/> Volver al listado
      </button>

      <div className="bg-slate-900 rounded-[4rem] p-12 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full -mr-20 -mt-20 blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <h2 className="text-5xl font-black italic uppercase tracking-tighter leading-none mb-4">{docenteSeleccionado.nombre}</h2>
            <div className="flex items-center gap-4">
              <span className="text-emerald-400 font-black text-xs uppercase tracking-[0.3em]">Personal Activo</span>
              <span className="h-1 w-1 bg-slate-700 rounded-full" />
              <span className="text-slate-400 font-bold text-xs">ID: {docenteSeleccionado.numEmpleado}</span>
            </div>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-2xl shadow-emerald-500/30 transition-all active:scale-95"
          >
            <Plus size={20} strokeWidth={3}/> Asignar Activo
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {docenteSeleccionado.activos?.length > 0 ? docenteSeleccionado.activos.map(act => (
          <div key={act.id_encargo} className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/40 relative group">
            <div className="flex justify-between items-start mb-6">
              <span className="bg-emerald-50 text-emerald-600 text-[9px] font-black px-4 py-2 rounded-xl border border-emerald-100 uppercase tracking-widest">
                {act.clave_activo}
              </span>
              <button 
                onClick={() => eliminarAsignacion(act.id_encargo)} 
                className="w-12 h-12 flex items-center justify-center bg-red-50 text-red-400 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
              >
                <Trash2 size={20} />
              </button>
            </div>
            <h4 className="text-xl font-black text-slate-800 uppercase italic mb-4 leading-tight">{act.nombre_activo}</h4>
            <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase">
              <Package size={14} className="text-emerald-500" />
              ID Sistema: {act.id_activo}
            </div>
          </div>
        )) : (
          <div className="col-span-full py-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[4rem] flex flex-col items-center justify-center">
            <AlertTriangle className="text-slate-200 mb-4" size={48} />
            <p className="text-slate-400 font-black uppercase text-xs tracking-widest">Sin equipos bajo su resguardo</p>
          </div>
        )}
      </div>

      {/* MODAL ANTI-DUPLICADOS */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-xl p-4">
          <div className="bg-white w-full max-w-2xl rounded-[4rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-10 border-b border-slate-50 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black uppercase italic text-slate-800">Inventario Disponible</h3>
                <p className="text-emerald-500 font-bold text-[10px] uppercase tracking-widest">Solo se muestran equipos libres</p>
              </div>
              <button onClick={() => setShowModal(false)} className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all"><X/></button>
            </div>
            <div className="p-10 space-y-6">
              <div className="relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Filtrar por nombre o clave..." 
                  className="w-full pl-16 pr-8 py-5 bg-slate-50 border-none rounded-3xl outline-none font-bold text-sm"
                  onChange={(e) => setBusquedaActivo(e.target.value)}
                />
              </div>
              <div className="max-h-[400px] overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                {inventarioDisponible.length > 0 ? inventarioDisponible.map(item => (
                  <div key={item.idActivo} className="flex justify-between items-center p-6 bg-white border-2 border-slate-50 rounded-[2.5rem] hover:border-emerald-500 transition-all group">
                    <div>
                      <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">{item.clave}</span>
                      <p className="text-lg font-black uppercase italic text-slate-800">{item.nombre}</p>
                    </div>
                    <button 
                      onClick={() => handleAsignar(item.idActivo)}
                      disabled={asignando === item.idActivo}
                      className="bg-slate-900 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 disabled:opacity-50 transition-all flex items-center gap-2"
                    >
                      {asignando === item.idActivo ? <Loader2 className="animate-spin" size={14}/> : <><CheckCircle2 size={14}/> Asignar</>}
                    </button>
                  </div>
                )) : (
                  <div className="text-center py-10">
                    <p className="text-slate-300 font-black uppercase text-xs">No hay equipos disponibles que coincidan</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}