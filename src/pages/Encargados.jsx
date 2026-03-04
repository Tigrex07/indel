import React, { useState } from "react";
import { 
  Users, Search, ChevronRight, Package, MapPin, ArrowLeft, 
  Mail, Hash, Download, CheckCircle, AlertCircle, 
  AlertTriangle, ArrowRightLeft, Camera, Calendar
} from "lucide-react";

export default function Encargados() {
  const [busqueda, setBusqueda] = useState("");
  const [docenteSeleccionado, setDocenteSeleccionado] = useState(null);

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
      diasSinAuditar: 95,
      activos: [
        { id: "INV-5001", nombre: "Laptop HP ProBook", serie: "5CG1234567", modelo: "450 G8", estado: "Excelente", ubicacion: "Aula 10 - Edificio A", tipo: "Permanente" },
        { id: "INV-5002", nombre: "Proyector BenQ", serie: "P-445566", modelo: "MX560", estado: "Bueno", ubicacion: "Aula 10 - Edificio A", tipo: "Temporal", vence: "2024-06-15" }
      ]
    }
  ];

  const filtrados = encargados.filter(e => 
    e.nombre.toLowerCase().includes(busqueda.toLowerCase()) || e.numEmpleado.includes(busqueda)
  );

  if (!docenteSeleccionado) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-emerald-700 flex items-center gap-3">
            <Users size={28} /> Control de Encargados
          </h1>
          <p className="text-gray-500 text-sm font-medium">Gestión y auditoría de resguardos</p>
        </div>

        {/* KPIs estilo Dashboard original */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-emerald-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
            <div className="bg-emerald-600 text-white p-3 rounded-lg"><Users size={24}/></div>
            <div><p className="text-gray-500 text-xs font-semibold uppercase">Docentes</p><p className="text-2xl font-bold text-emerald-700">12</p></div>
          </div>
          <div className="bg-white border border-emerald-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
            <div className="bg-emerald-600 text-white p-3 rounded-lg"><Package size={24}/></div>
            <div><p className="text-gray-500 text-xs font-semibold uppercase">Asignados</p><p className="text-2xl font-bold text-emerald-700">45</p></div>
          </div>
          <div className="bg-white border border-emerald-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
            <div className="bg-blue-600 text-white p-3 rounded-lg"><Calendar size={24}/></div>
            <div><p className="text-gray-500 text-xs font-semibold uppercase">Préstamos</p><p className="text-2xl font-bold text-blue-700">03</p></div>
          </div>
          <div className="bg-white border border-emerald-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
            <div className="bg-red-600 text-white p-3 rounded-lg"><AlertCircle size={24}/></div>
            <div><p className="text-gray-500 text-xs font-semibold uppercase">Alertas</p><p className="text-2xl font-bold text-red-700">02</p></div>
          </div>
        </div>

        {/* Buscador igual al Dashboard Home */}
        <div className="bg-white border border-emerald-200 rounded-xl p-6 shadow-sm">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600" size={18} />
            <input 
              type="text"
              placeholder="Buscar docente o # empleado..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtrados.map(doc => (
            <div key={doc.id} onClick={() => setDocenteSeleccionado(doc)} className="bg-white border border-emerald-100 rounded-xl shadow-sm hover:shadow-md hover:border-emerald-500 cursor-pointer p-6 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center font-bold text-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">{doc.nombre.charAt(0)}</div>
                {doc.diasSinAuditar > 90 && <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-[10px] font-bold uppercase flex items-center gap-1"><AlertTriangle size={12}/> Auditoría</span>}
              </div>
              <h3 className="font-bold text-gray-800 text-lg leading-tight mb-1">{doc.nombre}</h3>
              <p className="text-xs text-gray-500 font-medium flex items-center gap-2 mb-4"><Mail size={14} className="text-emerald-600"/> {doc.correo}</p>
              <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1"><Package size={14}/> {doc.activos.length} Activos</span>
                <ChevronRight size={18} className="text-emerald-300 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <button onClick={() => setDocenteSeleccionado(null)} className="flex items-center gap-2 text-emerald-600 hover:text-emerald-800 font-bold text-sm transition-colors"><ArrowLeft size={18} /> Volver a la lista</button>

      {/* Cabecera de Detalle - Colores Emerald 600/700 */}
      <div className="bg-white border border-emerald-200 rounded-xl shadow-sm overflow-hidden">
        <div className="bg-emerald-700 p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-emerald-600 rounded-2xl flex items-center justify-center text-3xl font-bold shadow-inner border border-emerald-500">{docenteSeleccionado.nombre.charAt(0)}</div>
            <div>
              <h2 className="text-2xl font-bold">{docenteSeleccionado.nombre}</h2>
              <div className="flex flex-wrap gap-4 mt-2 text-emerald-100 text-xs font-semibold uppercase tracking-wider">
                <span className="flex items-center gap-1.5"><Mail size={14}/> {docenteSeleccionado.correo}</span>
                <span className="flex items-center gap-1.5"><Hash size={14}/> Emp: {docenteSeleccionado.numEmpleado}</span>
              </div>
            </div>
          </div>
          <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 transition-all shadow-md border border-emerald-500">
            <Download size={18} /> Descargar PDF
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100 bg-gray-50/50">
          <div className="p-4 px-8 text-center md:text-left"><p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Departamento</p><p className="text-sm font-bold text-gray-700">{docenteSeleccionado.departamento}</p></div>
          <div className="p-4 px-8 text-center md:text-left"><p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Estado Resguardo</p><p className="text-sm font-bold text-emerald-600 flex justify-center md:justify-start items-center gap-2"><CheckCircle size={16}/> {docenteSeleccionado.estadoResguardo}</p></div>
          <div className="p-4 px-8 text-center md:text-left"><p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Última Auditoría</p><p className="text-sm font-bold text-gray-700">{docenteSeleccionado.ultimaActualizacion}</p></div>
        </div>
      </div>

      {/* Tabla de Activos - Estilo Dashboard Home */}
      <div className="bg-white border border-emerald-200 rounded-xl shadow-sm overflow-hidden">
        <div className="bg-emerald-600 px-6 py-4">
            <h3 className="font-bold text-white flex items-center gap-2 text-sm uppercase tracking-wider">
              <Package size={18}/> Activos bajo custodia
            </h3>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Activo</th>
                <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tipo</th>
                <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ubicación / Estado</th>
                <th className="px-6 py-3 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Acciones</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {docenteSeleccionado.activos.map((act) => (
                <tr key={act.id} className="hover:bg-emerald-50 transition-colors group text-sm">
                    <td className="px-6 py-4">
                        <p className="font-bold text-gray-800">{act.nombre}</p>
                        <p className="text-[10px] font-mono text-emerald-600 font-bold">ID: {act.id} • SN: {act.serie}</p>
                    </td>
                    <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded border ${act.tipo === 'Temporal' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                            {act.tipo.toUpperCase()}
                        </span>
                    </td>
                    <td className="px-6 py-4">
                        <p className="font-medium text-gray-600 flex items-center gap-1"><MapPin size={12}/> {act.ubicacion}</p>
                        <p className="text-[10px] text-emerald-600 font-bold uppercase">{act.estado}</p>
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><ArrowRightLeft size={16} /></button>
                            <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Camera size={16} /></button>
                            <button className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-all border border-emerald-100"><CheckCircle size={16} /></button>
                        </div>
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