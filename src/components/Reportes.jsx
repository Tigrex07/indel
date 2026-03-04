import React, { useEffect, useState } from "react";
import { 
  History, Search, Download, FileText, 
  ArrowUpRight, Calendar, X, FileDown, 
  MapPin, User, Hash, Box, Layers3, 
  Workflow, CalendarDays, Filter
} from "lucide-react";
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

// --- 1. COMPONENTE DEL DOCUMENTO PDF (DISEÑO INSTITUCIONAL) ---
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
  footer: { position: 'absolute', bottom: 40, left: 40, right: 40, borderTop: 1, borderTopColor: '#f3f4f6', pt: 10, textAlign: 'center', fontSize: 8, color: '#9ca3af' }
});

const ExpedientePDF = ({ data }) => (
  <Document>
    <Page size="A4" style={stylesPDF.page}>
      <View style={stylesPDF.header}>
        <Text style={stylesPDF.title}>INDELTARIO <Text style={stylesPDF.brand}>AUDIT</Text></Text>
        <Text style={stylesPDF.subtitle}>Reporte Individual de Control Patrimonial</Text>
      </View>
      <View style={stylesPDF.section}>
        <View style={stylesPDF.grid}>
          <View style={stylesPDF.fieldBox}><Text style={stylesPDF.label}>Folio</Text><Text style={stylesPDF.value}>{data.folio}</Text></View>
          <View style={stylesPDF.fieldBox}><Text style={stylesPDF.label}>Fecha</Text><Text style={stylesPDF.value}>{data.fecha}</Text></View>
          <View style={stylesPDF.fieldBox}><Text style={stylesPDF.label}>Equipo</Text><Text style={stylesPDF.value}>{data.desc}</Text></View>
          <View style={stylesPDF.fieldBox}><Text style={stylesPDF.label}>Marca/Modelo</Text><Text style={stylesPDF.value}>{data.marca} {data.modelo}</Text></View>
          <View style={stylesPDF.fieldBox}><Text style={stylesPDF.label}>No. Serie</Text><Text style={stylesPDF.value}>{data.serie}</Text></View>
          <View style={stylesPDF.fieldBox}><Text style={stylesPDF.label}>Ubicación</Text><Text style={stylesPDF.value}>{data.area}</Text></View>
          <View style={stylesPDF.fieldBox}><Text style={stylesPDF.label}>Responsable</Text><Text style={stylesPDF.value}>{data.user}</Text></View>
          <View style={stylesPDF.fieldBox}><Text style={stylesPDF.label}>Estado</Text><Text style={stylesPDF.value}>{data.estado}</Text></View>
        </View>
      </View>
      <View style={stylesPDF.descBox}>
        <Text style={stylesPDF.descTitle}>RESUMEN DEL MOVIMIENTO</Text>
        <Text style={stylesPDF.descText}>{data.det}</Text>
      </View>
      <Text style={stylesPDF.footer}>Este documento es un extracto oficial generado por el sistema Indeltario. Fecha de emisión: {new Date().toLocaleString()}</Text>
    </Page>
  </Document>
);

// --- 2. COMPONENTE PRINCIPAL ---
export default function Reportes() {
  const [eventos, setEventos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroActivo, setFiltroActivo] = useState("Todos");
  const [reporteSeleccionado, setReporteSeleccionado] = useState(null);
  const [showConfirmExcel, setShowConfirmExcel] = useState(false);
  const [showConfirmPDF, setShowConfirmPDF] = useState(false);
  const [loading, setLoading] = useState(false);

  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  useEffect(() => {
    const datosReales = [
      { 
        id: "MOV-901", fecha: "2026-03-04", tipo: "Asignación", desc: "Laptop Dell Latitude 3420", 
        folio: "UTN-TIC-2026-0145", serie: "CN-0V7TRG-72200", marca: "Dell", modelo: "Latitude 3420",
        det: "Asignación a Docente de Tiempo Completo. El equipo cuenta con garantía vigente y software de seguridad instalado.", 
        user: "Admin_Patrimonio", area: "Edificio B", estado: "Completado"
      },
      { 
        id: "MOV-902", fecha: "2026-03-01", tipo: "Mantenimiento", desc: "Proyector BenQ MX550", 
        folio: "UTN-AUL-2024-0089", serie: "PDJ2J01934000", marca: "BenQ", modelo: "MX550 White",
        det: "Reporte de falla en lámpara. Se traslada a taller para diagnóstico y limpieza de filtros.", 
        user: "Soporte_Tec", area: "Edificio A", estado: "En Proceso"
      }
    ];
    setEventos(datosReales);
  }, []);

  const filtrarEventos = eventos.filter(ev => {
    const term = busqueda.toLowerCase();
    const matchBusqueda = ev.desc.toLowerCase().includes(term) || ev.folio.toLowerCase().includes(term);
    const matchFiltro = filtroActivo === "Todos" || ev.tipo === filtroActivo;
    const fechaEv = new Date(ev.fecha);
    const inicio = fechaInicio ? new Date(fechaInicio) : null;
    const fin = fechaFin ? new Date(fechaFin) : null;
    const matchFecha = (!inicio || fechaEv >= inicio) && (!fin || fechaEv <= fin);
    return matchBusqueda && matchFiltro && matchFecha;
  });

  const handleExportarExcel = () => {
    setLoading(true);
    setTimeout(() => {
      const csvContent = "data:text/csv;charset=utf-8,ID,Fecha,Equipo,Folio,Serie,Estado\n" + 
        filtrarEventos.map(e => `${e.id},${e.fecha},${e.desc},${e.folio},${e.serie},${e.estado}`).join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "Reporte_General_Indeltario.csv");
      document.body.appendChild(link);
      link.click();
      setLoading(false);
      setShowConfirmExcel(false);
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 px-4 font-sans animate-in fade-in duration-700">
      
      {/* HEADER */}
      <div className="bg-white p-10 rounded-3xl border border-emerald-100 shadow-xl shadow-emerald-500/5 flex flex-col md:flex-row justify-between items-center gap-8 group">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-emerald-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-emerald-200 group-hover:scale-105 transition-transform">
            <History size={40} />
          </div>
          <div className="space-y-1">
            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tighter">Reportes <span className="text-emerald-600 font-light"></span></h2>
            <p className="text-gray-500 font-medium text-sm">Control de trazabilidad patrimonial institucional.</p>
          </div>
        </div>
        <button 
          onClick={() => setShowConfirmExcel(true)}
          className="flex items-center gap-2.5 px-8 py-5 bg-emerald-600 text-white rounded-2xl font-extrabold text-xs uppercase tracking-widest hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all active:scale-95"
        >
          <Download size={18} /> Exportar Excel ({filtrarEventos.length})
        </button>
      </div>

      {/* FILTROS AVANZADOS */}
      <div className="bg-white p-8 rounded-3xl border border-emerald-100 shadow-sm space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
            <input 
              className="w-full pl-14 pr-6 py-4 bg-emerald-50/30 border border-emerald-100/50 rounded-xl outline-none font-medium text-gray-800 focus:bg-white focus:border-emerald-300 transition-all"
              placeholder="Buscar por equipo, serie o folio..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <div className="lg:col-span-3 relative">
            <CalendarDays className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={16} />
            <input type="date" className="w-full pl-14 pr-4 py-4 bg-emerald-50/30 border border-emerald-100/50 rounded-xl font-medium text-gray-800 text-xs outline-none" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
            <span className="absolute -top-6 left-2 text-[9px] font-extrabold text-gray-400 uppercase tracking-widest">Desde</span>
          </div>
          <div className="lg:col-span-3 relative">
            <CalendarDays className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={16} />
            <input type="date" className="w-full pl-14 pr-4 py-4 bg-emerald-50/30 border border-emerald-100/50 rounded-xl font-medium text-gray-800 text-xs outline-none" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
            <span className="absolute -top-6 left-2 text-[9px] font-extrabold text-gray-400 uppercase tracking-widest">Hasta</span>
          </div>
        </div>
      </div>

      {/* LISTADO */}
      <div className="space-y-4">
        {filtrarEventos.map((ev) => (
          <div key={ev.id} className="group bg-white p-7 rounded-3xl border border-emerald-100 shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 transition-all relative overflow-hidden">
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${ev.tipo === 'Mantenimiento' ? 'bg-amber-400' : 'bg-emerald-500'}`}></div>
            <div className="flex flex-col md:flex-row justify-between gap-6 ml-4">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg text-[10px] font-extrabold border border-emerald-100 uppercase tracking-widest">ID: {ev.id}</span>
                  <span className="text-gray-400 text-[10px] font-medium uppercase flex items-center gap-1.5 tracking-widest"><Calendar size={14} className="text-emerald-500" /> {ev.fecha}</span>
                </div>
                <h3 className="text-2xl font-extrabold text-gray-900 group-hover:text-emerald-600 transition-colors leading-none">{ev.desc}</h3>
                <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-3xl pl-4 border-l-4 border-emerald-100">{ev.det}</p>
              </div>
              <button 
                onClick={() => setReporteSeleccionado(ev)}
                className="p-5 bg-emerald-50 rounded-2xl text-emerald-300 group-hover:bg-emerald-600 group-hover:text-white transition-all border border-emerald-100 active:scale-95"
              >
                <ArrowUpRight size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: CONFIRMAR EXCEL GENERAL */}
      {showConfirmExcel && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 backdrop-blur-md bg-gray-900/10 animate-in fade-in">
          <div className="relative bg-white w-full max-w-sm rounded-3xl p-10 shadow-2xl text-center border border-emerald-100">
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 bg-emerald-50 text-emerald-600 border border-emerald-100 ${loading ? 'animate-spin' : ''}`}>
              <Download size={32} />
            </div>
            <h4 className="text-2xl font-extrabold text-gray-900 mb-2">¿Exportar Selección?</h4>
            <p className="text-gray-500 text-sm mb-8 font-medium">Se descargará un archivo Excel con los {filtrarEventos.length} registros filtrados.</p>
            {!loading && (
              <div className="flex flex-col gap-3">
                <button onClick={handleExportarExcel} className="w-full py-4 bg-emerald-600 text-white rounded-xl font-extrabold text-xs uppercase tracking-widest shadow-lg shadow-emerald-200 active:scale-95">Confirmar Descarga</button>
                <button onClick={() => setShowConfirmExcel(false)} className="w-full py-4 text-gray-400 font-extrabold text-[10px] uppercase">Cancelar</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: CONFIRMAR PDF INDIVIDUAL (Mismo diseño que el de Excel) */}
      {showConfirmPDF && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 backdrop-blur-md bg-gray-900/10 animate-in fade-in">
          <div className="relative bg-white w-full max-w-sm rounded-3xl p-10 shadow-2xl text-center border border-emerald-100">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 bg-emerald-50 text-emerald-600 border border-emerald-100">
              <FileDown size={32} />
            </div>
            <h4 className="text-2xl font-extrabold text-gray-900 mb-2">¿Descargar Reporte?</h4>
            <p className="text-gray-500 text-sm mb-8 font-medium">Se generará el archivo PDF para el folio:<br/><span className="text-emerald-600 font-bold">{reporteSeleccionado?.folio}</span></p>
            
            <div className="flex flex-col gap-3">
              {/* El Link del PDF solo se renderiza AQUÍ para evitar errores de conexión */}
              <PDFDownloadLink 
                document={<ExpedientePDF data={reporteSeleccionado} />} 
                fileName={`Expediente_${reporteSeleccionado?.folio}.pdf`}
                className="w-full"
              >
                {({ loading }) => (
                  <button 
                    onClick={() => setTimeout(() => setShowConfirmPDF(false), 1000)}
                    disabled={loading}
                    className="w-full py-4 bg-emerald-600 text-white rounded-xl font-extrabold text-xs uppercase tracking-widest shadow-lg shadow-emerald-200 active:scale-95 disabled:bg-gray-300"
                  >
                    {loading ? 'Generando archivo...' : 'Confirmar y Guardar'}
                  </button>
                )}
              </PDFDownloadLink>
              <button onClick={() => setShowConfirmPDF(false)} className="w-full py-4 text-gray-400 font-extrabold text-[10px] uppercase">Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* FORMULARIO: EXPEDIENTE */}
      {reporteSeleccionado && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/30 backdrop-blur-sm" onClick={() => setReporteSeleccionado(null)}></div>
          <div className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-emerald-100 animate-in zoom-in-95">
            
            <div className="p-7 border-b border-emerald-100 flex justify-between items-center bg-emerald-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
                  <FileText size={24} />
                </div>
                <div>
                  <h4 className="font-extrabold text-gray-900 text-xl leading-none">Expediente</h4>
                  <p className="text-emerald-700 text-[10px] font-extrabold uppercase mt-1 tracking-widest">{reporteSeleccionado.folio}</p>
                </div>
              </div>
              <button onClick={() => setReporteSeleccionado(null)} className="p-3 hover:bg-white rounded-xl text-gray-400 transition-all border border-transparent hover:border-emerald-100">
                <X size={24} />
              </button>
            </div>

            <div className="p-8 space-y-8">
              <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 flex flex-col items-center text-center gap-4 shadow-inner">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100">
                  <FileDown size={32} />
                </div>
                <div>
                  <p className="font-extrabold text-gray-900 text-sm">FICHA TÉCNICA DEL ACTIVO</p>
                  <p className="text-emerald-700 text-[10px] font-medium uppercase tracking-widest mt-1">Documento PDF Institucional</p>
                </div>
                
                {/* Botón simple que abre el modal de confirmación */}
                <button 
                  onClick={() => setShowConfirmPDF(true)}
                  className="w-full py-3 bg-white hover:bg-emerald-600 hover:text-white text-emerald-600 border border-emerald-100 rounded-xl font-extrabold text-xs transition-all uppercase tracking-widest shadow-sm active:scale-95"
                >
                  Descargar Reporte PDF
                </button>
              </div>

              {/* GRID DE DATOS */}
              <div className="grid grid-cols-2 gap-y-6 gap-x-6">
                {[
                  { label: "Hardware", val: reporteSeleccionado.desc, icon: <Box size={14}/> },
                  { label: "Serie", val: reporteSeleccionado.serie, icon: <Hash size={14}/> },
                  { label: "Área", val: reporteSeleccionado.area, icon: <MapPin size={14}/> },
                  { label: "Responsable", val: reporteSeleccionado.user, icon: <User size={14}/> },
                  { label: "Marca/Modelo", val: `${reporteSeleccionado.marca} ${reporteSeleccionado.modelo}`, icon: <Layers3 size={14}/> },
                  { label: "Tipo", val: reporteSeleccionado.tipo, icon: <Workflow size={14}/> },
                ].map((item, i) => (
                  <div key={i} className="space-y-1">
                    <span className="text-[9px] font-extrabold text-gray-400 uppercase flex items-center gap-2 tracking-widest leading-none">
                       {item.icon} {item.label}
                    </span>
                    <p className="font-medium text-gray-700 text-xs">{item.val}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-emerald-50/50">
              <button 
                onClick={() => setReporteSeleccionado(null)}
                className="w-full py-4 bg-emerald-600 text-white rounded-xl font-extrabold text-xs uppercase tracking-widest shadow-lg shadow-emerald-200 active:scale-95"
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
