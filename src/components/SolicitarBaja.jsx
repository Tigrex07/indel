import React, { useState, useEffect } from 'react';
import { 
  Document, Page, Text, View, StyleSheet, PDFViewer, Font, Image 
} from '@react-pdf/renderer';
// Iconos actualizados para coincidir con el Dashboard
import { 
  DocumentPlusIcon, 
  TrashIcon, 
  PlusCircleIcon, 
  ArrowDownTrayIcon,
  Squares2X2Icon 
} from '@heroicons/react/24/outline';

import logoUtn from '../assets/utn.png';
import logoIqs from '../assets/IQSIso.png'; 

Font.register({
  family: 'Helvetica-Bold',
  src: 'https://cdn.jsdelivr.net/npm/react-pdf/dist/fonts/Helvetica-Bold.afm'
});

// Estilos del PDF se mantienen profesionales para impresión
const styles = StyleSheet.create({
  page: { padding: 25, backgroundColor: '#fff', fontFamily: 'Helvetica' },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  logoLeft: { width: 55, height: 55 },
  logoRight: { width: 50, height: 50 },
  headerCenter: { flex: 1, textAlign: 'center' },
  titleMain: { fontSize: 10, fontFamily: 'Helvetica-Bold' },
  titleSub: { fontSize: 9, fontFamily: 'Helvetica-Bold', marginTop: 1 },
  titleDept: { fontSize: 8, marginTop: 1 },
  titleOficina: { fontSize: 7, marginTop: 1 },
  banner: { backgroundColor: '#10b981', color: '#fff', textAlign: 'center', fontSize: 9, padding: 3, marginTop: 8, fontFamily: 'Helvetica-Bold' },
  typeContainer: { flexDirection: 'row', borderWidth: 1, borderColor: '#000', borderTopWidth: 0 },
  typeCell: { flex: 1, flexDirection: 'row', alignItems: 'center', padding: 4, borderRightWidth: 1, borderColor: '#000', justifyContent: 'center' },
  checkbox: { width: 25, height: 12, borderWidth: 1, borderColor: '#000', marginHorizontal: 8, textAlign: 'center', fontSize: 9, fontFamily: 'Helvetica-Bold' },
  typeText: { fontSize: 7, fontFamily: 'Helvetica-Bold' },
  dataSection: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#000' },
  dataRow: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#000' },
  labelGray: { backgroundColor: '#e2e8f0', color: '#000', fontSize: 7, padding: 2, textAlign: 'center', fontFamily: 'Helvetica-Bold' },
  contentCell: { padding: 4, fontSize: 8, minHeight: 18, textTransform: 'uppercase' },
  tableHeader: { flexDirection: 'row', backgroundColor: '#10b981', color: '#fff', fontSize: 7, fontFamily: 'Helvetica-Bold', textAlign: 'center', marginTop: 8, borderWidth: 1, borderColor: '#000' },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#000', minHeight: 18, alignItems: 'center' },
  colSolic: { width: '10%', borderRightWidth: 1, borderColor: '#000', textAlign: 'center', fontSize: 8 },
  colEntr: { width: '10%', borderRightWidth: 1, borderColor: '#000', textAlign: 'center', fontSize: 8 },
  colDesc: { width: '45%', borderRightWidth: 1, borderColor: '#000', paddingLeft: 4, fontSize: 8 },
  colUbic: { width: '35%', paddingLeft: 4, fontSize: 7 },
  signatureGrid: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 35 },
  sigBox: { width: '22%', borderTopWidth: 1, borderColor: '#000', textAlign: 'center' },
  sigText: { fontSize: 5.5, marginTop: 2 },
  sectionLabel: { fontSize: 7, fontFamily: 'Helvetica-Bold', marginTop: 8 },
  textArea: { borderBottomWidth: 1, borderColor: '#000', fontSize: 8, padding: 4, minHeight: 25 },
  survey: { marginTop: 15, backgroundColor: '#f8fafc', padding: 8, borderTopWidth: 1, borderColor: '#000' },
  surveyTitle: { fontSize: 7, fontFamily: 'Helvetica-Bold', textAlign: 'center', marginBottom: 4 },
  surveyItem: { fontSize: 6.5, marginBottom: 2 },
  metaFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, fontSize: 6 }
});

const SolicitudPdf = ({ data, items }) => (
  <Document>
    <Page size="LETTER" style={styles.page}>
      <View style={styles.header}>
        <Image style={styles.logoLeft} src={logoUtn} />
        <View style={styles.headerCenter}>
          <Text style={styles.titleMain}>UNIVERSIDAD TECNOLÓGICA DE NOGALES, SONORA</Text>
          <Text style={styles.titleSub}>Dirección de Administración y Finanzas</Text>
          <Text style={styles.titleDept}>Departamento de Recursos Materiales</Text>
          <Text style={styles.titleOficina}>Oficina de Inventarios</Text>
        </View>
        <Image style={styles.logoRight} src={logoIqs} />
      </View>

      <Text style={styles.banner}>SOLICITUD DE ACTIVOS</Text>

      <View style={styles.typeContainer}>
        {['ASIGNACION', 'RETIRO', 'MOVIMIENTO', 'PRESTAMO'].map(t => (
          <View key={t} style={styles.typeCell}>
            <Text style={styles.typeText}>{t}</Text>
            <View style={styles.checkbox}><Text>{data.tipo === t ? 'X' : ''}</Text></View>
          </View>
        ))}
      </View>

      <View style={styles.dataSection}>
        <View style={styles.dataRow}>
          <View style={{ flex: 1.5, borderRightWidth: 1 }}><Text style={styles.labelGray}>DIRECCIÓN SOLICITANTE:</Text><Text style={styles.contentCell}>{data.direccion}</Text></View>
          <View style={{ flex: 0.8, borderRightWidth: 1 }}><Text style={styles.labelGray}>FECHA SOLICITUD:</Text><Text style={styles.contentCell}>{data.fechaSolicitud}</Text></View>
          <View style={{ flex: 0.5 }}><Text style={styles.labelGray}>FOLIO No.</Text><Text style={[styles.contentCell, { color: '#dc2626', textAlign: 'center', fontFamily: 'Helvetica-Bold' }]}>{data.folio}</Text></View>
        </View>
        <View style={styles.dataRow}>
          <View style={{ flex: 1.5, borderRightWidth: 1 }}><Text style={styles.labelGray}>DEPARTAMENTO SOLICITANTE:</Text><Text style={styles.contentCell}>{data.departamento}</Text></View>
          <View style={{ flex: 1.3 }}><Text style={styles.labelGray}>FECHA EN QUE LO REQUIERE:</Text><Text style={styles.contentCell}>{data.fechaRequerida}</Text></View>
        </View>
      </View>

      <View style={styles.tableHeader}>
        <Text style={styles.colSolic}>CANT. SOLIC.</Text>
        <Text style={styles.colEntr}>CANT. ENTR.</Text>
        <Text style={styles.colDesc}>DESCRIPCION DEL MOBILIARIO O EQUIPO</Text>
        <Text style={[styles.colUbic, { borderRightWidth: 0 }]}>UBICARLO EN</Text>
      </View>
      {items.map((item, i) => (
        <View key={i} style={styles.tableRow}>
          <Text style={styles.colSolic}>{item.solic}</Text>
          <Text style={styles.colEntr}>{item.entr}</Text>
          <Text style={styles.colDesc}>{item.desc}</Text>
          <Text style={[styles.colUbic, { borderRightWidth: 0 }]}>{item.ubic}</Text>
        </View>
      ))}
      {Array(Math.max(0, 8 - items.length)).fill(0).map((_, i) => (
        <View key={`r-${i}`} style={styles.tableRow}>
          <Text style={styles.colSolic}></Text><Text style={styles.colEntr}></Text>
          <Text style={styles.colDesc}></Text><Text style={[styles.colUbic, { borderRightWidth: 0 }]}></Text>
        </View>
      ))}

      <Text style={styles.sectionLabel}>JUSTIFICACIÓN DE USO Y/O COMENTARIO ADICIONAL:</Text>
      <Text style={styles.textArea}>{data.justificacion}</Text>

      <View style={styles.signatureGrid}>
        <View style={styles.sigBox}><Text style={styles.sigText}>FIRMA DIRECTOR ÁREA</Text></View>
        <View style={styles.sigBox}><Text style={styles.sigText}>NOMBRE Y FIRMA RECIBE</Text></View>
        <View style={styles.sigBox}><Text style={styles.sigText}>Vo. Bo. RECURSOS MATERIALES</Text></View>
        <View style={styles.sigBox}><Text style={styles.sigText}>FECHA RECIBIDO INV.</Text></View>
      </View>

      <View style={styles.metaFooter}>
        <Text>F06PGRIN04.00</Text>
        <Text>Página 1 de 1</Text>
        <Text>GRACIAS !!!</Text>
        <Text>Rev. 00</Text>
      </View>
    </Page>
  </Document>
);

export default function SolicitarBaja() {
  const [isClient, setIsClient] = useState(false);
  const [data, setData] = useState({
    tipo: 'ASIGNACION', direccion: '', departamento: '',
    folio: '', fechaSolicitud: '', fechaRequerida: '', justificacion: ''
  });
  const [items, setItems] = useState([{ solic: '', entr: '', desc: '', ubic: '' }]);

  useEffect(() => { setIsClient(true); }, []);

  const updateItem = (i, f, v) => {
    const n = [...items]; n[i][f] = v; setItems(n);
  };

  return (
    <div className="flex h-screen bg-[#f1f5f9] text-[#1e293b] font-sans">
      {/* Sidebar de Edición - Estilo Dashboard */}
      <div className="w-[440px] border-r border-slate-200 overflow-y-auto p-8 bg-white shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <DocumentPlusIcon className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Nueva Solicitud</h2>
            <p className="text-xs text-slate-500 font-medium">Gestión de Movimientos de Activos</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">Tipo de Movimiento</label>
            <select 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all cursor-pointer"
              onChange={e => setData({...data, tipo: e.target.value})}
            >
              <option value="ASIGNACION">Asignación de Activo</option>
              <option value="RETIRO">Retiro de Activo</option>
              <option value="MOVIMIENTO">Movimiento Interno</option>
              <option value="PRESTAMO">Préstamo Temporal</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Folio Interno" placeholder="001-2026" value={data.folio} onChange={v => setData({...data, folio: v})} />
            <Input label="Fecha Solicitud" type="text" placeholder="12-Feb-26" value={data.fechaSolicitud} onChange={v => setData({...data, fechaSolicitud: v})} />
          </div>

          <Input label="Dirección Solicitante" placeholder="Ej. Dirección Académica" value={data.direccion} onChange={v => setData({...data, direccion: v})} />
          <Input label="Departamento" placeholder="Ej. Laboratorio de Cómputo" value={data.departamento} onChange={v => setData({...data, departamento: v})} />
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">Justificación</label>
            <textarea 
              placeholder="Describa el motivo del movimiento..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm h-24 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
              onChange={e => setData({...data, justificacion: e.target.value})}
            />
          </div>

          {/* Sección de Bienes - Estilo Tarjeta */}
          <div className="pt-6 border-t border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Squares2X2Icon className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Lista de Bienes</span>
              </div>
              <button 
                onClick={() => setItems([...items, { solic: '', entr: '', desc: '', ubic: '' }])}
                className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
              >
                <PlusCircleIcon className="w-4 h-4" />
                Añadir
              </button>
            </div>

            <div className="space-y-3">
              {items.map((it, i) => (
                <div key={i} className="bg-slate-50/50 p-4 rounded-xl border border-slate-200 relative group hover:bg-white hover:shadow-md transition-all">
                  <input 
                    placeholder="Descripción del bien o mobiliario..." 
                    className="w-full bg-transparent border-b border-slate-200 text-sm mb-3 pb-1 outline-none focus:border-emerald-500"
                    value={it.desc}
                    onChange={e => updateItem(i, 'desc', e.target.value)}
                  />
                  <div className="flex gap-3">
                    <input placeholder="Cant." className="w-16 bg-white border border-slate-200 rounded-lg p-2 text-xs focus:border-emerald-500 outline-none" value={it.solic} onChange={e => updateItem(i, 'solic', e.target.value)} />
                    <input placeholder="Ubicación destino..." className="flex-1 bg-white border border-slate-200 rounded-lg p-2 text-xs focus:border-emerald-500 outline-none" value={it.ubic} onChange={e => updateItem(i, 'ubic', e.target.value)} />
                    <button onClick={() => setItems(items.filter((_, idx) => idx !== i))} className="text-slate-300 hover:text-red-500 transition-colors">
                      <TrashIcon className="w-5 h-5"/>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Visor de PDF - Contenedor */}
      <div className="flex-1 p-8 flex flex-col">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-[0.2em]">Vista Previa del Documento</h3>
            <div className="flex gap-3">
                 <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
                    <ArrowDownTrayIcon className="w-4 h-4" />
                    Exportar
                 </button>
            </div>
        </div>
        
        <div className="flex-1 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          {isClient ? (
            <PDFViewer className="w-full h-full border-none">
              <SolicitudPdf data={data} items={items} />
            </PDFViewer>
          ) : (
            <div className="flex items-center justify-center h-full">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                        <DocumentPlusIcon className="w-6 h-6 text-emerald-600" />
                    </div>
                    <p className="text-slate-400 text-sm font-medium">Preparando documento...</p>
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Componente Reutilizable de Input con Estilo Dashboard
const Input = ({ label, onChange, ...props }) => (
  <div className="space-y-1">
    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">{label}</label>
    <input 
      {...props}
      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" 
      onChange={e => onChange(e.target.value)}
    />
  </div>
);