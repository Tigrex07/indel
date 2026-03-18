import React from 'react';
import { 
  Search, Copy, CheckCircle2, Printer, 
  ShieldCheck, Info, AlertTriangle, 
  FileText, Users, Box, RefreshCw, Layout 
} from "lucide-react";

export const GuiasData = {
  usuario: {
    titulo: "Manual Maestro de Usuario",
    subtitulo: "Gestión de Activos para Personal Docente y Administrativo",
    color: "emerald",
    content: (
      <div className="space-y-12 p-2 pb-10">
        {/* INTRODUCCIÓN */}
        <section className="relative p-8 bg-emerald-50 rounded-[2.5rem] border border-emerald-100 overflow-hidden">
          <div className="relative z-10">
            <h4 className="text-xl font-black text-emerald-800 flex items-center gap-2 mb-3 uppercase italic">Protocolo de Resguardo Institucional</h4>
            <p className="text-sm text-emerald-700/90 leading-relaxed font-medium max-w-2xl">
              Bienvenido al sistema de control patrimonial. Este manual tiene como objetivo guiarte en el uso correcto de la plataforma para asegurar que los activos asignados a tu nombre estén siempre actualizados y localizables. Recuerda que la veracidad de la información aquí vertida es fundamental para las auditorías institucionales.
            </p>
          </div>
          <CheckCircle2 size={140} className="absolute top-[-30px] right-[-30px] text-emerald-200/40" />
        </section>

        {/* SECCIÓN 1: VISUALIZACIÓN */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 text-white rounded-2xl flex items-center justify-center font-black shadow-lg shadow-emerald-200">01</div>
            <h4 className="text-xl font-black text-slate-800 uppercase italic">Control de Inventario Personal</h4>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed pl-1">
            Desde tu panel principal, puedes visualizar en tiempo real todos los activos vinculados a tu número de empleado. Cada registro contiene información crítica:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-1">
            <div className="p-5 bg-white border border-slate-100 rounded-3xl shadow-sm">
              <h5 className="font-black text-xs text-emerald-600 uppercase mb-2 tracking-widest">Búsqueda Inteligente</h5>
              <p className="text-xs text-slate-500 leading-relaxed">Usa el buscador para filtrar por marca (ej. Dell), tipo de equipo o ubicación. Esto es vital cuando manejas más de 20 activos simultáneamente.</p>
            </div>
            <div className="p-5 bg-white border border-slate-100 rounded-3xl shadow-sm">
              <h5 className="font-black text-xs text-emerald-600 uppercase mb-2 tracking-widest">Copiado de Datos</h5>
              <p className="text-xs text-slate-500 leading-relaxed">Al hacer clic en el icono de copiar junto al marbete, el sistema guarda el código en tu portapapeles. Úsalo para llenar oficios externos sin errores de dedo.</p>
            </div>
          </div>
        </section>

        {/* SECCIÓN 2: PROCESO DE BAJA */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black">02</div>
            <h4 className="text-xl font-black text-slate-800 uppercase italic">Protocolo de Baja Técnica</h4>
          </div>
          <div className="bg-slate-50 p-6 rounded-[2rem] space-y-4">
            <p className="text-sm text-slate-600 font-medium">Si un equipo sufre un daño irreparable o ha cumplido su vida útil, sigue este flujo obligatorio:</p>
            <ol className="space-y-3 ml-4">
              <li className="text-xs text-slate-500 flex gap-3">
                <span className="font-black text-emerald-600">1.</span>
                <span>Selecciona el activo en el módulo de <strong>"Bajas"</strong>.</span>
              </li>
              <li className="text-xs text-slate-500 flex gap-3">
                <span className="font-black text-emerald-600">2.</span>
                <span>Describe detalladamente la falla (ej. "No enciende tras descarga eléctrica" o "Pantalla rota").</span>
              </li>
              <li className="text-xs text-slate-500 flex gap-3">
                <span className="font-black text-emerald-600">3.</span>
                <span>Genera el documento PDF de solicitud. Este documento tiene validez legal interna.</span>
              </li>
              <li className="text-xs text-slate-500 flex gap-3">
                <span className="font-black text-emerald-600">4.</span>
                <span>Recaba la firma de tu jefe inmediato y entrega el equipo físicamente al almacén central.</span>
              </li>
            </ol>
          </div>
        </section>
      </div>
    )
  },

  admin: {
    titulo: "Consola de Administración Central",
    subtitulo: "Control Maestro de Infraestructura y Usuarios",
    color: "blue",
    content: (
      <div className="space-y-12 p-2 pb-10">
        {/* CABECERA ADMIN */}
        <section className="p-8 bg-slate-900 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h4 className="text-xl font-black flex items-center gap-2 mb-4 uppercase italic text-blue-400">
              <ShieldCheck size={24} /> Privilegios de Super-Administrador
            </h4>
            <p className="text-sm text-blue-100/70 leading-relaxed font-medium max-w-3xl">
              Este nivel de acceso te permite auditar la totalidad de la base de datos institucional. Tienes la facultad de modificar la arquitectura de edificios, gestionar el ciclo de vida de los activos y supervisar las cuentas de usuario. Cada cambio queda registrado para fines de auditoría.
            </p>
          </div>
          <Box size={180} className="absolute bottom-[-40px] right-[-40px] opacity-10" />
        </section>

        {/* GESTIÓN DE ESTRUCTURA */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black shadow-lg shadow-blue-200">01</div>
            <h4 className="text-xl font-black text-slate-800 uppercase italic">Mantenimiento de Infraestructura</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-blue-600">
                <RefreshCw size={20} />
                <h5 className="font-black text-xs uppercase">Edificios y Aulas</h5>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Antes de cargar nuevos activos, verifica que el edificio y aula existan en el sistema. El orden lógico es: Crear Edificio → Vincular Aula → Asignar Activo. Si borras un aula con activos, estos quedarán en un estado de "limbo" administrativo.
              </p>
            </div>
            <div className="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-blue-600">
                <Users size={20} />
                <h5 className="font-black text-xs uppercase">Gestión de Usuarios</h5>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Al crear un usuario nuevo (Docente/Administrador), asegúrate de que su número de empleado sea exacto, ya que es la llave única para las transferencias de resguardo. No elimines usuarios con activos; primero transfiere su carga.
              </p>
            </div>
          </div>
        </section>

        {/* AUDITORÍA Y MARBETES */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black">02</div>
            <h4 className="text-xl font-black text-slate-800 uppercase italic">Herramientas de Auditoría Física</h4>
          </div>
          <div className="bg-blue-50/50 p-8 rounded-[2.5rem] border border-blue-100 flex flex-col md:flex-row gap-8">
            <div className="flex-1 space-y-4">
              <h5 className="font-black text-sm text-blue-800 uppercase tracking-tighter">Impresión de Marbetes Masiva</h5>
              <p className="text-xs text-blue-700 leading-relaxed">
                En la sección inferior de "Recursos", puedes seleccionar múltiples activos para generar una hoja de impresión de marbetes. El sistema ajusta automáticamente el tamaño para que sea compatible con impresoras de etiquetas estándar.
              </p>
              <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase bg-white w-fit px-3 py-1 rounded-full border border-blue-200">
                <Printer size={12} /> Sugerencia: Usa papel adhesivo térmico.
              </div>
            </div>
            <div className="w-full md:w-64 bg-slate-900 rounded-3xl p-6 text-white shadow-xl">
              <div className="flex gap-4 mb-4">
                <Info className="text-blue-400" size={20} />
                <p className="text-[10px] font-medium text-blue-100 leading-relaxed uppercase tracking-widest">Atención</p>
              </div>
              <p className="text-xs italic text-blue-200">
                "Las bajas enviadas por usuarios no son automáticas. Tú debes validar físicamente el daño antes de cambiar el estatus a 'Inactivo' para que el sistema descuente el activo del patrimonio."
              </p>
            </div>
          </div>
        </section>
      </div>
    )
  }
};
