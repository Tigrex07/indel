import React from 'react';
import { Search, Copy, CheckCircle2, Printer, ShieldCheck, Info } from "lucide-react";

export const GuiasData = {
  usuario: {
    titulo: "Manual de Usuario",
    subtitulo: "Personal Docente y Administrativo",
    color: "emerald", // Esto define el color del icono en el lector
    content: (
      <div className="space-y-10 p-2 pb-10">
        <section className="relative p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100 overflow-hidden">
          <div className="relative z-10">
            <h4 className="text-lg font-black text-emerald-800 flex items-center gap-2 mb-2 uppercase italic">Bienvenido</h4>
            <p className="text-sm text-emerald-700/80 leading-relaxed font-medium">
              Esta herramienta permite gestionar tus activos de forma transparente.
            </p>
          </div>
          <CheckCircle2 size={120} className="absolute top-[-20px] right-[-20px] text-emerald-200/50" />
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-slate-900 text-white w-8 h-8 rounded-full flex items-center justify-center text-xs font-black">01</span>
            <h4 className="text-xl font-black text-slate-800 uppercase italic tracking-tighter">Panel Principal</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 border-2 border-gray-50 rounded-2xl bg-white">
              <Search size={20} className="text-emerald-600 mb-4" />
              <p className="font-bold text-sm text-slate-800 mb-1">Búsqueda</p>
              <p className="text-xs text-gray-500 font-medium">Encuentra equipos por nombre o marbete al instante.</p>
            </div>
            <div className="p-5 border-2 border-gray-50 rounded-2xl bg-white">
              <Copy size={20} className="text-emerald-600 mb-4" />
              <p className="font-bold text-sm text-slate-800 mb-1">Copiado rápido</p>
              <p className="text-xs text-gray-500 font-medium">Usa el botón de copia para llevar el marbete a tus oficios.</p>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-slate-900 text-white w-8 h-8 rounded-full flex items-center justify-center text-xs font-black">02</span>
            <h4 className="text-xl font-black text-slate-800 uppercase italic tracking-tighter">Bajas Técnicas</h4>
          </div>
          <div className="bg-white border-2 border-dashed border-gray-200 rounded-[2rem] p-6 space-y-4">
              {["Ubica el equipo en la sección de 'Bajas'.", "Escribe el motivo del retiro.", "Genera y descarga el PDF oficial.", "Lleva el documento a firma con tu jefe."].map((step, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="bg-emerald-600 text-white p-1 rounded-full mt-0.5 shadow-lg shadow-emerald-200"><CheckCircle2 size={12}/></div>
                  <p className="text-sm font-bold text-slate-700">{step}</p>
                </div>
              ))}
          </div>
        </section>

        <div className="mt-10 pt-6 border-t border-gray-100 flex items-center gap-3 italic">
          <Info size={20} className="text-blue-500" />
          <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Soporte Técnico UTN • 2026</p>
        </div>
      </div>
    )
  },
  admin: {
    titulo: "Manual de Administrador",
    subtitulo: "Control Maestro del Sistema",
    color: "blue",
    content: (
      <div className="space-y-10 p-2 pb-10">
        {/* Resumen de Poderes */}
        <section className="relative p-6 bg-blue-50 rounded-[2rem] border border-blue-100 overflow-hidden">
          <div className="relative z-10">
            <h4 className="text-lg font-black text-blue-800 flex items-center gap-2 mb-2 uppercase italic">
               Consola de Administración
            </h4>
            <p className="text-sm text-blue-700/80 leading-relaxed font-medium">
              Tienes acceso a la gestión de usuarios, edición de activos y supervisión de solicitudes de baja. Tu rol es vital para mantener la veracidad del inventario.
            </p>
          </div>
          <ShieldCheck size={120} className="absolute top-[-20px] right-[-20px] text-blue-200/50" />
        </section>

        {/* Gestión de Usuarios */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-slate-900 text-white w-8 h-8 rounded-full flex items-center justify-center text-xs font-black">01</span>
            <h4 className="text-xl font-black text-slate-800 uppercase italic tracking-tighter">Gestión de Personal</h4>
          </div>
          <div className="p-5 border-2 border-gray-50 rounded-2xl bg-white space-y-3">
            <p className="text-xs text-gray-500 font-medium">
              En la sección de <strong>Usuarios</strong> puedes:
            </p>
            <ul className="space-y-2">
              <li className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div> Crear nuevos accesos (Docentes/Admins).
              </li>
              <li className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div> Inactivar cuentas (en lugar de borrarlas) para preservar el historial.
              </li>
              <li className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div> Resetear claves y editar roles de seguridad.
              </li>
            </ul>
          </div>
        </section>

        {/* Auditoría y Edificios */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-slate-900 text-white w-8 h-8 rounded-full flex items-center justify-center text-xs font-black">02</span>
            <h4 className="text-xl font-black text-slate-800 uppercase italic tracking-tighter">Control de Ubicaciones</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 border-2 border-gray-50 rounded-2xl bg-white">
              <p className="font-bold text-sm text-slate-800 mb-2 italic">Edificios y Aulas</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Supervisa qué activos pertenecen a cada zona. Si un aula cambia de nombre o propósito, asegúrate de actualizarlo para evitar confusiones en los resguardos.
              </p>
            </div>
            <div className="p-5 border-2 border-gray-50 rounded-2xl bg-white">
              <p className="font-bold text-sm text-slate-800 mb-2 italic">Grupos/Categorías</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Clasifica los activos (Ej: Cómputo, Mobiliario). Una buena categorización permite obtener estadísticas precisas en el Dashboard.
              </p>
            </div>
          </div>
        </section>

        {/* Supervisión de Bajas */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-slate-900 text-white w-8 h-8 rounded-full flex items-center justify-center text-xs font-black">03</span>
            <h4 className="text-xl font-black text-slate-800 uppercase italic tracking-tighter">Aprobación de Bajas</h4>
          </div>
          <div className="bg-slate-900 rounded-[2rem] p-6 text-white shadow-xl">
            <div className="flex gap-4 mb-4">
              <div className="p-3 bg-white/10 rounded-xl"><Info className="text-blue-400" /></div>
              <p className="text-xs font-medium text-blue-100 leading-relaxed">
                El sistema marca como "Inactivo" automáticamente cualquier equipo que pase por el proceso de Baja Técnica una vez aprobado por el administrador.
              </p>
            </div>
            <div className="space-y-3">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-300">Responsabilidad:</p>
              <p className="text-sm font-bold italic">"No apruebes una baja sin haber verificado físicamente el estado del equipo o contar con el oficio firmado."</p>
            </div>
          </div>
        </section>

        {/* Cierre */}
        <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-between">
          <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Nivel de Acceso: SuperAdmin</p>
          <div className="flex gap-2">
             <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
             <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
             <div className="w-2 h-2 bg-blue-100 rounded-full"></div>
          </div>
        </div>
          </div>
        )
      }
    };