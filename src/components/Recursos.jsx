import React, { useState, useEffect, useMemo } from "react";
import { 
  BookOpen, Printer, Download, Search, 
  ShieldCheck, Eye, X, ChevronRight, Library, 
  Loader2, CheckCircle2, Info
} from "lucide-react"; // <--- Corregido de lucide-center a lucide-react
import { PDFViewer, Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer';

// Importación de datos y recursos
import { GuiasData } from "../data/GuiasData";
import logoUtn from '../assets/utn.png'; 

const API_URL = "https://corporacionperris.com/backend/api/inventario.php";

// --- ESTILOS PARA EL PDF DEL MARBETE ---
const pdfStyles = StyleSheet.create({
  page: { width: 150, height: 250, padding: 15, alignItems: 'center', backgroundColor: '#fff' },
  header: { alignItems: 'center', marginBottom: 10 },
  logo: { width: 45, height: 45 },
  title: { fontSize: 7, fontWeight: 'bold', textAlign: 'center', marginTop: 5, color: '#065f46' },
  activoName: { fontSize: 9, textAlign: 'center', marginVertical: 15, textTransform: 'uppercase', fontWeight: 'bold' },
  barcodeSim: { backgroundColor: '#000', width: '100%', height: 35, marginBottom: 5 },
  clave: { fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
  footer: { position: 'absolute', bottom: 10, fontSize: 6, color: '#666', borderTopWidth: 1, borderTopColor: '#eee', width: '80%', textAlign: 'center', paddingTop: 5 }
});

const MarbetePDF = ({ activo }) => (
  <Document>
    <Page size={[160, 260]} style={pdfStyles.page}>
      <View style={pdfStyles.header}>
        <Image src={logoUtn} style={pdfStyles.logo} />
        <Text style={pdfStyles.title}>UNIVERSIDAD TECNOLÓGICA DE NOGALES</Text>
      </View>
      <Text style={pdfStyles.activoName}>{activo?.nombre || "SIN NOMBRE"}</Text>
      <View style={pdfStyles.barcodeSim} />
      <Text style={pdfStyles.clave}>{activo?.marbete || "000000"}</Text>
      <Text style={pdfStyles.footer}>SISTEMA DE INVENTARIOS 2026</Text>
    </Page>
  </Document>
);

export default function Recursos() {
  const [activeTab, setActiveTab] = useState("guias");
  const [busqueda, setBusqueda] = useState("");
  const [activos, setActivos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activoSeleccionado, setActivoSeleccionado] = useState(null);
  const [guiaAbierta, setGuiaAbierta] = useState(null);
  const [isModalPDF, setIsModalPDF] = useState(false);

  // Función para descargar la guía en formato TXT
  const descargarGuia = (id) => {
    const guia = GuiasData[id];
    const contenido = `GUÍA: ${guia.titulo}\n${guia.subtitulo}\n\nDescripción: ${id === 'admin' ? "Manual para administradores, gestión de usuarios, edificios y control de inventario global." : "Manual para docentes y personal administrativo, consulta de activos y solicitudes de baja."}\n\nFecha de emisión: Marzo 2026`;
    const element = document.createElement("a");
    const file = new Blob([contenido], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `Manual_${id}_UTN.txt`;
    document.body.appendChild(element);
    element.click();
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

  const filtrados = useMemo(() => {
    const q = busqueda.toLowerCase();
    return activos.filter(a => (a.nombre || "").toLowerCase().includes(q) || (a.marbete || "").includes(q));
  }, [busqueda, activos]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* BANNER */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-emerald-700 to-teal-900 p-10 text-white shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl font-black tracking-tighter mb-4 italic uppercase">Recursos y Soporte</h1>
          <p className="text-emerald-100 text-lg font-medium">Manuales de ayuda y herramientas de etiquetado.</p>
        </div>
        <Library className="absolute right-[-20px] bottom-[-20px] text-white/10" size={240} />
      </div>

      {/* TABS */}
      <div className="flex p-1.5 bg-white border border-emerald-100 rounded-3xl w-fit shadow-sm">
        {["guias", "marbetes"].map((t) => (
          <button 
            key={t}
            onClick={() => setActiveTab(t)}
            className={`flex items-center gap-2 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === t ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:text-emerald-600'}`}
          >
            {t === 'guias' ? <BookOpen size={16}/> : <Printer size={16}/>} {t === 'guias' ? 'Guías Rápidas' : 'Marbetes'}
          </button>
        ))}
      </div>

      {activeTab === "guias" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { id: 'admin', icon: ShieldCheck, title: 'Administrador' },
            { id: 'usuario', icon: BookOpen, title: 'Usuario/Docente' }
          ].map((card) => (
            <div key={card.id} className="bg-white rounded-[2.5rem] p-8 border border-emerald-100 shadow-sm hover:shadow-xl transition-all group">
              <div className={`w-14 h-14 rounded-2xl mb-6 flex items-center justify-center transition-transform group-hover:scale-110 ${card.id === 'admin' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                <card.icon size={32} />
              </div>
              
              <h3 className="text-2xl font-black text-slate-800 uppercase italic">Guía {card.title}</h3>
              
              {/* TEXTO EN GRIS (Caption que pediste) */}
              <p className="text-gray-400 text-xs font-medium mt-2 leading-relaxed">
                {card.id === 'admin' 
                  ? "Manual para administradores, gestión de usuarios, edificios y control de inventario global."
                  : "Manual para docentes y personal administrativo, consulta de activos y solicitudes de baja."}
              </p>

              <div className="flex gap-3 mt-8">
                <button 
                  onClick={() => setGuiaAbierta(card.id)} 
                  className={`flex-1 py-4 text-white rounded-2xl font-black text-[10px] uppercase transition-colors ${card.id === 'admin' ? 'bg-slate-900 hover:bg-blue-600' : 'bg-slate-900 hover:bg-emerald-600'}`}
                >
                  Leer Ahora
                </button>
                <button 
                  onClick={() => descargarGuia(card.id)}
                  className="p-4 bg-gray-50 text-gray-400 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all"
                >
                  <Download size={20}/>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* GENERADOR DE MARBETES */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-emerald-100 shadow-sm">
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600" size={22} />
              <input type="text" placeholder="Buscar activo..." className="w-full pl-14 pr-6 py-5 bg-emerald-50/30 border-none rounded-2xl text-sm font-bold outline-none" value={busqueda} onChange={(e) => setBusqueda(e.target.value)}/>
            </div>
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {loading ? <Loader2 className="animate-spin mx-auto text-emerald-600" /> : filtrados.map(act => (
                <div key={act.idActivo} onClick={() => setActivoSeleccionado(act)} className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all cursor-pointer ${activoSeleccionado?.idActivo === act.idActivo ? 'border-emerald-500 bg-emerald-50' : 'border-transparent bg-gray-50 hover:border-emerald-200'}`}>
                  <div><p className="text-[10px] font-black text-emerald-700 uppercase italic">{act.marbete}</p><h4 className="text-sm font-bold text-slate-800">{act.nombre}</h4></div>
                  <ChevronRight size={18} className={activoSeleccionado?.idActivo === act.idActivo ? 'text-emerald-600' : 'text-gray-300'} />
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="bg-white p-10 rounded-[2.5rem] border border-emerald-100 shadow-xl flex justify-center">
              {activoSeleccionado ? (
                <div className="w-40 h-60 border-2 border-slate-900 rounded-xl p-4 flex flex-col items-center justify-between shadow-2xl animate-in zoom-in-50">
                  <div className="text-center"><img src={logoUtn} className="w-10 h-10 mx-auto mb-1"/><p className="text-[5px] font-black uppercase italic">UTN</p></div>
                  <p className="text-[8px] font-black text-center uppercase leading-tight">{activoSeleccionado.nombre}</p>
                  <div className="w-full h-8 bg-slate-900"></div>
                </div>
              ) : <div className="w-40 h-60 border-2 border-dashed border-gray-100 rounded-2xl flex items-center justify-center text-gray-200"><Printer size={48}/></div>}
            </div>
            {activoSeleccionado && <button onClick={() => setIsModalPDF(true)} className="w-full py-5 bg-emerald-600 text-white rounded-3xl font-black text-xs uppercase shadow-xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-3"><Eye size={20}/> Ver para Imprimir</button>}
          </div>
        </div>
      )}

      {/* LECTOR LATERAL */}
      {guiaAbierta && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex justify-end">
          <div className="bg-white w-full max-w-xl h-full shadow-2xl animate-in slide-in-from-right p-8 overflow-y-auto">
            <div className="flex justify-between items-center mb-10 border-b pb-6">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-2xl shadow-lg text-white ${guiaAbierta === 'admin' ? 'bg-blue-600' : 'bg-emerald-600'}`}>
                   {guiaAbierta === 'admin' ? <ShieldCheck /> : <BookOpen />}
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-800 uppercase italic">{GuiasData[guiaAbierta].titulo}</h2>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{GuiasData[guiaAbierta].subtitulo}</p>
                </div>
              </div>
              <button onClick={() => setGuiaAbierta(null)} className="p-2 bg-gray-100 rounded-full hover:bg-red-500 hover:text-white transition-all"><X /></button>
            </div>
            {GuiasData[guiaAbierta].content}
          </div>
        </div>
      )}

      {/* MODAL PDF */}
      {isModalPDF && (
        <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl h-[90vh] rounded-[2rem] overflow-hidden flex flex-col">
            <div className="p-6 border-b flex justify-between items-center bg-white">
              <p className="font-black text-xs uppercase tracking-widest text-emerald-700 italic">Previsualización de Impresión</p>
              <button onClick={() => setIsModalPDF(false)} className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white p-2 rounded-full transition-all"><X/></button>
            </div>
            <div className="flex-1"><PDFViewer width="100%" height="100%" className="border-none"><MarbetePDF activo={activoSeleccionado}/></PDFViewer></div>
          </div>
        </div>
      )}
    </div>
  );
}