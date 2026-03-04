import React, { useState, useEffect, useMemo } from "react";
import { 
  CheckCircle, XCircle, Printer, Eye, 
  Clock, FileText, Search, User, Calendar,
  ChevronDown, ArrowRight, AlertTriangle, 
  CheckCircle2, History, Loader2, X, ThumbsUp, ThumbsDown,
  ArrowRightLeft, Trash2, LayoutDashboard
} from "lucide-react";
import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';

const API_URL = "https://corporacionperris.com/backend/api/bajas.php";

// --- ESTILOS DEL PDF ---
const pdfStyles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: 'Helvetica' },
  header: { marginBottom: 20, borderBottom: 2, borderColor: '#059669', pb: 10 },
  title: { fontSize: 14, textAlign: 'center', fontWeight: 'bold', color: '#111' },
  subTitle: { fontSize: 9, textAlign: 'center', color: '#666', marginTop: 4 },
  sectionTitle: { fontSize: 10, fontWeight: 'bold', backgroundColor: '#f3f4f6', padding: 5, marginTop: 15 },
  row: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#eee', padding: 5 },
  footer: { position: 'absolute', bottom: 40, left: 40, right: 40, textAlign: 'center', borderTop: 1, pt: 10 }
});

const SolicitudPdf = ({ solicitud }) => (
  <Document>
    <Page size="LETTER" style={pdfStyles.page}>
      <View style={pdfStyles.header}>
        <Text style={pdfStyles.title}>
          {solicitud.tipo === 'baja' ? 'DICTAMEN TÉCNICO DE BAJA' : 'FORMATO DE TRANSFERENCIA DE ACTIVOS'}
        </Text>
        <Text style={pdfStyles.subTitle}>UNIVERSIDAD TECNOLÓGICA DE NOGALES, SONORA</Text>
      </View>
      <View style={{ marginBottom: 20 }}>
        <Text>FOLIO: {solicitud.folio}</Text>
        <Text>FECHA: {solicitud.fecha}</Text>
        <Text>SOLICITANTE: {solicitud.usuario}</Text>
        <Text>TIPO DE MOVIMIENTO: {solicitud.tipo.toUpperCase()}</Text>
      </View>
      <Text style={pdfStyles.sectionTitle}>ACTIVOS RELACIONADOS</Text>
      {solicitud.activos.map((act, i) => (
        <View key={i} style={pdfStyles.row}>
          <Text style={{ flex: 1 }}>{act.clave}</Text>
          <Text style={{ flex: 2 }}>{act.nombre}</Text>
          <Text style={{ flex: 1 }}>{act.aula}</Text>
        </View>
      ))}
      <Text style={pdfStyles.sectionTitle}>JUSTIFICACIÓN / MOTIVOS</Text>
      <Text style={{ marginTop: 5, fontStyle: 'italic' }}>{solicitud.justificacion}</Text>
    </Page>
  </Document>
);

export default function GestionSolicitudes() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [solicitudExpandida, setSolicitudExpandida] = useState(null);
  const [verPdf, setVerPdf] = useState(null);

  useEffect(() => { cargarSolicitudes(); }, []);

  const cargarSolicitudes = () => {
    setLoading(true);
    fetch(API_URL, { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        credentials: "include", 
        body: JSON.stringify({ action: "read_all" }) 
    })
    .then(res => res.json())
    .then(json => { if (json.success) setSolicitudes(json.data); })
    .catch(err => console.error(err))
    .finally(() => setLoading(false));
  };

  const handleEstado = (id, nuevoEstado) => {
    const actualizadas = solicitudes.map(s => 
      s.id === id ? { ...s, estado: nuevoEstado } : s
    );
    setSolicitudes(actualizadas);
    setSolicitudExpandida(null);
  };

  const filtradas = useMemo(() => {
    const data = solicitudes.length > 0 ? solicitudes : mockData;
    return data.filter(sol => {
      const matchText = sol.folio.toLowerCase().includes(busqueda.toLowerCase()) || 
                       sol.usuario.toLowerCase().includes(busqueda.toLowerCase());
      const matchEstado = filtroEstado === "todos" || sol.estado === filtroEstado;
      return matchText && matchEstado;
    });
  }, [solicitudes, busqueda, filtroEstado]);

  // Cálculo de KPIs
  const stats = useMemo(() => {
    const data = solicitudes.length > 0 ? solicitudes : mockData;
    return {
      pendientes: data.filter(s => s.estado === 'pendiente').length,
      bajas: data.filter(s => s.tipo === 'baja' && s.estado === 'aprobada').length,
      transferencias: data.filter(s => s.tipo === 'transferencia' && s.estado === 'aprobada').length
    };
  }, [solicitudes]);

  return (
    <div className="p-6 space-y-8 bg-gray-50/50 min-h-screen relative">
      
      {/* MODAL DEL PDF */}
      {verPdf && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-5xl h-[90vh] rounded-[2rem] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="font-black text-slate-800 uppercase text-xs tracking-widest flex items-center gap-2">
                <Printer size={16} className="text-emerald-600"/> Vista Previa de Documento
              </h2>
              <button onClick={() => setVerPdf(null)} className="p-2 hover:bg-red-50 text-red-500 rounded-full transition-all">
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 bg-gray-100">
              <PDFViewer width="100%" height="100%" className="border-none shadow-inner">
                <SolicitudPdf solicitud={verPdf} />
              </PDFViewer>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tighter">
            Gestión de <span className="text-emerald-600">Solicitudes</span>
          </h1>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Panel de control de activos UTN</p>
        </div>
        
        <div className="flex gap-2">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                    type="text" placeholder="Buscar folio o usuario..." 
                    className="pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-xs font-bold outline-none w-64 shadow-sm focus:ring-2 focus:ring-emerald-500/20"
                    value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
                />
            </div>
            <select 
                className="px-4 py-3 bg-white border border-gray-200 rounded-2xl text-[10px] font-black uppercase text-gray-500 shadow-sm outline-none cursor-pointer"
                value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}
            >
                <option value="todos">Todos los Estados</option>
                <option value="pendiente">Pendientes</option>
                <option value="aprobada">Aprobadas</option>
                <option value="rechazada">Rechazadas</option>
            </select>
        </div>
      </div>

      {/* SECCIÓN DE KPIS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPI icon={<Clock size={24}/>} label="Por Procesar" value={stats.pendientes} color="amber" />
        <KPI icon={<Trash2 size={24}/>} label="Bajas Aprobadas" value={stats.bajas} color="red" />
        <KPI icon={<ArrowRightLeft size={24}/>} label="Transferencias" value={stats.transferencias} color="emerald" />
      </div>

      

      {/* LISTADO */}
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
                  <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                    {sol.tipo === 'baja' ? 'Solicitud de Baja' : 'Solicitud de Transferencia'}
                    <span className="text-gray-300 font-medium text-sm">— {sol.activos.length} activos</span>
                  </h3>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-right hidden sm:block">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Responsable</p>
                    <p className="text-xs font-bold text-slate-600 uppercase">{sol.usuario}</p>
                </div>
                <ChevronDown size={20} className={`text-gray-300 transition-transform ${solicitudExpandida === sol.id ? 'rotate-180' : ''}`} />
              </div>
            </div>

            {solicitudExpandida === sol.id && (
              <div className="px-6 pb-6 pt-2 bg-gray-50/50">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white p-5 rounded-[1.5rem] border border-gray-100 shadow-sm">
                        <p className="text-[10px] font-black text-emerald-600 uppercase mb-2 flex items-center gap-1">
                          <FileText size={12}/> Justificación del Movimiento:
                        </p>
                        <p className="text-sm text-slate-600 italic leading-relaxed">"{sol.justificacion}"</p>
                    </div>

                    <div className="flex gap-3">
                        <button 
                            onClick={() => setVerPdf(sol)}
                            className="flex-1 flex items-center justify-center gap-2 py-4 bg-slate-800 text-white rounded-2xl font-black text-[11px] uppercase hover:bg-slate-700 transition-all shadow-lg active:scale-95"
                        >
                            <Printer size={18} /> Imprimir Formato
                        </button>

                        {sol.estado === 'pendiente' && (
                            <>
                                <button 
                                    onClick={() => handleEstado(sol.id, 'aprobada')}
                                    className="flex-1 flex items-center justify-center gap-2 py-4 bg-emerald-600 text-white rounded-2xl font-black text-[11px] uppercase hover:bg-emerald-500 transition-all shadow-lg active:scale-95"
                                >
                                    <ThumbsUp size={18} /> Autorizar
                                </button>
                                <button 
                                    onClick={() => handleEstado(sol.id, 'rechazada')}
                                    className="flex-1 flex items-center justify-center gap-2 py-4 bg-red-600 text-white rounded-2xl font-black text-[11px] uppercase hover:bg-red-500 transition-all shadow-lg active:scale-95"
                                >
                                    <ThumbsDown size={18} /> Rechazar
                                </button>
                            </>
                        )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Activos involucrados:</p>
                    <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                        {sol.activos.map((act, i) => (
                        <div key={i} className="bg-white p-3 rounded-xl border border-gray-100 flex items-center justify-between shadow-sm">
                            <div>
                                <p className="text-[11px] font-black text-slate-700">{act.nombre}</p>
                                <p className="text-[9px] font-bold text-emerald-600 tracking-tighter">{act.clave}</p>
                            </div>
                            <span className="text-[8px] font-black bg-gray-100 px-2 py-1 rounded-md text-gray-500 uppercase">{act.aula}</span>
                        </div>
                        ))}
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// COMPONENTE KPI REUTILIZABLE
function KPI({ icon, label, value, color }) {
    const colorClasses = {
        amber: "bg-amber-50 text-amber-600 border-amber-100",
        red: "bg-red-50 text-red-600 border-red-100",
        emerald: "bg-emerald-50 text-emerald-600 border-emerald-100"
    };

    return (
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5 hover:scale-[1.02] transition-all">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${colorClasses[color]} border shadow-sm`}>
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
                <p className="text-3xl font-black text-slate-800">{value}</p>
            </div>
        </div>
    );
}

// MOCKS ACTUALIZADOS CON TRANSFERENCIAS
const mockData = [
  // --- PENDIENTES ---
  { 
    id: 1, folio: "BAJ-2026-045", fecha: "2026-03-04", usuario: "Ing. Ricardo Ramírez", estado: "pendiente", tipo: "baja",
    justificacion: "Falla crítica en sistema de enfriamiento y tarjeta de video. Reparación supera el 70% del valor actual.",
    activos: [{ clave: "8.1.6.1-002025", nombre: "Workstation Dell Precision 3650", aula: "Laboratorio de IA" }]
  },
  { 
    id: 2, folio: "TRA-2026-012", fecha: "2026-03-04", usuario: "Lic. Sandra Luz", estado: "pendiente", tipo: "transferencia",
    justificacion: "Reubicación de mobiliario por remodelación del área de servicios escolares.",
    activos: [
      { clave: "8.3.3-002949", nombre: "BANCA TANDEM 4 PLAZAS VERDE", aula: "Pasillo Docencia II" },
      { clave: "8.3.3-002950", nombre: "BANCA TANDEM 4 PLAZAS VERDE", aula: "Pasillo Docencia II" }
    ]
  },
  { 
    id: 3, folio: "BAJ-2026-046", fecha: "2026-03-03", usuario: "Dr. Marcos Valenzuela", estado: "pendiente", tipo: "baja",
    justificacion: "Equipo de laboratorio con sensor óptico dañado y descontinuado por el fabricante.",
    activos: [{ clave: "8.1.6.9-002028", nombre: "Módulo DAQ National Instruments", aula: "Lab. Mecatrónica" }]
  },

  // --- APROBADAS (GESTIONADAS) ---
  { 
    id: 4, folio: "TRA-2026-008", fecha: "2026-03-02", usuario: "Mtra. Elena Rocha", estado: "aprobada", tipo: "transferencia",
    justificacion: "Fortalecimiento del Laboratorio de Redes con proyectores de alta luminosidad.",
    activos: [{ clave: "8.2.7.3-004214", nombre: "PROYECTOR EPSON H429A", aula: "Lab. Redes" }]
  },
  { 
    id: 5, folio: "BAJ-2026-039", fecha: "2026-03-01", usuario: "C.P. Mario Arvizu", estado: "aprobada", tipo: "baja",
    justificacion: "Sillas con rotura en base neumática y soporte lumbar. Riesgo ergonómico.",
    activos: [
      { clave: "8.1.6.3-004063", nombre: "SILLON EJECUTIVO RESPALDO ALTO", aula: "Edificio A" },
      { clave: "8.1.3-002821", nombre: "SILLA APILABLE CROMADA NEGRA", aula: "Cubículo 10" }
    ]
  },
  { 
    id: 6, folio: "TRA-2026-005", fecha: "2026-02-28", usuario: "Ing. Luis Medina", estado: "aprobada", tipo: "transferencia",
    justificacion: "Intercambio de equipo para balanceo de cargas en departamentos.",
    activos: [{ clave: "8.1.6.1-002100", nombre: "Impresora Láser HP 500", aula: "Sistemas" }]
  },
  { 
    id: 7, folio: "BAJ-2026-030", fecha: "2026-02-25", usuario: "Soporte Técnico", estado: "aprobada", tipo: "baja",
    justificacion: "Baterías hinchadas y daño por humedad en circuito principal.",
    activos: [{ clave: "8.1.6.1-001002", nombre: "UPS No-Break 1500VA", aula: "Site Central" }]
  },

  // --- RECHAZADAS ---
  { 
    id: 8, folio: "BAJ-2026-044", fecha: "2026-03-04", usuario: "Lic. Ana Karen", estado: "rechazada", tipo: "baja",
    justificacion: "El equipo es lento.",
    activos: [{ clave: "8.4.1-000998", nombre: "Laptop Lenovo V15", aula: "Biblioteca" }]
  },

  // --- MÁS TRANSFERENCIAS PARA EL KPI ---
  { 
    id: 9, folio: "TRA-2026-015", fecha: "2026-03-04", usuario: "Ing. Jorge Cano", estado: "aprobada", tipo: "transferencia",
    justificacion: "Asignación a docente de nuevo ingreso.",
    activos: [{ clave: "INV-TIC-990", nombre: "Monitor LG 24' UltraWide", aula: "Cubículo 5" }]
  },
  { 
    id: 10, folio: "TRA-2026-018", fecha: "2026-03-04", usuario: "Admón. Edificios", estado: "aprobada", tipo: "transferencia",
    justificacion: "Movimiento masivo de butacas para auditorio.",
    activos: Array.from({ length: 10 }, (_, i) => ({
        clave: `8.7.11-000${100 + i}`, 
        nombre: "MESABANCO COLOR VERDE", 
        aula: "Auditorio Magna" 
    }))
  },

  // --- MÁS BAJAS PARA EL KPI ---
  { 
    id: 11, folio: "BAJ-2026-050", fecha: "2026-03-04", usuario: "Almacén Central", estado: "aprobada", tipo: "baja",
    justificacion: "Obsolescencia tecnológica. Equipos Pentium 4.",
    activos: [
      { clave: "8.1.1-00055", nombre: "CPU Clon Antiguo", aula: "Bodega B" },
      { clave: "8.1.1-00056", nombre: "Monitor CRT 15 pulg", aula: "Bodega B" }
    ]
  },
  { 
    id: 12, folio: "BAJ-2026-051", fecha: "2026-03-04", usuario: "Mantenimiento", estado: "aprobada", tipo: "baja",
    justificacion: "Herramienta eléctrica quemada durante operación.",
    activos: [{ clave: "MT-0098", nombre: "Rotomartillo Industrial", aula: "Taller" }]
  }
];
