import React, { useEffect, useState, useMemo } from "react";
import { 
  History, Search, Download, FileText, 
  ArrowUpRight, Calendar, X, FileDown, 
  MapPin, User, Hash, Box, Layers3, 
  Workflow, CalendarDays, Loader2, AlertCircle
} from "lucide-react";
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

// --- 1. DISEÑO DEL PDF INSTITUCIONAL ---
const stylesPDF = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', backgroundColor: '#FFFFFF' },
  header: { marginBottom: 30, borderBottom: 2, borderBottomColor: '#059669', paddingBottom: 10 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#111827' },
  brand: { color: '#059669' },
  subtitle: { fontSize: 9, color: '#6b7280', marginTop: 4, textTransform: 'uppercase', letterSpacing: 1.5 },
  section: { marginTop: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 },
  fieldBox: { width: '50%', marginBottom: 15 },
  label: { fontSize: 8, color: '#9ca3af', textTransform: 'uppercase', marginBottom: 2, fontWeight: 'bold' },
  value: { fontSize: 11, color: '#374151' },
  descBox: { marginTop: 25, padding: 20, backgroundColor: '#f0fdf4', borderRadius: 10, borderLeft: 4, borderLeftColor: '#10b981' },
  descTitle: { fontSize: 10, color: '#059669', fontWeight: 'bold', marginBottom: 6 },
  descText: { fontSize: 10, color: '#374151', lineHeight: 1.6 },
  footer: { position: 'absolute', bottom: 40, left: 40, right: 40, borderTop: 1, borderTopColor: '#f3f4f6', paddingTop: 10, textAlign: 'center', fontSize: 8, color: '#9ca3af' }
});

const ExpedientePDF = ({ data }) => (
  <Document>
    <Page size="A4" style={stylesPDF.page}>
      <View style={stylesPDF.header}>
        <Text style={stylesPDF.title}>CORPORACIÓN <Text style={stylesPDF.brand}>PERRIS</Text></Text>
        <Text style={stylesPDF.subtitle}>Reporte Histórico de Movimiento Patrimonial</Text>
      </View>
      <View style={stylesPDF.section}>
        <View style={stylesPDF.grid}>
          <View style={stylesPDF.fieldBox}><Text style={stylesPDF.label}>Folio de Control</Text><Text style={stylesPDF.value}>{data.folio}</Text></View>
          <View style={stylesPDF.fieldBox}><Text style={stylesPDF.label}>Fecha de Solicitud</Text><Text style={stylesPDF.value}>{data.fecha_solicitud}</Text></View>
          <View style={stylesPDF.fieldBox}><Text style={stylesPDF.label}>Tipo de Movimiento</Text><Text style={stylesPDF.value}>{data.tipo}</Text></View>
          <View style={stylesPDF.fieldBox}><Text style={stylesPDF.label}>Solicitante</Text><Text style={stylesPDF.value}>{data.solicitante}</Text></View>
          <View style={stylesPDF.fieldBox}><Text style={stylesPDF.label}>Estado Actual</Text><Text style={stylesPDF.value}>{data.nombre_estado || 'N/A'}</Text></View>
          <View style={stylesPDF.fieldBox}><Text style={stylesPDF.label}>ID Solicitud</Text><Text style={stylesPDF.value}>#{data.id_solicitud}</Text></View>
        </View>
      </View>
      <View style={stylesPDF.descBox}>
        <Text style={stylesPDF.descTitle}>JUSTIFICACIÓN Y MOTIVOS</Text>
        <Text style={stylesPDF.descText}>{data.justificacion}</Text>
      </View>
      {data.observaciones_revision && (
        <View style={[stylesPDF.descBox, { backgroundColor: '#f8fafc', borderLeftColor: '#64748b', marginTop: 10 }]}>
          <Text style={[stylesPDF.descTitle, { color: '#475569' }]}>OBSERVACIONES DE REVISIÓN</Text>
          <Text style={stylesPDF.descText}>{data.observaciones_revision}</Text>
        </View>
      )}
      <Text style={stylesPDF.footer}>Documento generado por el sistema de Gestión UTN. Emisión: {new Date().toLocaleString()}</Text>
    </Page>
  </Document>
);

// --- 2. COMPONENTE PRINCIPAL ---
export default function Reportes() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  
  const [reporteSeleccionado, setReporteSeleccionado] = useState(null);
  const [showConfirmExcel, setShowConfirmExcel] = useState(false);
  const [showConfirmPDF, setShowConfirmPDF] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://corporacionperris.com/backend/api/solicitudes.php?action=list", {
        credentials: 'include'
      });
      const result = await res.json();
      if (result.success) setSolicitudes(result.data || []);
    } catch (err) {
      console.error("Error cargando historial:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarDatos(); }, []);

  // --- LÓGICA DE FILTRADO MAESTRO ---
  const filtradas = useMemo(() => {
    return solicitudes.filter(sol => {
      const term = busqueda.toLowerCase();
      const idEstado = parseInt(sol.id_estado);
      const tipoSol = (sol.tipo || "").toLowerCase();
      
      const matchBusqueda = sol.folio?.toLowerCase().includes(term) || 
                            sol.solicitante?.toLowerCase().includes(term) ||
                            sol.justificacion?.toLowerCase().includes(term);

      const matchEstado = filtroEstado === "todos" || 
                          (filtroEstado === "pendiente" && idEstado === 1) ||
                          (filtroEstado === "aprobada" && idEstado === 3) ||
                          (filtroEstado === "rechazada" && idEstado === 4);

      const matchTipo = filtroTipo === "todos" || 
                        (filtroTipo === "baja" && tipoSol.includes("baja")) ||
                        (filtroTipo === "transferencia" && (tipoSol.includes("trans") || tipoSol.includes("mov")));

      const fechaSol = new Date(sol.fecha_solicitud);
      const inicio = fechaInicio ? new Date(fechaInicio) : null;
      const fin = fechaFin ? new Date(fechaFin) : null;
      const matchFecha = (!inicio || fechaSol >= inicio) && (!fin || fechaSol <= fin);

      return matchBusqueda && matchEstado && matchTipo && matchFecha;
    });
  }, [solicitudes, busqueda, filtroEstado, filtroTipo, fechaInicio, fechaFin]);

  const handleExportarExcel = () => {
    setIsExporting(true);
    setTimeout(() => {
      const headers = "Folio,Fecha,Solicitante,Tipo,Estado,Justificacion\n";
      const csvContent = "data:text/csv;charset=utf-8," + headers + 
        filtradas.map(s => `"${s.folio}","${s.fecha_solicitud}","${s.solicitante}","${s.tipo}","${s.id_estado === '3' ? 'Aprobada' : s.id_estado === '4' ? 'Rechazada' : 'Pendiente'}","${s.justificacion.replace(/"/g, '""')}"`).join("\n");
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `Historial_General_${new Date().toLocaleDateString()}.csv`);
      document.body.appendChild(link);
      link.click();
      setIsExporting(false);
      setShowConfirmExcel(false);
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 px-4 animate-in fade-in duration-700">
      
      {/* HEADER DE CONTROL */}
      <div className="bg-white p-10 rounded-[2.5rem] border border-emerald-100 shadow-xl shadow-emerald-500/5 flex flex-col md:flex-row justify-between items-center gap-8 group">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-emerald-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-emerald-200 group-hover:rotate-6 transition-all">
            <History size={40} />
          </div>
          <div className="space-y-1">
            <h2 className="text-4xl font-black text-slate-800 tracking-tighter">Historial <span className="text-emerald-600 font-light">Global</span></h2>
            <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em]">Auditoría y Trazabilidad Patrimonial</p>
          </div>
        </div>
        <button 
          onClick={() => setShowConfirmExcel(true)}
          disabled={filtradas.length === 0}
          className="flex items-center gap-2.5 px-8 py-5 bg-slate-800 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 shadow-lg transition-all active:scale-95 disabled:opacity-50"
        >
          <Download size={18} /> Exportar Selección ({filtradas.length})
        </button>
      </div>

      {/* BARRA DE FILTROS AVANZADA */}
      <div className="bg-white p-8 rounded-[2rem] border border-emerald-100 shadow-sm space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Buscador */}
          <div className="lg:col-span-4 relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
            <input 
              className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold text-slate-700 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 transition-all text-sm"
              placeholder="Buscar folio, nombre o motivo..."
              value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          {/* Filtro Estado */}
          <div className="lg:col-span-2">
            <select 
              value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}
              className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-black text-[10px] uppercase tracking-wider text-slate-500 outline-none focus:ring-2 focus:ring-emerald-500/10"
            >
              <option value="todos">Todos los Estados</option>
              <option value="pendiente">Pendientes</option>
              <option value="aprobada">Aprobadas</option>
              <option value="rechazada">Rechazadas</option>
            </select>
          </div>

          {/* Filtro Tipo */}
          <div className="lg:col-span-2">
            <select 
              value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}
              className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-black text-[10px] uppercase tracking-wider text-slate-500 outline-none focus:ring-2 focus:ring-emerald-500/10"
            >
              <option value="todos">Todos los Tipos</option>
              <option value="baja">Bajas</option>
              <option value="transferencia">Transferencias</option>
            </select>
          </div>

          {/* Fechas */}
          <div className="lg:col-span-2 relative">
            <input type="date" className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-xs text-slate-700 outline-none" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
            <span className="absolute -top-2.5 left-4 bg-white px-2 text-[9px] font-black text-emerald-600 uppercase">Inicio</span>
          </div>
          <div className="lg:col-span-2 relative">
            <input type="date" className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-xs text-slate-700 outline-none" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
            <span className="absolute -top-2.5 left-4 bg-white px-2 text-[9px] font-black text-emerald-600 uppercase">Fin</span>
          </div>
        </div>
      </div>

      {/* LISTADO DE RESULTADOS */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="animate-spin mb-4" size={40} />
            <p className="font-black uppercase text-xs tracking-widest">Sincronizando Historial...</p>
          </div>
        ) : filtradas.length === 0 ? (
          <div className="bg-white p-20 rounded-[2rem] border border-dashed border-gray-200 text-center">
            <AlertCircle className="mx-auto mb-4 text-gray-300" size={48} />
            <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">No hay registros que coincidan</p>
          </div>
        ) : filtradas.map((sol) => (
          <div key={sol.id_solicitud} className="group bg-white p-7 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 transition-all relative overflow-hidden">
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
              parseInt(sol.id_estado) === 3 ? 'bg-emerald-500' : 
              parseInt(sol.id_estado) === 4 ? 'bg-red-500' : 'bg-amber-400'
            }`}></div>
            
            <div className="flex flex-col md:flex-row justify-between gap-6 ml-4">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
                    ID #{sol.id_solicitud}
                  </span>
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                    parseInt(sol.id_estado) === 3 ? 'bg-emerald-50 text-emerald-700' : 
                    parseInt(sol.id_estado) === 4 ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {parseInt(sol.id_estado) === 3 ? 'Aprobada' : parseInt(sol.id_estado) === 4 ? 'Rechazada' : 'Pendiente'}
                  </span>
                  <span className="text-gray-400 text-[10px] font-bold uppercase flex items-center gap-1.5 tracking-widest">
                    <Calendar size={14} className="text-emerald-500" /> {sol.fecha_solicitud}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-slate-800 group-hover:text-emerald-600 transition-colors leading-none">
                  {sol.solicitante}
                </h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-3xl pl-4 border-l-4 border-emerald-50">
                  {sol.justificacion.substring(0, 120)}...
                </p>
                <div className="flex gap-4 pt-2">
                  <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase">
                    <Workflow size={14}/> {sol.tipo}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase">
                    <Hash size={14}/> {sol.folio}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center">
                <button 
                  onClick={() => setReporteSeleccionado(sol)}
                  className="p-5 bg-gray-50 rounded-2xl text-slate-300 group-hover:bg-emerald-600 group-hover:text-white transition-all border border-gray-100 active:scale-95"
                >
                  <ArrowUpRight size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: EXCEL */}
      {showConfirmExcel && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 backdrop-blur-md bg-slate-900/20 animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-10 shadow-2xl text-center border border-emerald-100">
            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 bg-emerald-50 text-emerald-600 ${isExporting ? 'animate-bounce' : ''}`}>
              <Download size={32} />
            </div>
            <h4 className="text-2xl font-black text-slate-800 mb-2 tracking-tighter">¿Exportar Reporte?</h4>
            <p className="text-slate-500 text-sm mb-8 font-medium italic">Se generará un archivo CSV con {filtradas.length} registros.</p>
            <div className="flex flex-col gap-3">
              <button onClick={handleExportarExcel} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg active:scale-95">Confirmar y Descargar</button>
              <button onClick={() => setShowConfirmExcel(false)} className="w-full py-4 text-slate-400 font-black text-[10px] uppercase">Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EXPEDIENTE DETALLADO */}
      {reporteSeleccionado && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setReporteSeleccionado(null)}></div>
          <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-emerald-100 animate-in zoom-in-95">
            
            <div className="p-7 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-800 text-white rounded-xl flex items-center justify-center shadow-lg">
                  <FileText size={24} />
                </div>
                <div>
                  <h4 className="font-black text-slate-800 text-xl leading-none tracking-tighter">Detalle de Solicitud</h4>
                  <p className="text-emerald-600 text-[10px] font-black uppercase mt-1 tracking-widest">{reporteSeleccionado.folio}</p>
                </div>
              </div>
              <button onClick={() => setReporteSeleccionado(null)} className="p-3 hover:bg-white rounded-xl text-gray-400 transition-all">
                <X size={24} />
              </button>
            </div>

            <div className="p-8 space-y-8">
              <div className="p-6 bg-emerald-50 rounded-[1.5rem] border border-emerald-100 flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm">
                  <FileDown size={32} />
                </div>
                <div>
                  <p className="font-black text-slate-800 text-sm">FICHA TÉCNICA OFICIAL</p>
                  <p className="text-emerald-700 text-[10px] font-bold uppercase tracking-widest mt-1">Documento PDF para Auditoría</p>
                </div>
                <PDFDownloadLink 
                  document={<ExpedientePDF data={reporteSeleccionado} />} 
                  fileName={`Reporte_${reporteSeleccionado.folio}.pdf`}
                  className="w-full"
                >
                  {({ loading }) => (
                    <button className="w-full py-3 bg-emerald-600 text-white rounded-xl font-black text-xs uppercase transition-all shadow-md active:scale-95 disabled:bg-gray-300">
                      {loading ? 'Generando...' : 'Descargar PDF'}
                    </button>
                  )}
                </PDFDownloadLink>
              </div>

              {/* GRID DE DATOS REALES */}
              <div className="grid grid-cols-2 gap-y-6 gap-x-6">
                {[
                  { label: "Solicitante", val: reporteSeleccionado.solicitante, icon: <User size={14}/> },
                  { label: "Folio", val: reporteSeleccionado.folio, icon: <Hash size={14}/> },
                  { label: "Tipo Movimiento", val: reporteSeleccionado.tipo, icon: <Workflow size={14}/> },
                  { label: "Fecha Registro", val: reporteSeleccionado.fecha_solicitud, icon: <Calendar size={14}/> },
                ].map((item, i) => (
                  <div key={i} className="space-y-1">
                    <span className="text-[9px] font-black text-gray-400 uppercase flex items-center gap-2 tracking-widest leading-none">
                       {item.icon} {item.label}
                    </span>
                    <p className="font-bold text-slate-700 text-xs">{item.val}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                 <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest leading-none flex items-center gap-2">
                   <Box size={14}/> Justificación
                 </span>
                 <p className="text-xs text-slate-500 italic bg-gray-50 p-4 rounded-xl border border-gray-100">
                   "{reporteSeleccionado.justificacion}"
                 </p>
              </div>
            </div>

            <div className="p-6 bg-gray-50/50">
              <button 
                onClick={() => setReporteSeleccionado(null)}
                className="w-full py-4 bg-slate-800 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg active:scale-95"
              >
                Cerrar Expediente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}