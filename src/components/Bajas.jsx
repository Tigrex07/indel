import React, { useState, useMemo, useEffect } from "react";
import { 
  Printer, Search, ChevronDown, Clock, CheckCircle2, 
  XCircle, Loader2, AlertCircle, X, MessageSquare 
} from "lucide-react"; 
import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';

// --- ESTILOS DEL PDF ---
const pdfStyles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: 'Helvetica' },
  header: { marginBottom: 20, borderBottom: 2, borderColor: '#059669', paddingBottom: 10 },
  title: { fontSize: 14, textAlign: 'center', fontWeight: 'bold' },
  sectionTitle: { fontSize: 10, fontWeight: 'bold', backgroundColor: '#f3f4f6', padding: 5, marginTop: 15 },
  row: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#eee', padding: 5 },
  label: { fontWeight: 'bold', width: 80 },
  value: { flex: 1 }
});

const SolicitudPdf = ({ solicitud }) => (
  <Document>
    <Page size="LETTER" style={pdfStyles.page}>
      <View style={pdfStyles.header}>
        <Text style={pdfStyles.title}>
          {solicitud.tipo?.toLowerCase().includes('baja') ? 'DICTAMEN DE BAJA DE ACTIVO' : 'FORMATO DE TRANSFERENCIA'}
        </Text>
      </View>
      <View style={{ marginBottom: 10 }}>
        <Text><Text style={{fontWeight: 'bold'}}>FOLIO: </Text>{solicitud.folio}</Text>
        <Text><Text style={{fontWeight: 'bold'}}>FECHA: </Text>{solicitud.fecha_solicitud}</Text>
        <Text><Text style={{fontWeight: 'bold'}}>SOLICITANTE: </Text>{solicitud.solicitante}</Text>
      </View>
      <View style={pdfStyles.sectionTitle}><Text>JUSTIFICACIÓN</Text></View>
      <Text style={{ marginTop: 5, textAlign: 'justify' }}>{solicitud.justificacion}</Text>
    </Page>
  </Document>
);

export default function GestionSolicitudes({userId}) {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("pendiente");
  const [solicitudExpandida, setSolicitudExpandida] = useState(null);
  const [verPdf, setVerPdf] = useState(null);
  const [isProcessing, setIsProcessing] = useState(null);
  const [toast, setToast] = useState(null);
  const [obsAdmin, setObsAdmin] = useState("");

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const cargarSolicitudes = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://corporacionperris.com/backend/api/solicitudes.php?action=list", {
        credentials: 'include'
      });
      const result = await res.json();
      if (result.success) {
        setSolicitudes(result.data || []);
      } else {
        showToast(result.message || "Error al cargar datos", "error");
      }
    } catch (err) {
      showToast("Error de conexión", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarSolicitudes(); }, []);

  const handleAccion = async (id, nuevoEstadoId) => {
    if (!id) return;
    setIsProcessing(id);
    try {
      const res = await fetch("https://corporacionperris.com/backend/api/solicitudes.php?action=review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({
          id_solicitud: id,
          estado: nuevoEstadoId, 
          observaciones: obsAdmin || (nuevoEstadoId === 3 ? "Aprobado conforme a revisión." : "Rechazado."),
          id_revisor: userId
        })
      });
      const result = await res.json();
      if (result.success) {
        showToast(nuevoEstadoId === 3 ? "Autorizada" : "Rechazada");
        setObsAdmin(""); 
        await cargarSolicitudes(); 
        setSolicitudExpandida(null); 
      }
    } catch (err) {
      showToast("Error al procesar", "error");
    } finally {
      setIsProcessing(null);
    }
  };

  // --- LÓGICA DE FILTROS Y KPIs (POR ESTADO SEGÚN TU DB) ---
  const { filtradas, stats } = useMemo(() => {
    // 1. Contar basado en IDs de tu tabla estados_solicitud
    const counts = solicitudes.reduce((acc, sol) => {
      const id = parseInt(sol.id_estado);
      if (id === 1) acc.pendientes++;
      if (id === 3) acc.aprobadas++;
      if (id === 4) acc.rechazadas++;
      return acc;
    }, { pendientes: 0, aprobadas: 0, rechazadas: 0 });

    // 2. Filtrar lista
    const resFiltradas = solicitudes.filter(sol => {
      const id = parseInt(sol.id_estado);
      const texto = `${sol.folio} ${sol.solicitante} ${sol.tipo || ""}`.toLowerCase();
      const matchText = texto.includes(busqueda.toLowerCase());
      
      const estadoActual = id === 1 ? "pendiente" : id === 3 ? "aprobada" : id === 4 ? "rechazada" : "otro";
      const matchEstado = filtroEstado === "todos" || estadoActual === filtroEstado;
      
      return matchText && matchEstado;
    });

    return { filtradas: resFiltradas, stats: counts };
  }, [solicitudes, busqueda, filtroEstado]);

  return (
    <div className="p-6 space-y-8 bg-gray-50/50 min-h-screen">
      
      {toast && (
        <div className={`fixed top-5 right-5 z-[200] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border animate-in slide-in-from-right ${
          toast.type === 'success' ? 'bg-emerald-600 border-emerald-400 text-white' : 'bg-red-600 border-red-400 text-white'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 size={20}/> : <AlertCircle size={20}/>}
          <p className="font-bold text-sm uppercase tracking-wider">{toast.msg}</p>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tighter">
            Gestión de <span className="text-emerald-600">Solicitudes</span>
          </h1>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Panel Administrativo UTN</p>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" placeholder="Buscar..." 
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-xs font-bold shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
              value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <select 
            className="px-4 py-3 bg-white border border-gray-200 rounded-2xl text-[10px] font-black uppercase text-gray-500 shadow-sm outline-none"
            value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}
          >
            <option value="todos">Todos</option>
            <option value="pendiente">Pendientes</option>
            <option value="aprobada">Aprobadas</option>
            <option value="rechazada">Rechazadas</option>
          </select>
        </div>
      </div>

      {/* KPIs ACTUALIZADOS A ESTADOS REALES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPI icon={<Clock size={24}/>} label="Pendientes" value={stats.pendientes} color="amber" />
        <KPI icon={<CheckCircle2 size={24}/>} label="Aprobadas" value={stats.aprobadas} color="emerald" />
        <KPI icon={<XCircle size={24}/>} label="Rechazadas" value={stats.rechazadas} color="red" />
      </div>

      <div className="grid gap-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Loader2 className="animate-spin mb-4" size={40} />
            <p className="font-black uppercase text-xs tracking-widest">Cargando...</p>
          </div>
        ) : filtradas.map(sol => (
          <div key={sol.id_solicitud} className={`bg-white rounded-[2rem] border transition-all overflow-hidden ${
            solicitudExpandida === sol.id_solicitud ? 'ring-2 ring-emerald-500/20 shadow-xl border-emerald-100' : 'border-gray-100 shadow-sm'
          }`}>
            <div 
              className="p-6 flex items-center justify-between cursor-pointer"
              onClick={() => setSolicitudExpandida(solicitudExpandida === sol.id_solicitud ? null : sol.id_solicitud)}
            >
              <div className="flex items-center gap-5">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  parseInt(sol.id_estado) === 3 ? 'bg-emerald-50 text-emerald-600' : parseInt(sol.id_estado) === 4 ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                }`}>
                  {parseInt(sol.id_estado) === 3 ? <CheckCircle2 size={22}/> : parseInt(sol.id_estado) === 4 ? <XCircle size={22}/> : <Clock size={22}/>}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{sol.folio}</span>
                    <span className={`px-2 py-0.5 text-[8px] font-black rounded uppercase ${
                        parseInt(sol.id_estado) === 1 ? 'bg-amber-100 text-amber-700' : 
                        parseInt(sol.id_estado) === 3 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {parseInt(sol.id_estado) === 1 ? "Pendiente" : parseInt(sol.id_estado) === 3 ? "Aprobada" : "Rechazada"}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-800">{sol.solicitante}</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{sol.tipo} - {sol.fecha_solicitud}</p>
                </div>
              </div>
              <ChevronDown size={20} className={`text-gray-300 transition-transform ${solicitudExpandida === sol.id_solicitud ? 'rotate-180' : ''}`} />
            </div>

            {solicitudExpandida === sol.id_solicitud && (
              <div className="px-6 pb-6 pt-2 bg-gray-50/50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-white p-4 rounded-2xl border border-gray-100">
                        <p className="text-[10px] font-black text-emerald-600 uppercase mb-1">Justificación:</p>
                        <p className="text-sm text-slate-600">"{sol.justificacion}"</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-gray-100">
                        <p className="text-[10px] font-black text-emerald-600 uppercase mb-1">Observaciones:</p>
                        {parseInt(sol.id_estado) === 1 ? (
                          <textarea 
                            className="w-full bg-gray-50 border-none rounded-xl p-3 text-xs outline-none focus:ring-1 focus:ring-emerald-500 h-20 resize-none"
                            placeholder="Escribe aquí..." value={obsAdmin} onChange={(e) => setObsAdmin(e.target.value)}
                          />
                        ) : (
                          <p className="text-xs font-bold text-slate-500">{sol.observaciones_revision || "Sin notas."}</p>
                        )}
                    </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button onClick={() => setVerPdf(sol)} className="flex-1 min-w-[150px] flex items-center justify-center gap-2 py-4 bg-slate-800 text-white rounded-2xl font-black text-[11px] uppercase shadow-lg active:scale-95">
                    <Printer size={18} /> PDF
                  </button>
                  {parseInt(sol.id_estado) === 1 && (
                    <>
                      <button disabled={isProcessing === sol.id_solicitud} onClick={() => handleAccion(sol.id_solicitud, 3)} className="flex-1 min-w-[150px] flex items-center justify-center gap-2 py-4 bg-emerald-600 text-white rounded-2xl font-black text-[11px] uppercase shadow-lg active:scale-95 disabled:opacity-50">
                        {isProcessing === sol.id_solicitud ? <Loader2 className="animate-spin" size={18}/> : "Autorizar"}
                      </button>
                      <button disabled={isProcessing === sol.id_solicitud} onClick={() => handleAccion(sol.id_solicitud, 4)} className="flex-1 min-w-[150px] flex items-center justify-center gap-2 py-4 bg-red-600 text-white rounded-2xl font-black text-[11px] uppercase shadow-lg active:scale-95 disabled:opacity-50">
                        {isProcessing === sol.id_solicitud ? <Loader2 className="animate-spin" size={18}/> : "Rechazar"}
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {verPdf && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-5xl h-[90vh] rounded-[2rem] overflow-hidden flex flex-col shadow-2xl">
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="font-black text-xs uppercase">Documento: {verPdf.folio}</h2>
                    <button onClick={() => setVerPdf(null)} className="p-2 text-red-500"><X size={24}/></button>
                </div>
                <PDFViewer width="100%" height="100%" className="border-none">
                    <SolicitudPdf solicitud={verPdf} />
                </PDFViewer>
            </div>
        </div>
      )}
    </div>
  );
}

function KPI({ icon, label, value, color }) {
    const colorClasses = {
        amber: "bg-amber-50 text-amber-600 border-amber-100",
        red: "bg-red-50 text-red-600 border-red-100",
        emerald: "bg-emerald-50 text-emerald-600 border-emerald-100"
    };
    return (
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${colorClasses[color]} border shadow-sm`}>{icon}</div>
            <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
                <p className="text-3xl font-black text-slate-800 tracking-tighter">{value || 0}</p>
            </div>
        </div>
    );
}
