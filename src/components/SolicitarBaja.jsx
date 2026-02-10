import { useState, useEffect } from "react";
import { FileText, Search } from "lucide-react";

const API_INVENTARIO = "https://corporacionperris.com/backend/api/inventario.php";

export default function SolicitarBaja() {
  const [tipo, setTipo] = useState("baja");

  const [form, setForm] = useState({
    idActivo: "",      // ahora será marbete
    descripcion: "",
    area: "",
    responsable: "",
    motivo: "",
    fecha: ""
  });

  const [inventario, setInventario] = useState([]);

  useEffect(() => {
    fetch(API_INVENTARIO, { credentials: "include" })
      .then(r => r.json())
      .then(j => j.success && setInventario(j.data));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    if (e.target.name === "idActivo") {
      const marbete = e.target.value;
      const encontrado = inventario.find(i => i.marbete === marbete);

      if (encontrado) {
        setForm(prev => ({
          ...prev,
          descripcion: encontrado.nombre_activo,
          area: `${encontrado.edificio} / ${encontrado.aula}`
        }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.idActivo || !form.responsable || !form.motivo) {
      alert("Completa los campos obligatorios");
      return;
    }

    console.log("Solicitud enviada:", { tipo, ...form });
    alert("✅ Solicitud enviada correctamente");
  };

  return (
    <div className="min-h-screen bg-emerald-50 flex justify-center items-start p-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-3xl p-8 rounded-xl shadow-lg border"
      >

        {/* ENCABEZADO */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold text-emerald-700">
            FORMATO DE MOVIMIENTO DE ACTIVO
          </h1>
          <p className="text-sm text-gray-500">Inventario Escolar</p>
        </div>

        {/* TIPO DE MOVIMIENTO */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Tipo de movimiento</label>
          <div className="flex gap-4">
            {["baja", "solicitud", "prestamo"].map(t => (
              <label
                key={t}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer
                  ${tipo === t ? "bg-emerald-600 text-white" : "bg-gray-100"}`}
              >
                <input
                  type="radio"
                  value={t}
                  checked={tipo === t}
                  onChange={() => setTipo(t)}
                  className="hidden"
                />
                {t.toUpperCase()}
              </label>
            ))}
          </div>
        </div>

        {/* DATOS DEL ACTIVO */}
        <Section title="Datos del Activo">
          <Input
            label="Marbete"
            name="idActivo"
            value={form.idActivo}
            onChange={handleChange}
            placeholder="Ej. A-1023"
            icon={<Search size={16} className="text-emerald-600" />}
            required
          />

          <Input
            label="Descripción"
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            readOnly
          />

          <Input
            label="Área / Aula"
            name="area"
            value={form.area}
            onChange={handleChange}
            readOnly
          />
        </Section>

        {/* DATOS DEL RESPONSABLE */}
        <Section title="Datos del Responsable">
          <Input
            label="Nombre del Responsable"
            name="responsable"
            value={form.responsable}
            onChange={handleChange}
            required
          />

          <Input
            label="Fecha"
            name="fecha"
            type="date"
            value={form.fecha}
            onChange={handleChange}
          />
        </Section>

        {/* MOTIVO */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Motivo del movimiento</label>
          <textarea
            name="motivo"
            value={form.motivo}
            onChange={handleChange}
            rows="4"
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Describe el motivo..."
          />
        </div>

        {/* BOTÓN */}
        <button
          type="submit"
          className="w-full bg-emerald-700 text-white py-3 rounded-lg font-semibold hover:bg-emerald-800 flex items-center justify-center gap-2"
        >
          <FileText size={18} />
          Enviar Solicitud
        </button>
      </form>
    </div>
  );
}

/* COMPONENTES AUXILIARES */

function Section({ title, children }) {
  return (
    <div className="mb-6">
      <h2 className="font-bold text-emerald-700 mb-3 border-b pb-1">{title}</h2>
      <div className="grid grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

function Input({ label, icon, ...props }) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-1">{label}</label>

      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</div>}

        <input
          {...props}
          className={`w-full border rounded-lg px-3 py-2 ${
            icon ? "pl-10" : ""
          }`}
        />
      </div>
    </div>
  );
}