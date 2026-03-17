import React, { useState, useEffect, useMemo } from "react";
import { 
  BookOpen, Printer, Download, Search, 
  ShieldCheck, Eye, X, ChevronRight, Library, 
  Loader2, CheckCircle2, Info, Square, CheckSquare, Trash2, ListChecks,
  ChevronLeft
} from "lucide-react";
// Importamos pdf
import { PDFViewer, Document, Page, View, Text, Image, StyleSheet, pdf } from '@react-pdf/renderer';
import { GuiasData } from "../data/GuiasData";
import { GuiaPDF } from "../components/GuiaPDF"; 
import logoUtn from '../assets/utn.png'; 

const API_URL = "https://corporacionperris.com/backend/api/inventario.php";
const ITEMS_PER_PAGE = 10; 

// --- CORRECCIÓN DE ESTILOS PARA EVITAR "Invalid border style" ---
const pdfStyles = StyleSheet.create({
  page: { padding: 20, backgroundColor: '#fff', flexDirection: 'row', flexWrap: 'wrap', gap: 15 },
  card: { 
    width: 250, 
    height: 120, 
    padding: 10, 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderWidth: 1, 
    borderStyle: 'solid', // Especificamos el estilo explícitamente
    borderColor: '#000' 
  },
  logoContainer: { 
    width: '28%', 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderRightWidth: 1, 
    borderRightStyle: 'solid', 
    borderRightColor: '#000', 
    paddingRight: 5, 
    height: '90%' 
  },
  logo: { width: 32, height: 32 },
  slogan: { fontSize: 4, marginTop: 4, fontWeight: 'black', textAlign: 'center' },
  infoContainer: { width: '72%', paddingLeft: 8, justifyContent: 'center' },
  textMain: { fontSize: 7, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 2 },
  textSecondary: { fontSize: 6, marginBottom: 1, textTransform: 'uppercase' },
  marbeteGrande: { fontSize: 13, fontWeight: 'bold', marginVertical: 2 },
  footerRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 4, 
    borderTopWidth: 0.5, 
    borderTopStyle: 'solid', 
    borderTopColor: '#000', 
    paddingTop: 3 
  },
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
  const [busqueda, setBusqueda] = useState("");
  const [activos, setActivos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [seleccionados, setSeleccionados] = useState([]);
  const [guiaAbierta, setGuiaAbierta] = useState(null);
  const [isModalPDF, setIsModalPDF] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // --- FUNCIÓN DE DESCARGA REVISADA ---
  const descargarGuia = async (id) => {
    const guia = GuiasData[id];
    if (!guia) return;

    try {
      // Creamos la instancia del documento
      const doc = <GuiaPDF id={id} data={guia} />;
      
      // .toBlob() es lo que genera el archivo real
      const blob = await pdf(doc).toBlob();
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Manual_${id}_UTN.pdf`;
      
      document.body.appendChild(link);
      link.click();
      
      // Limpieza necesaria para no saturar la memoria
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);

    } catch (error) {
      console.error("Error al descargar:", error);
      // Si el error persiste, revisa que GuiaPDF no tenga bordes mal definidos
      alert("Error al generar el PDF. Verifica los estilos de GuiaPDF.");
    }
  };

  useEffect(() => {
    if (activeTab === "marbetes") {
      setLoading(true);
      fetch(API_URL, { credentials: "include" })
        .then((res) => res.json())
        .then((json) => {
          if (json.success && Array.isArray(json.data)) {
            setActivos(json.data.filter(i => i.actividad === 1));
          }
          setLoading(false);
        }).catch(() => setLoading(false));
    }
  }, [activeTab]);

  useEffect(() => {
    setCurrentPage(1);
  }, [busqueda]);

  const toggleSeleccion = (activo) => {
    const existe = seleccionados.find(s => s.idActivo === activo.idActivo);
    if (existe) {
      setSeleccionados(seleccionados.filter(s => s.idActivo !== activo.idActivo));
    } else {
      setSeleccionados([...seleccionados, activo]);
    }
  };

  const seleccionarTodosFiltrados = () => {
    const nuevos = filtrados.filter(f => !seleccionados.some(s => s.idActivo === f.idActivo));
    setSeleccionados([...seleccionados, ...nuevos]);
  };

  const filtrados = useMemo(() => {
    const q = busqueda.toLowerCase();
    return activos.filter(a => 
      (a.nombre || "").toLowerCase().includes(q) || 
      (a.marbete || "").toLowerCase().includes(q)
    );
  }, [busqueda, activos]);

  const totalPages = Math.ceil(filtrados.length / ITEMS_PER_PAGE);
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtrados.slice(start, start + ITEMS_PER_PAGE);
  }, [filtrados, currentPage]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* BANNER */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-emerald-700 to-teal-900 p-10 text-white shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl font-black tracking-tighter mb-4 italic uppercase">Recursos e Impresión</h1>
          <p className="text-emerald-100 text-lg font-medium">Acceso a manuales y generación de marbetes institucionales.</p>
        </div>
        <Library className="absolute right-[-20px] bottom-[-20px] text-white/10" size={240} />
      </div>

      {/* TABS */}
      <div className="flex p-1.5 bg-white border border-emerald-100 rounded-3xl w-fit shadow-sm">
        {["guias", "marbetes"].map((t) => (
          <button key={t} onClick={() => setActiveTab(t)} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === t ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400'}`}>
            {t === 'guias' ? 'Manuales' : 'Etiquetas'}
          </button>
        ))}
      </div>

      {activeTab === "guias" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {['admin', 'usuario'].map((id) => (
            <div key={id} className="bg-white rounded-[2.5rem] p-8 border border-emerald-100 shadow-sm hover:shadow-xl transition-all group">
              <div className={`w-14 h-14 rounded-2xl mb-6 flex items-center justify-center ${id === 'admin' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                {id === 'admin' ? <ShieldCheck size={32}/> : <BookOpen size={32}/>}
              </div>
              <h3 className="text-2xl font-black text-slate-800 uppercase italic">Guía {id === 'admin' ? 'Administrador' : 'Usuario'}</h3>
              <p className="text-gray-400 text-[11px] font-bold mt-2 uppercase tracking-tight">
                {id === 'admin' ? "Gestión de usuarios, edificios e inventario global." : "Consulta de activos y reportes de baja para personal."}
              </p>
              <div className="flex gap-3 mt-8">
                <button onClick={() => setGuiaAbierta(id)} className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase hover:bg-emerald-600 transition-colors shadow-md">Leer Ahora</button>
                <button onClick={() => descargarGuia(id)} className="p-4 bg-gray-50 text-gray-400 rounded-2xl hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                   <Download size={20}/>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ... resto de marbetes igual ... */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-emerald-100 shadow-sm flex flex-col">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600" size={20} />
                <input type="text" placeholder="Buscar por nombre o marbete..." className="w-full pl-12 pr-6 py-4 bg-emerald-50/50 rounded-2xl text-sm font-bold outline-none" value={busqueda} onChange={(e) => setBusqueda(e.target.value)}/>
              </div>
              <button onClick={seleccionarTodosFiltrados} className="flex items-center justify-center gap-2 px-6 py-4 bg-emerald-50 text-emerald-700 rounded-2xl font-black text-[10px] uppercase hover:bg-emerald-100 transition-all">
                <ListChecks size={18}/> Seleccionar {filtrados.length}
              </button>
            </div>
            
            <div className="space-y-2 flex-grow min-h-[400px]">
              {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-emerald-600" size={40} /></div>
              ) : paginatedItems.map(act => {
                const isSelected = seleccionados.some(s => s.idActivo === act.idActivo);
                return (
                  <div key={act.idActivo} onClick={() => toggleSeleccion(act)} className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer ${isSelected ? 'border-emerald-500 bg-emerald-50 shadow-sm' : 'border-transparent bg-gray-50'}`}>
                    {isSelected ? <CheckSquare className="text-emerald-600" /> : <Square className="text-gray-300" />}
                    <div>
                      <p className="text-[10px] font-black text-emerald-700 uppercase italic leading-none mb-1">{act.marbete}</p>
                      <h4 className="text-sm font-bold text-slate-800 uppercase leading-none">{act.nombre}</h4>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl flex flex-col h-full">
              <div className="flex justify-between items-center mb-6">
                <h4 className="font-black uppercase italic text-sm tracking-widest text-emerald-400">Cola de Impresión</h4>
                <span className="bg-emerald-500 text-slate-900 text-[10px] px-3 py-1 rounded-full font-black">{seleccionados.length}</span>
              </div>
              
              <div className="space-y-3 flex-grow max-h-80 overflow-y-auto mb-6 pr-2 custom-scrollbar">
                {seleccionados.length === 0 ? (
                  <div className="text-center py-10 opacity-20"><Printer size={48} className="mx-auto mb-2"/><p className="text-[9px] font-black uppercase tracking-widest">Lista vacía</p></div>
                ) : seleccionados.map(s => (
                  <div key={s.idActivo} className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/10 group">
                    <span className="text-[9px] font-bold truncate pr-2 uppercase">{s.nombre}</span>
                    <button onClick={(e) => { e.stopPropagation(); toggleSeleccion(s); }} className="text-slate-500 hover:text-red-400 transition-colors"><Trash2 size={14}/></button>
                  </div>
                ))}
              </div>

              {seleccionados.length > 0 && (
                <button onClick={() => setIsModalPDF(true)} className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-3xl font-black text-xs uppercase shadow-lg transition-all flex items-center justify-center gap-3">
                  <Printer size={20}/> Generar PDF ({seleccionados.length})
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL LECTOR ONLINE */}
      {guiaAbierta && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex justify-end">
          <div className="bg-white w-full max-w-xl h-full p-8 overflow-y-auto animate-in slide-in-from-right">
            <div className="flex justify-between items-center mb-10 border-b pb-6">
              <h2 className="text-xl font-black text-slate-800 uppercase italic">Manual {guiaAbierta}</h2>
              <button onClick={() => setGuiaAbierta(null)} className="p-2 bg-gray-100 rounded-full hover:bg-red-500 hover:text-white transition-all"><X /></button>
            </div>
            <div className="prose prose-slate max-w-none">{GuiasData[guiaAbierta].content}</div>
          </div>
        </div>
      )}

      {/* MODAL PDF MÚLTIPLE */}
      {isModalPDF && (
        <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-5xl h-[90vh] rounded-[2.5rem] overflow-hidden flex flex-col">
            <div className="p-6 border-b flex justify-between items-center">
              <p className="font-black text-xs uppercase italic text-emerald-700 tracking-widest">Etiquetas Oficiales UTN - Formato A4</p>
              <button onClick={() => setIsModalPDF(false)} className="bg-red-50 text-red-500 p-2 rounded-full hover:bg-red-500 hover:text-white transition-all"><X/></button>
            </div>
            <div className="flex-1 bg-slate-100 p-4">
               <PDFViewer width="100%" height="100%" className="border-none rounded-2xl overflow-hidden shadow-2xl">
                  <MarbetesMultiplesPDF seleccionados={seleccionados}/>
               </PDFViewer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}