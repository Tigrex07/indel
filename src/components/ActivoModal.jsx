import React, { useState, useEffect } from "react";
import { 
  X, Package, Calendar, Tag, MapPin, Hash, 
  FileText, DollarSign, Activity, Edit3, Save, RotateCcw, Info
} from "lucide-react";

export default function ActivoModal({
  activo,
  onClose,
  onSave,
  editMode,
  setEditMode
}) {
  const [localActivo, setLocalActivo] = useState(activo);

  useEffect(() => {
    setLocalActivo(activo);
  }, [activo]);

  if (!activo) return null;

  const handleChange = (e) => {
    setLocalActivo(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSaveClick = () => {
    if (onSave) onSave(localActivo);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[100] bg-slate-900/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-5xl rounded-[3rem] shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in duration-300">

        {/* 🟢 HEADER EVOLUCIONADO (Nombre + Clave) */}
        <div className="relative bg-gradient-to-r from-emerald-600 to-emerald-800 px-10 py-9 text-white">
          <div className="relative z-10 flex justify-between items-center">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                 <Package size={18} className="text-emerald-300" />
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-200">Expediente de Activo</span>
              </div>
              
              <div className="flex flex-wrap items-center gap-4">
                <h3 className="text-4xl font-black italic uppercase tracking-tighter leading-none">
                  {localActivo.nombre || "Sin Nombre"}
                </h3>
                {/* Badge de Clave al lado del nombre */}
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 shadow-lg">
                  <Hash size={16} className="text-emerald-300" />
                  <span className="text-sm font-black tracking-widest uppercase">{localActivo.clave || "S/C"}</span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-14 h-14 bg-white/10 hover:bg-white/20 text-white rounded-[1.5rem] flex items-center justify-center transition-all group border border-white/10"
            >
              <X size={28} className="group-hover:rotate-90 transition-transform" />
            </button>
          </div>
          
          {/* Decoración de fondo */}
          <div className="absolute top-0 right-0 opacity-10 translate-x-10 -translate-y-10">
             <Package size={220} strokeWidth={1} />
          </div>
        </div>

        {/* ⚪️ BODY SCROLLABLE */}
        <div className="overflow-y-auto px-10 py-8 space-y-10 custom-scrollbar bg-slate-50/50">

          {/* SECCIÓN 1: UBICACIÓN Y CONTROL */}
          <Section title="Ubicación y Control" icon={<MapPin size={18}/>}>
            <Grid>
              {/* El Marbete ahora tiene un lugar más protagónico al no estar la Clave al lado */}
              <Field label="Marbete de Identificación" value={localActivo.marbete} icon={<Tag size={14}/>} highlight />
              <Field label="Edificio / Aula" value={`${localActivo.edificio || '—'} / ${localActivo.aula || '—'}`} icon={<MapPin size={14}/>} />
              <Field label="Grupo Asignado" value={localActivo.grupo} icon={<Activity size={14}/>} />
              <Field label="Fecha de Alta" value={localActivo.fecha} icon={<Calendar size={14}/>} />
            </Grid>
          </Section>

          {/* SECCIÓN 2: DOCUMENTACIÓN */}
          <Section title="Documentación de Origen" icon={<FileText size={18}/>}>
            <Grid>
              <EditableField
                label="Tipo de Documento"
                name="tipo_documento"
                value={localActivo.tipo_documento}
                editMode={editMode}
                onChange={handleChange}
                icon={<FileText size={14}/>}
              />
              <EditableField
                label="Referencia / Factura"
                name="referencia"
                value={localActivo.referencia}
                editMode={editMode}
                onChange={handleChange}
                icon={<Info size={14}/>}
              />
              <EditableField
                label="Folio VR"
                name="folioVR"
                value={localActivo.folioVR}
                editMode={editMode}
                onChange={handleChange}
                icon={<Hash size={14}/>}
              />
              <EditableField
                label="Fecha del Documento"
                name="fecha_documento"
                value={localActivo.fecha_documento}
                editMode={editMode}
                onChange={handleChange}
                icon={<Calendar size={14}/>}
              />
            </Grid>
          </Section>

          {/* SECCIÓN 3: FINANCIERO */}
          <Section title="Valor e Impacto" icon={<DollarSign size={18}/>}>
            <Grid>
              <EditableField
                label="Importe (MXN)"
                name="importe"
                value={localActivo.importe}
                editMode={editMode}
                onChange={handleChange}
                icon={<DollarSign size={14}/>}
                isMoney
              />
              <div className="flex flex-col gap-2 lg:col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                   <Activity size={12}/> Estado Operativo
                </label>
                <div className={`px-5 py-3 rounded-2xl font-black text-xs uppercase inline-flex w-fit items-center gap-3 border transition-all ${localActivo.actividad == 1 ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm shadow-emerald-50' : 'bg-red-50 text-red-600 border-red-100 shadow-sm shadow-red-50'}`}>
                  <div className={`w-2.5 h-2.5 rounded-full animate-pulse ${localActivo.actividad == 1 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]'}`}></div>
                  {localActivo.actividad == 1 ? "Activo en Inventario" : "Inactivo / Baja de Sistema"}
                </div>
              </div>
            </Grid>
          </Section>

          {/* SECCIÓN 4: DESCRIPCIÓN */}
          <Section title="Descripción Técnica" icon={<Info size={18}/>}>
            {editMode ? (
              <textarea
                name="descripcion"
                value={localActivo.descripcion || ""}
                onChange={handleChange}
                className="w-full border-2 border-slate-100 rounded-[2.5rem] p-7 min-h-[160px] focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-medium text-slate-700 bg-white shadow-inner custom-scrollbar"
                placeholder="Detalla las características físicas o técnicas del activo..."
              />
            ) : (
              <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 min-h-[140px] whitespace-pre-wrap text-slate-600 font-medium leading-relaxed shadow-sm border-b-4 border-b-emerald-500/20">
                {localActivo.descripcion || "No existe una descripción técnica detallada para este activo."}
              </div>
            )}
          </Section>
        </div>

        {/* 🟢 FOOTER */}
        <div className="flex justify-between items-center px-10 py-8 border-t bg-white">
          <button
            onClick={onClose}
            className="group flex items-center gap-2 text-slate-400 hover:text-emerald-600 font-black text-[11px] uppercase tracking-[0.2em] transition-all"
          >
            <RotateCcw size={14} className="group-hover:-rotate-45 transition-transform"/> Salir de la ficha
          </button>

          <div className="flex gap-4">
            {editMode ? (
              <>
                <button
                  onClick={() => setEditMode(false)}
                  className="bg-slate-100 text-slate-500 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center gap-2"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveClick}
                  className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all flex items-center gap-2 active:scale-95"
                >
                  <Save size={18}/> Guardar Cambios
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 shadow-xl shadow-emerald-100 transition-all flex items-center gap-2 active:scale-95"
              >
                <Edit3 size={18}/> Editar Ficha
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* 🔹 COMPONENTES AUXILIARES */

function Section({ title, icon, children }) {
  return (
    <div className="animate-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center gap-3 mb-7 px-1">
        <div className="w-11 h-11 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm">
          {icon}
        </div>
        <h4 className="text-sm font-black text-slate-800 uppercase italic tracking-tight">
          {title}
        </h4>
        <div className="flex-1 h-[1px] bg-slate-100 ml-4 opacity-50"></div>
      </div>
      {children}
    </div>
  );
}

function Grid({ children }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7 px-1">
      {children}
    </div>
  );
}

function Field({ label, value, icon, highlight = false }) {
  return (
    <div className="flex flex-col gap-2.5">
      <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] flex items-center gap-2 px-1">
         {icon} {label}
      </label>
      <div className={`px-5 py-4 rounded-[1.3rem] font-bold text-[13px] min-h-[52px] flex items-center border transition-all ${highlight ? 'bg-emerald-50 border-emerald-100 text-emerald-700 shadow-inner' : 'bg-white border-slate-100 text-slate-600 shadow-sm'}`}>
        {value || "—"}
      </div>
    </div>
  );
}

function EditableField({ label, name, value, editMode, onChange, icon, isMoney = false }) {
  return (
    <div className="flex flex-col gap-2.5">
      <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] flex items-center gap-2 px-1">
         {icon} {label}
      </label>
      {editMode ? (
        <input
          name={name}
          value={value || ""}
          onChange={onChange}
          className="w-full bg-white border-2 border-emerald-100 rounded-[1.3rem] px-5 py-4 text-[13px] font-bold text-slate-700 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all shadow-sm"
        />
      ) : (
        <div className="px-5 py-4 bg-white border border-slate-100 rounded-[1.3rem] text-[13px] font-bold text-slate-600 min-h-[52px] flex items-center shadow-sm">
          {isMoney && value ? `$ ` : ""}{value || "—"}
        </div>
      )}
    </div>
  );
}
