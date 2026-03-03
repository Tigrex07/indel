import React, { useState, useMemo } from "react";
import { 
  Users, Search, ChevronRight, Package, 
  MapPin, ArrowLeft, Mail, Hash, 
  Download, Printer, Info, CheckCircle,
  AlertCircle, Settings, Clock, ShieldCheck
} from "lucide-react";

export default function Encargados() {
  const [busqueda, setBusqueda] = useState("");
  const [docenteSeleccionado, setDocenteSeleccionado] = useState(null);

  // --- MOCKS DE DATOS ---
  const encargados = [
    {
      id: 1,
      nombre: "Ing. Ricardo Ramírez",
      correo: "r.ramirez@utn.edu.mx",
      numEmpleado: "2023001",
      departamento: "Tecnologías de la Información",
      puesto: "Profesor de Tiempo Completo",
      ultimaActualizacion: "15 Feb 2024",
      estadoResguardo: "Firmado",
      activos: [
        { id: "INV-5001", nombre: "Laptop HP ProBook", serie: "5CG1234567", modelo: "450 G8", estado: "Excelente", ubicacion: "Aula 10 - Edificio A" },
        { id: "INV-5002", nombre: "Proyector BenQ", serie: "P-445566", modelo: "MX560", estado: "Bueno", ubicacion: "Aula 10 - Edificio A" },
        { id: "INV-5800", nombre: "Monitor Samsung 27'", serie: "SAM-8899", modelo: "T35F", estado: "Excelente", ubicacion: "Cúbiculo 5" }
      ]
    },
    {
      id: 2,
      nombre: "Lic. Martha Sánchez",
      correo: "m.sanchez@utn.edu.mx",
      numEmpleado: "2021045",
      departamento: "Ciencias Básicas",
      puesto: "Docente de Asignatura",
      ultimaActualizacion: "10 Ene 2024",
      estadoResguardo: "Pendiente",
      activos: [
        { id: "INV-9001", nombre: "Microscopio Digital", serie: "OPT-001", modelo: "Vision Pro", estado: "Nuevo", ubicacion: "Laboratorio Quimica" }
      ]
    }
  ];

  const filtrados = encargados.filter(e => 
    e.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    e.numEmpleado.includes(busqueda)
  );

  // --- SUB-COMPONENTE: TARJETA DE ESTADÍSTICA ---
  const StatCard = ({ label, value, icon, colorText, bgColor }) => (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
      <div className={`p-3 rounded-xl ${bgColor} ${colorText}`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
        <p className="text-xl font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );

  // --- VISTA 1: LISTADO PRINCIPAL ---
  if (!docenteSeleccionado) {
    return (
      <div className="p-6 md:p-10 bg-[#F0FDF4] min-h-screen font-sans text-slate-900">
        
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-[#166534] tracking-tight flex items-center gap-3">
            <Users size={32} /> Control de Encargados
          </h2>
          <p className="text-slate-500 text-sm mt-1">Gestión de resguardos y activos por docente</p>
        </div>

        {/* Dashboard de Resumen */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Docentes" value={encargados.length} icon={<Users size={20}/>} colorText="text-emerald-600" bgColor="bg-emerald-50" />
          <StatCard label="Equipos Asignados" value="4" icon={<Package size={20}/>} colorText="text-blue-600" bgColor="bg-blue-50" />
          <StatCard label="Mantenimiento" value="12" icon={<Settings size={20}/>} colorText="text-amber-600" bgColor="bg-amber-50" />
          <StatCard label="Por Firmar" value="1" icon={<AlertCircle size={20}/>} colorText="text-red-600" bgColor="bg-red-50" />
        </div>

        {/* Buscador */}
        <div className="mb-6 relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Buscar por nombre o # empleado..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm outline-none focus:border-[#2D8A56] transition-all"
          />
        </div>

        {/* Grid de Docentes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtrados.map(doc => (
            <div 
              key={doc.id}
              onClick={() => setDocenteSeleccionado(doc)}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-[#34D399] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-slate-100 text-slate-500 rounded-xl flex items-center justify-center font-bold text-lg border border-slate-200 group-hover:bg-[#2D8A56] group-hover:text-white transition-all">
                    {doc.nombre.charAt(0)}
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-md border ${
                    doc.estadoResguardo === 'Firmado' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'
                  }`}>
                    {doc.estadoResguardo.toUpperCase()}
                  </span>
                </div>
                <h3 className="font-bold text-slate-800 mb-1">{doc.nombre}</h3>
                <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mb-4">
                  <Mail size={12}/> {doc.correo}
                </p>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                <div className="flex items-center gap-2">
                  <Package size={16} className="text-[#2D8A56]" />
                  <span className="text-sm font-bold text-slate-600">{doc.activos.length} Activos</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-emerald-50 group-hover:text-[#2D8A56] transition-all">
                  <ChevronRight size={18} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- VISTA 2: DETALLE DE RESGUARDO (AL DAR CLICK) ---
  return (
    <div className="p-6 md:p-10 bg-[#F8FAFC] min-h-screen font-sans text-slate-900">
      
      <button 
        onClick={() => setDocenteSeleccionado(null)}
        className="flex items-center gap-2 text-slate-500 hover:text-[#2D8A56] font-bold text-sm mb-6 transition-colors px-3 py-1.5 hover:bg-white rounded-lg"
      >
        <ArrowLeft size={18} /> VOLVER AL LISTADO
      </button>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-8">
        <div className="bg-[#2D8A56] p-8 text-white relative overflow-hidden">
          {/* Decoración fondo */}
          <div className="absolute top-0 right-0 p-4 opacity-10">
             <ShieldCheck size={160} />
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-white text-[#2D8A56] rounded-2xl flex items-center justify-center text-3xl font-black shadow-xl">
                {docenteSeleccionado.nombre.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold">{docenteSeleccionado.nombre}</h2>
                    <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold border border-white/30 uppercase tracking-widest">
                        Docente verificado
                    </span>
                </div>
                <div className="flex flex-wrap gap-4 mt-2 text-emerald-50 opacity-90 text-sm font-medium">
                  <span className="flex items-center gap-1.5"><Mail size={14}/> {docenteSeleccionado.correo}</span>
                  <span className="flex items-center gap-1.5"><Hash size={14}/> ID: {docenteSeleccionado.numEmpleado}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <button className="flex-1 md:flex-none bg-white/10 hover:bg-white/20 p-3 rounded-xl border border-white/20 transition-all flex justify-center">
                <Printer size={20} />
              </button>
              <button className="flex-[2] md:flex-none bg-white text-[#166534] px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg hover:bg-emerald-50 transition-all">
                <Download size={18} /> GENERAR RESGUARDO PDF
              </button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-100 bg-slate-50/50 border-b border-slate-200">
          <InfoCard label="Departamento" value={docenteSeleccionado.departamento} />
          <InfoCard label="Puesto" value={docenteSeleccionado.puesto} />
          <InfoCard label="Última Auditoría" value={docenteSeleccionado.ultimaActualizacion} />
          <div className="p-5 flex items-center justify-center">
             <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black border ${
                 docenteSeleccionado.estadoResguardo === 'Firmado' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-red-100 text-red-700 border-red-200'
             }`}>
                {docenteSeleccionado.estadoResguardo === 'Firmado' ? <CheckCircle size={14}/> : <Clock size={14}/>}
                {docenteSeleccionado.estadoResguardo.toUpperCase()}
             </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Package size={22} className="text-[#2D8A56]" /> 
            Inventario Asignado <span className="text-slate-400 font-normal">({docenteSeleccionado.activos.length})</span>
        </h3>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full border-collapse">
            <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200">
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Identificación</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Descripción</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado Físico</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Ubicación Actual</th>
                <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Detalle</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {docenteSeleccionado.activos.map((act) => (
                <tr key={act.id} className="group hover:bg-[#F9FFF9] transition-colors">
                    <td className="px-6 py-4">
                        <span className="text-xs font-black text-[#2D8A56] bg-emerald-50 px-2 py-1 rounded border border-emerald-100">{act.id}</span>
                        <p className="text-[10px] font-mono font-bold text-slate-400 mt-2">S/N: {act.serie}</p>
                    </td>
                    <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-700">{act.nombre}</p>
                        <p className="text-[11px] text-slate-400 font-medium">Modelo: {act.modelo}</p>
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                            <span className="text-xs font-bold text-slate-600">{act.estado}</span>
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium bg-slate-100 w-fit px-3 py-1 rounded-lg">
                            <MapPin size={12} className="text-slate-400" /> {act.ubicacion}
                        </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                        <button className="p-2 text-slate-300 hover:text-[#2D8A56] hover:bg-emerald-50 rounded-lg transition-all">
                            <Info size={18} />
                        </button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}

// Sub-componente para los cuadros de info del docente
function InfoCard({ label, value }) {
    return (
        <div className="p-5 text-center md:text-left">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-sm font-bold text-slate-700">{value}</p>
        </div>
    );
}