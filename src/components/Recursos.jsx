import React, { useState, useEffect, useMemo } from "react";
import { 
  BookOpen, Printer, Download, Search, 
  ShieldCheck, X, Library, Loader2, 
  Square, CheckSquare, Trash2, 
  ListChecks, Dices, ChevronLeft, ChevronRight
} from "lucide-react";
import { PDFViewer, Document, Page, View, Text, Image, StyleSheet, pdf } from '@react-pdf/renderer';
import { GuiasData } from "../data/GuiasData";
import { GuiaPDF } from "../components/GuiaPDF"; 
import { CicloCuentaPDF } from "../components/CicloCuentapdf";
import logoUtn from '../assets/utn.png'; 

const API_URL = "https://corporacionperris.com/backend/api/inventario.php";
const ITEMS_PER_PAGE = 10; 
const ITEMS_PER_PAGE_AUDITORIA = 12;

// --- ESTILOS PDF MARBETES ---
const pdfStyles = StyleSheet.create({
  page: { padding: 20, backgroundColor: '#fff', flexDirection: 'row', flexWrap: 'wrap', gap: 15 },
  card: { width: 250, height: 120, padding: 10, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#000' },
  logoContainer: { width: '28%', alignItems: 'center', justifyContent: 'center', borderRightWidth: 1, borderRightColor: '#000', paddingRight: 5, height: '90%' },
  logo: { width: 32, height: 32 },
  slogan: { fontSize: 4, marginTop: 4, fontWeight: 'black', textAlign: 'center' },
  infoContainer: { width: '72%', paddingLeft: 8, justifyContent: 'center' },
  textMain: { fontSize: 7, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 2 },
  textSecondary: { fontSize: 6, marginBottom: 1, textTransform: 'uppercase' },
  marbeteGrande: { fontSize: 13, fontWeight: 'bold', marginVertical: 2 },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4, borderTopWidth: 0.5, borderTopColor: '#000', paddingTop: 3 },
  textFooter: { fontSize: 5.5, fontWeight: 'bold', textTransform: 'uppercase' }
});

const MarbetesMultiplesPDF = ({ seleccionados }) => (
  <Document>
    <Page size="A4" style={pdfStyles.page}>
      {seleccionados.map((activo, index) => (
        <View key={index} style={pdfStyles.card} wrap={false}>
          <View style={pdfStyles.logoContainer}>
            <Image src={logoUtn} style={pdfStyles.logo} />
            <Text style={pdfStyles.slogan}>OPCIÓN CON FUTURO</Text>
          </View>
          <View style={pdfStyles.infoContainer}>
            <Text style={pdfStyles.textMain}>UNIVERSIDAD TECNOLÓGICA DE NOGALES</Text>
            <Text style={pdfStyles.textSecondary}>FECHA: {activo.fecha || "MARZO 2026"}</Text>
            <Text style={pdfStyles.marbeteGrande}>{activo.marbete || "S/M"}</Text>
            <Text style={pdfStyles.textMain}>{activo.edificio} - {activo.aula || "S/U"}</Text>
            <View style={pdfStyles.footerRow}>
              <Text style={pdfStyles.textFooter}>{activo.nombre?.substring(0, 25)}</Text>
              <Text style={pdfStyles.textFooter}>{activo.serie || "S/N"}</Text>
            </View>
          </View>
        </View>
      ))}
    </Page>
  </Document>
);

export default function Recursos() {
  const [activeTab, setActiveTab] = useState("guias");
  const [activos, setActivos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [seleccionados, setSeleccionados] = useState([]);
  const [guiaAbierta, setGuiaAbierta] = useState(null);
  const [isModalPDF, setIsModalPDF] = useState(false);
  
  // Estados de Búsqueda y Paginación
  const [busquedaMarbetes, setBusquedaMarbetes] = useState("");
  const [busquedaManual, setBusquedaManual] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageAuditoria, setPageAuditoria] = useState(1);
  const [isManual, setIsManual] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(API_URL, { credentials: "include" })
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setActivos(json.data.filter(i => i.actividad === 1));
        }
        setLoading(false);
      }).catch(() => setLoading(false));
  }, []);

  // Lógica Filtrado Marbetes
  const filtradosMarbetes = useMemo(() => {
    const q = busquedaMarbetes.toLowerCase();
    return activos.filter(a => (a.nombre || "").toLowerCase().includes(q) || (a.marbete || "").toLowerCase().includes(q));
  }, [busquedaMarbetes, activos]);

  const paginatedMarbetes = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtradosMarbetes.slice(start, start + ITEMS_PER_PAGE);
  }, [filtradosMarbetes, currentPage]);

  // Lógica Filtrado Auditoría Manual
  const filtradosManual = useMemo(() => {
    const q = busquedaManual.toLowerCase();
    return activos.filter(a => (a.nombre || "").toLowerCase().includes(q) || (a.marbete || "").toLowerCase().includes(q));
  }, [busquedaManual, activos]);

  const paginadosManual = useMemo(() => {
    const start = (pageAuditoria - 1) * ITEMS_PER_PAGE_AUDITORIA;
    return filtradosManual.slice(start, start + ITEMS_PER_PAGE_AUDITORIA);
  }, [filtradosManual, pageAuditoria]);

  const totalPagesAuditoria = Math.ceil(filtradosManual.length / ITEMS_PER_PAGE_AUDITORIA);

  const generarAuditoriaAleatoria = () => {
    const grupos = activos.reduce((acc, curr) => {
      if (!acc[curr.aula]) acc[curr.aula] = [];
      acc[curr.aula].push(curr);
      return acc;
    }, {});
    let muestra = [];
    Object.keys(grupos).forEach(aula => {
      const aleatorios = grupos[aula].sort(() => 0.5 - Math.random()).slice(0, 2); 
      muestra = [...muestra, ...aleatorios];
    });
    setSeleccionados(muestra.map(a => ({ ...a, revisado: false })));
    setIsManual(false);
  };

  const descargarGuia = async (id) => {
    const guia = GuiasData[id];
    if (!guia) return;
    try {
      const doc = <GuiaPDF id={id} data={guia} />;
      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Manual_${id}_UTN.pdf`;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => { document.body.removeChild(link); URL.revokeObjectURL(url); }, 100);
    } catch (error) { alert("Error al generar el manual."); }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* BANNER */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-emerald-800 to-slate-900 p-10 text-white shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl font-black tracking-tighter mb-4 italic uppercase">Recursos e Impresión</h1>
          <p className="text-emerald-100 text-lg font-medium">Gestión de activos y auditoría física.</p>
        </div>
        <Library className="absolute right-[-20px] bottom-[-20px] text-white/10" size={240} />
      </div>

      {/* TABS NAVEGACIÓN */}
      <div className="flex p-1.5 bg-white border border-emerald-100 rounded-3xl w-fit shadow-sm">
        {["guias", "marbetes", "auditoria"].map((t) => (
          <button 
            key={t} 
            onClick={() => { setActiveTab(t); setSeleccionados([]); setIsManual(false); }}
            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === t ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:text-emerald-600'}`}
          >
            {t === 'guias' ? 'Manuales' : t === 'marbetes' ? 'Etiquetas' : 'Auditoría'}
          </button>
        ))}
      </div>

      <div className="min-h-[500px]">
        {/* PESTAÑA MANUALES */}
        {activeTab === "guias" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4">
            {['admin', 'usuario'].map((id) => (
              <div key={id} className="bg-white rounded-[2.5rem] p-8 border border-emerald-100 shadow-sm hover:shadow-xl transition-all">
                <div className={`w-14 h-14 rounded-2xl mb-6 flex items-center justify-center ${id === 'admin' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                  {id === 'admin' ? <ShieldCheck size={32}/> : <BookOpen size={32}/>}
                </div>
                <h3 className="text-2xl font-black text-slate-800 uppercase italic">Guía {id}</h3>
                <div className="flex gap-3 mt-8">
                  <button onClick={() => setGuiaAbierta(id)} className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase hover:bg-emerald-600 transition-colors shadow-md">Leer Ahora</button>
                  <button onClick={() => descargarGuia(id)} className="p-4 bg-gray-50 text-gray-400 rounded-2xl hover:bg-slate-900 hover:text-white transition-all shadow-sm"><Download size={20}/></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PESTAÑA ETIQUETAS */}
        {activeTab === "marbetes" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-4">
            <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-emerald-100 shadow-sm flex flex-col">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600" size={20} />
                  <input 
                    type="text" 
                    placeholder="Buscar marbete para impresión..." 
                    className="w-full pl-12 pr-6 py-4 bg-emerald-50/50 rounded-2xl text-sm font-bold outline-none" 
                    value={busquedaMarbetes} 
                    onChange={(e) => setBusquedaMarbetes(e.target.value)}
                  />
                </div>
                <button onClick={() => setSeleccionados(filtradosMarbetes)} className="flex items-center gap-2 px-6 py-4 bg-emerald-50 text-emerald-700 rounded-2xl font-black text-[10px] uppercase hover:bg-emerald-100 transition-all"><ListChecks size={18}/> Todo</button>
              </div>
              <div className="space-y-2">
                {loading ? <Loader2 className="animate-spin mx-auto text-emerald-600 mt-10" size={40}/> : paginatedMarbetes.map(act => (
                  <div key={act.idActivo} onClick={() => {
                    const existe = seleccionados.find(s => s.idActivo === act.idActivo);
                    setSeleccionados(existe ? seleccionados.filter(s => s.idActivo !== act.idActivo) : [...seleccionados, act]);
                  }} className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${seleccionados.some(s => s.idActivo === act.idActivo) ? 'border-emerald-500 bg-emerald-50' : 'border-transparent bg-gray-50'}`}>
                    {seleccionados.some(s => s.idActivo === act.idActivo) ? <CheckSquare className="text-emerald-600"/> : <Square className="text-gray-300"/>}
                    <div className="flex flex-col">
                      <p className="text-[10px] font-black text-emerald-700 uppercase leading-none mb-1">{act.marbete}</p>
                      <h4 className="text-sm font-bold text-slate-800 uppercase leading-none">{act.nombre}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <PanelCola seleccionados={seleccionados} setSeleccionados={setSeleccionados} setIsModalPDF={setIsModalPDF} type="etiquetas" />
          </div>
        )}

        {/* PESTAÑA AUDITORÍA */}
        {activeTab === "auditoria" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-4">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-10 rounded-[2.5rem] border border-emerald-100 shadow-sm">
                <Dices className="text-emerald-600 mb-6" size={48}/>
                <h2 className="text-3xl font-black italic uppercase text-slate-800 tracking-tighter leading-none">Control de Auditoría</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                  <button onClick={generarAuditoriaAleatoria} className="flex items-center justify-center gap-3 py-6 bg-emerald-600 text-white rounded-3xl font-black uppercase text-xs hover:bg-emerald-700 transition-all shadow-lg">
                    <Dices size={20}/> Muestra Aleatoria
                  </button>
                  <button onClick={() => setIsManual(!isManual)} className={`flex items-center justify-center gap-3 py-6 rounded-3xl font-black uppercase text-xs transition-all ${isManual ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                    <Search size={20}/> {isManual ? "Cerrar Buscador" : "Selección Manual"}
                  </button>
                </div>
              </div>

              {isManual && (
                <div className="bg-emerald-50/50 p-8 rounded-[3rem] border border-emerald-100 animate-in zoom-in-95 duration-200">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                    <div className="relative flex-1 w-full">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600" size={20} />
                      <input 
                        type="text" 
                        placeholder="Filtrar activos..." 
                        className="w-full pl-12 pr-6 py-4 bg-white rounded-2xl text-sm font-bold outline-none border border-emerald-100 shadow-sm" 
                        value={busquedaManual} 
                        onChange={(e) => {setBusquedaManual(e.target.value); setPageAuditoria(1);}}
                      />
                    </div>
                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-emerald-100">
                      <button onClick={() => setPageAuditoria(Math.max(1, pageAuditoria - 1))} className="p-1 hover:text-emerald-600" disabled={pageAuditoria === 1}><ChevronLeft size={20}/></button>
                      <span className="text-[10px] font-black uppercase italic text-slate-500">{pageAuditoria} / {totalPagesAuditoria || 1}</span>
                      <button onClick={() => setPageAuditoria(Math.min(totalPagesAuditoria, pageAuditoria + 1))} className="p-1 hover:text-emerald-600" disabled={pageAuditoria === totalPagesAuditoria}><ChevronRight size={20}/></button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {paginadosManual.map(act => {
                      const isSelected = seleccionados.some(s => s.idActivo === act.idActivo);
                      return (
                        <div key={act.idActivo} onClick={() => {
                            if(isSelected) setSeleccionados(seleccionados.filter(s => s.idActivo !== act.idActivo));
                            else setSeleccionados([...seleccionados, { ...act, revisado: false }]);
                          }} className={`p-4 rounded-2xl border transition-all cursor-pointer ${isSelected ? 'bg-emerald-600 border-emerald-600 text-white shadow-md' : 'bg-white border-emerald-100 hover:border-emerald-400'}`}>
                          <div className="flex flex-col">
                            <span className={`text-[9px] font-black uppercase ${isSelected ? 'text-white/80' : 'text-emerald-600'}`}>{act.marbete}</span>
                            <span className="text-[10px] font-bold uppercase truncate">{act.nombre}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            <PanelCola seleccionados={seleccionados} setSeleccionados={setSeleccionados} setIsModalPDF={setIsModalPDF} type="auditoria" />
          </div>
        )}
      </div>

      {/* MODALES */}
      {guiaAbierta && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex justify-end">
          <div className="bg-white w-full max-w-xl h-full p-8 overflow-y-auto animate-in slide-in-from-right duration-300 shadow-2xl">
            <div className="flex justify-between items-center mb-10 border-b pb-6">
              <h2 className="text-xl font-black text-slate-800 uppercase italic">Manual {guiaAbierta}</h2>
              <button onClick={() => setGuiaAbierta(null)} className="p-2 bg-gray-100 rounded-full hover:bg-red-500 hover:text-white transition-all"><X /></button>
            </div>
            <div className="prose prose-slate max-w-none">{GuiasData[guiaAbierta].content}</div>
          </div>
        </div>
      )}

      {isModalPDF && (
        <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-5xl h-[90vh] rounded-[2.5rem] overflow-hidden flex flex-col">
            <div className="p-6 border-b flex justify-between items-center">
              <p className="font-black text-xs uppercase italic text-emerald-700 tracking-widest">
                {activeTab === 'auditoria' ? 'Hoja de Auditoría Física' : 'Etiquetas Oficiales UTN'}
              </p>
              <button onClick={() => setIsModalPDF(false)} className="bg-red-50 text-red-500 p-2 rounded-full hover:bg-red-500 hover:text-white transition-all"><X/></button>
            </div>
            <div className="flex-1 bg-slate-100">
              <PDFViewer width="100%" height="100%" className="border-none">
                {activeTab === 'auditoria' 
                  ? <CicloCuentaPDF activos={seleccionados} titulo="AUDITORÍA DE INVENTARIO - UTN" />
                  : <MarbetesMultiplesPDF seleccionados={seleccionados} />
                }
              </PDFViewer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PanelCola({ seleccionados, setSeleccionados, setIsModalPDF, type }) {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl flex flex-col h-full sticky top-4">
        <div className="flex justify-between items-center mb-6">
          <h4 className="font-black uppercase italic text-sm tracking-widest text-emerald-400">
            {type === 'auditoria' ? 'En Auditoría' : 'Para Impresión'}
          </h4>
          <span className="bg-emerald-500 text-slate-900 text-[10px] px-3 py-1 rounded-full font-black">{seleccionados.length}</span>
        </div>
        <div className="space-y-3 flex-grow max-h-80 overflow-y-auto mb-6 pr-2 custom-scrollbar">
          {seleccionados.length === 0 ? (
            <div className="text-center py-10 opacity-20"><Printer size={48} className="mx-auto mb-2"/><p className="text-[9px] font-black uppercase tracking-widest text-white">Lista vacía</p></div>
          ) : seleccionados.map(s => (
            <div key={s.idActivo} className="flex justify-between items-center p-3 rounded-xl border border-white/10 bg-white/5 transition-all">
              <div className="flex flex-col truncate pr-2">
                <span className="text-[9px] font-black uppercase text-white">{s.marbete}</span>
                <span className="text-[8px] text-gray-400 truncate uppercase">{s.nombre}</span>
              </div>
              <button onClick={(e) => { e.stopPropagation(); setSeleccionados(seleccionados.filter(x => x.idActivo !== s.idActivo)); }} className="text-slate-500 hover:text-red-400 p-1"><Trash2 size={14}/></button>
            </div>
          ))}
        </div>
        {seleccionados.length > 0 && (
          <button onClick={() => setIsModalPDF(true)} className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-3xl font-black text-xs uppercase shadow-lg transition-all flex items-center justify-center gap-3">
            <Printer size={20}/> {type === 'auditoria' ? 'Generar Formato' : 'Imprimir Todo'}
          </button>
        )}
      </div>
    </div>
  );
}