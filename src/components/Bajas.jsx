import React, { useState, useMemo } from "react";
import { 
  Printer, FileText, Search, ChevronDown, 
  Clock, ArrowRightLeft, Trash2, ThumbsUp, ThumbsDown,
  Loader2, CheckCircle2, AlertCircle, X
} from "lucide-react";
import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';

// --- ESTILOS DEL PDF ---
const pdfStyles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: 'Helvetica' },
  header: { marginBottom: 20, borderBottom: 2, borderColor: '#059669', paddingBottom: 10 },
  title: { fontSize: 14, textAlign: 'center', fontWeight: 'bold' },
  sectionTitle: { fontSize: 10, fontWeight: 'bold', backgroundColor: '#f3f4f6', padding: 5, marginTop: 15 },
  row: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#eee', padding: 5 },
});

const SolicitudPdf = ({ solicitud }) => (
  <Document>
    <Page size="LETTER" style={pdfStyles.page}>
      <View style={pdfStyles.header}>
        <Text style={pdfStyles.title}>{solicitud.tipo === 'baja' ? 'DICTAMEN DE BAJA' : 'FORMATO DE TRANSFERENCIA'}</Text>
      </View>
      <Text>FOLIO: {solicitud.folio}</Text>
      <Text>SOLICITANTE: {solicitud.usuario}</Text>
      <View style={pdfStyles.sectionTitle}><Text>ACTIVOS</Text></View>
      {solicitud.activos.map((act, i) => (
        <View key={i} style={pdfStyles.row}>
          <Text style={{ flex: 1 }}>{act.clave}</Text>
          <Text style={{ flex: 2 }}>{act.nombre}</Text>
        </View>
      ))}
    </Page>
  </Document>
);

export default function GestionSolicitudes() {
  // Inicializamos con los mocks masivos que te di
  const [solicitudes, setSolicitudes] = useState(mockData);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [solicitudExpandida, setSolicitudExpandida] = useState(null);
  const [verPdf, setVerPdf] = useState(null);
  
  // Estados para simular carga y feedback
  const [isProcessing, setIsProcessing] = useState(null); // Guarda el ID que se está procesando
  const [toast, setToast] = useState(null);

  // Función para mostrar mensajes temporales
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // --- LÓGICA DE BOTONES (SIMULACIÓN "PLOX") ---
  const handleAccion = (id, nuevoEstado) => {
    setIsProcessing(id);
    
    // Simulamos un delay de red de 1.5 segundos para que se vea real
    setTimeout(() => {
      setSolicitudes(prev => prev.map(s => 
        s.id === id ? { ...s, estado: nuevoEstado } : s
      ));
      
      setIsProcessing(null);
      setSolicitudExpandida(null);
      
      const mensaje = nuevoEstado === 'aprobada' ? "Solicitud autorizada con éxito" : "Solicitud rechazada";
      showToast(mensaje, nuevoEstado === 'aprobada' ? "success" : "error");
    }, 1200);
  };

  const filtradas = useMemo(() => {
    return solicitudes.filter(sol => {
      const matchText = sol.folio.toLowerCase().includes(busqueda.toLowerCase()) || 
                       sol.usuario.toLowerCase().includes(busqueda.toLowerCase());
      const matchEstado = filtroEstado === "todos" || sol.estado === filtroEstado;
      return matchText && matchEstado;
    });
  }, [solicitudes, busqueda, filtroEstado]);

  const stats = useMemo(() => ({
    pendientes: solicitudes.filter(s => s.estado === 'pendiente').length,
    bajas: solicitudes.filter(s => s.tipo === 'baja' && s.estado === 'aprobada').length,
    transferencias: solicitudes.filter(s => s.tipo === 'transferencia' && s.estado === 'aprobada').length
  }), [solicitudes]);

  return (
    <div className="p-6 space-y-8 bg-gray-50/50 min-h-screen relative font-sans">
      
      {/* NOTIFICACIÓN FLOTANTE (TOAST) */}
      {toast && (
        <div className={`fixed top-5 right-5 z-[200] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border animate-in slide-in-from-right ${
          toast.type === 'success' ? 'bg-emerald-600 border-emerald-400 text-white' : 'bg-red-600 border-red-400 text-white'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 size={20}/> : <AlertCircle size={20}/>}
          <p className="font-bold text-sm uppercase tracking-wider">{toast.msg}</p>
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tighter">
            Gestión de <span className="text-emerald-600">Solicitudes</span>
          </h1>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Panel de Control Administrativo</p>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                    type="text" placeholder="Folio, usuario o activo..." 
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-xs font-bold outline-none shadow-sm focus:ring-2 focus:ring-emerald-500/20"
                    value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
                />
            </div>
            <select 
                className="px-4 py-3 bg-white border border-gray-200 rounded-2xl text-[10px] font-black uppercase text-gray-500 shadow-sm outline-none cursor-pointer"
                value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}
            >
                <option value="todos">Todos</option>
                <option value="pendiente">Pendientes</option>
                <option value="aprobada">Aprobadas</option>
                <option value="rechazada">Rechazadas</option>
            </select>
        </div>
      </div>

      {/* KPIS DINÁMICOS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPI icon={<Clock size={24}/>} label="Por Procesar" value={stats.pendientes} color="amber" />
        <KPI icon={<Trash2 size={24}/>} label="Bajas Listas" value={stats.bajas} color="red" />
        <KPI icon={<ArrowRightLeft size={24}/>} label="Cambios de Lugar" value={stats.transferencias} color="emerald" />
      </div>

      {/* LISTADO DE SOLICITUDES */}
      <div className="grid gap-4">
        {filtradas.map(sol => (
          <div key={sol.id} className={`bg-white rounded-[2rem] border transition-all overflow-hidden ${solicitudExpandida === sol.id ? 'ring-2 ring-emerald-500/20 shadow-xl' : 'border-gray-100 shadow-sm hover:border-emerald-200'}`}>
            <div 
              className="p-6 flex items-center justify-between cursor-pointer"
              onClick={() => setSolicitudExpandida(solicitudExpandida === sol.id ? null : sol.id)}
            >
              <div className="flex items-center gap-5">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    sol.tipo === 'baja' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                }`}>
                    {sol.tipo === 'baja' ? <Trash2 size={22}/> : <ArrowRightLeft size={22}/>}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{sol.folio}</span>
                    <span className={`px-2 py-0.5 text-[8px] font-black rounded uppercase ${
                        sol.estado === 'pendiente' ? 'bg-amber-100 text-amber-700' : 
                        sol.estado === 'aprobada' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}>{sol.estado}</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-800">{sol.tipo === 'baja' ? 'Solicitud de Baja' : 'Solicitud de Transferencia'}</h3>
                </div>
              </div>
              <ChevronDown size={20} className={`text-gray-300 transition-transform ${solicitudExpandida === sol.id ? 'rotate-180' : ''}`} />
            </div>

            {solicitudExpandida === sol.id && (
              <div className="px-6 pb-6 pt-2 bg-gray-50/50">
                <div className="bg-white p-5 rounded-[1.5rem] border border-gray-100 shadow-sm mb-4">
                    <p className="text-[10px] font-black text-emerald-600 uppercase mb-2">Justificación Técnica:</p>
                    <p className="text-sm text-slate-600 italic leading-relaxed">"{sol.justificacion}"</p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <button onClick={() => setVerPdf(sol)} className="flex-1 min-w-[150px] flex items-center justify-center gap-2 py-4 bg-slate-800 text-white rounded-2xl font-black text-[11px] uppercase hover:bg-slate-700 transition-all shadow-lg active:scale-95">
                        <Printer size={18} /> Imprimir Formato
                    </button>

                    {sol.estado === 'pendiente' && (
                        <>
                            <button 
                                disabled={isProcessing}
                                onClick={() => handleAccion(sol.id, 'aprobada')}
                                className="flex-1 min-w-[150px] flex items-center justify-center gap-2 py-4 bg-emerald-600 text-white rounded-2xl font-black text-[11px] uppercase hover:bg-emerald-500 transition-all shadow-lg active:scale-95 disabled:opacity-50"
                            >
                                {isProcessing === sol.id ? <Loader2 className="animate-spin" size={18}/> : <ThumbsUp size={18} />}
                                {isProcessing === sol.id ? 'Procesando...' : 'Autorizar'}
                            </button>
                            <button 
                                disabled={isProcessing}
                                onClick={() => handleAccion(sol.id, 'rechazada')}
                                className="flex-1 min-w-[150px] flex items-center justify-center gap-2 py-4 bg-red-600 text-white rounded-2xl font-black text-[11px] uppercase hover:bg-red-500 transition-all shadow-lg active:scale-95 disabled:opacity-50"
                            >
                                {isProcessing === sol.id ? <Loader2 className="animate-spin" size={18}/> : <ThumbsDown size={18} />}
                                {isProcessing === sol.id ? 'Procesando...' : 'Rechazar'}
                            </button>
                        </>
                    )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* MODAL PDF */}
      {verPdf && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-5xl h-[90vh] rounded-[2rem] overflow-hidden flex flex-col">
                <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                    <h2 className="font-black text-xs uppercase tracking-widest text-slate-800">Vista Previa de Documento</h2>
                    <button onClick={() => setVerPdf(null)} className="p-2 hover:bg-red-50 text-red-500 rounded-full transition-all"><X size={24}/></button>
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
                <p className="text-3xl font-black text-slate-800 tracking-tighter">{value}</p>
            </div>
        </div>
    );
}

// MOCKS MASIVOS
const mockData = [
  { id: 1, folio: "BAJ-2026-045", fecha: "2026-03-04", usuario: "Ing. Ricardo Ramírez", estado: "pendiente", tipo: "baja", justificacion: "CPU con daño en tarjeta madre por descarga eléctrica.", activos: [{ clave: "8.1.6.1-002025", nombre: "Dell Precision 3650" }] },
  { id: 2, folio: "TRA-2026-012", fecha: "2026-03-04", usuario: "Lic. Sandra Luz", estado: "pendiente", tipo: "transferencia", justificacion: "Reubicación por remodelación.", activos: [{ clave: "8.3.3-002949", nombre: "BANCA TANDEM" }] },
  { id: 3, folio: "BAJ-2026-046", fecha: "2026-03-03", usuario: "Dr. Marcos Valenzuela", estado: "pendiente", tipo: "baja", justificacion: "Equipo descontinuado sin refacciones.", activos: [{ clave: "8.1.6.9-002028", nombre: "Módulo DAQ NI" }] },
  { id: 4, folio: "TRA-2026-008", fecha: "2026-03-02", usuario: "Mtra. Elena Rocha", estado: "aprobada", tipo: "transferencia", justificacion: "Asignación a Laboratorio de Redes.", activos: [{ clave: "8.2.7.3-004214", nombre: "PROYECTOR EPSON" }] },
  { id: 5, folio: "BAJ-2026-039", fecha: "2026-03-01", usuario: "C.P. Mario Arvizu", estado: "aprobada", tipo: "baja", justificacion: "Riesgo ergonómico por rotura de base.", activos: [{ clave: "8.1.6.3-004063", nombre: "SILLON EJECUTIVO" }] },
  { id: 6, folio: "TRA-2026-005", fecha: "2026-02-28", usuario: "Ing. Luis Medina", estado: "aprobada", tipo: "transferencia", justificacion: "Equilibrio de recursos.", activos: [{ clave: "8.1.6.1-002100", nombre: "Impresora HP" }] }
];