import { useState, useEffect } from "react";

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
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-6xl rounded-2xl shadow-2xl border border-emerald-200 flex flex-col max-h-[85vh]">

        {/* HEADER */}
        <div className="flex justify-between items-center px-8 py-6 border-b">
          <h3 className="text-2xl font-bold text-emerald-700">
            Detalles del Activo
          </h3>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 text-xl"
          >
            ✕
          </button>
        </div>

        {/* BODY SCROLLABLE */}
        <div className="overflow-y-auto px-8 py-6 space-y-10">

          {/* INFORMACIÓN GENERAL */}
          <Section title="Información General">
            <Grid>
              <Field label="Nombre" value={localActivo.nombre} />
              <Field label="Clave" value={localActivo.clave} />
              <Field label="Fecha" value={localActivo.fecha} />
              <Field label="Marbete" value={localActivo.marbete} />
              <Field label="Edificio" value={localActivo.edificio} />
              <Field label="Aula" value={localActivo.aula} />
              <Field label="Grupo" value={localActivo.grupo} />
            </Grid>
          </Section>

          {/* DOCUMENTO */}
          <Section title="Documento">
            <Grid>
              <EditableField
                label="Tipo de Documento"
                name="tipo_documento"
                value={localActivo.tipo_documento}
                editMode={editMode}
                onChange={handleChange}
              />
              <EditableField
                label="Referencia"
                name="referencia"
                value={localActivo.referencia}
                editMode={editMode}
                onChange={handleChange}
              />
              <EditableField
                label="Folio VR"
                name="folioVR"
                value={localActivo.folioVR}
                editMode={editMode}
                onChange={handleChange}
              />
              <EditableField
                label="Fecha del Documento"
                name="fecha_documento"
                value={localActivo.fecha_documento}
                editMode={editMode}
                onChange={handleChange}
              />
            </Grid>
          </Section>

          {/* FINANCIERO */}
          <Section title="Información Financiera">
            <Grid>
              <EditableField
                label="Importe"
                name="importe"
                value={localActivo.importe}
                editMode={editMode}
                onChange={handleChange}
              />
              <Field
                label="Estado"
                value={localActivo.actividad == 1 ? "Activo" : "Inactivo"}
              />
            </Grid>
          </Section>

          {/* DESCRIPCIÓN GRANDE */}
          <Section title="Descripción">
            {editMode ? (
              <textarea
                name="descripcion"
                value={localActivo.descripcion || ""}
                onChange={handleChange}
                className="w-full border rounded-lg p-4 min-h-[150px] focus:ring-2 focus:ring-emerald-400 outline-none"
              />
            ) : (
              <div className="bg-gray-50 border rounded-lg p-4 min-h-[120px] whitespace-pre-wrap">
                {localActivo.descripcion || "Sin descripción"}
              </div>
            )}
          </Section>

        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-4 px-8 py-6 border-t bg-gray-50">
          {editMode && (
            <button
              onClick={handleSaveClick}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Guardar
            </button>
          )}

          <button
            onClick={() => setEditMode(!editMode)}
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition"
          >
            {editMode ? "Cancelar" : "Editar"}
          </button>

          <button
            onClick={onClose}
            className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
}

/* 🔹 COMPONENTES INTERNOS */

function Section({ title, children }) {
  return (
    <div>
      <h4 className="text-lg font-semibold text-emerald-700 mb-4">
        {title}
      </h4>
      {children}
    </div>
  );
}

function Grid({ children }) {
  return (
    <div className="grid grid-cols-3 gap-6 text-sm">
      {children}
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div className="flex flex-col">
      <label className="font-semibold mb-1">{label}</label>
      <div className="bg-gray-50 border rounded-lg px-3 py-2 min-h-[38px]">
        {value || "—"}
      </div>
    </div>
  );
}

function EditableField({ label, name, value, editMode, onChange }) {
  return (
    <div className="flex flex-col">
      <label className="font-semibold mb-1">{label}</label>
      {editMode ? (
        <input
          name={name}
          value={value || ""}
          onChange={onChange}
          className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-400 outline-none"
        />
      ) : (
        <div className="bg-gray-50 border rounded-lg px-3 py-2 min-h-[38px]">
          {value || "—"}
        </div>
      )}
    </div>
  );
}
