import { useState, useEffect } from "react";
import { FileText, Search, Plus, Trash2 } from "lucide-react";

const API_INVENTARIO = "https://corporacionperris.com/backend/api/inventario.php";

export default function SolicitudForm() {

  /* =========================
     TIPOS (ALINEADO CON BD)
     1 = Asignación
     2 = Retiro
     3 = Movimiento
     4 = Préstamo
  ========================= */
  const TIPOS = [
    { id: 1, nombre: "Asignación" },
    { id: 2, nombre: "Retiro" },
    { id: 3, nombre: "Movimiento" },
    { id: 4, nombre: "Préstamo" }
  ];

  const [tipo, setTipo] = useState(1);
  const [inventario, setInventario] = useState([]);

  const [form, setForm] = useState({
    fecha_requerida: "",
    justificacion: ""
  });

  const [detalles, setDetalles] = useState([
    {
      marbete: "",
      id_inventario: "",
      descripcion: "",
      area: "",
      cantidad_solicitada: 1,
      numeros_marbetes: "",
      ubicacion_destino: ""
    }
  ]);

  /* =========================
     CARGAR INVENTARIO
  ========================= */
  useEffect(() => {
    fetch(API_INVENTARIO, { credentials: "include" })
      .then(r => r.json())
      .then(j => {
        if (j.success) setInventario(j.data);
      })
      .catch(err => console.error(err));
  }, []);

  /* =========================
     MANEJO DETALLES
  ========================= */
  const handleDetalleChange = (index, e) => {
    const nuevos = [...detalles];
    nuevos[index][e.target.name] = e.target.value;

    if (e.target.name === "marbete") {
      const encontrado = inventario.find(i => i.marbete === e.target.value);
      if (encontrado) {
        nuevos[index].id_inventario = encontrado.idInventario;
        nuevos[index].descripcion = encontrado.nombre_activo;
        nuevos[index].area = `${encontrado.edificio} / ${encontrado.aula}`;
      }
    }

    setDetalles(nuevos);
  };

  const agregarActivo = () => {
    setDetalles([
      ...detalles,
      {
        marbete: "",
        id_inventario: "",
        descripcion: "",
        area: "",
        cantidad_solicitada: 1,
        numeros_marbetes: "",
        ubicacion_destino: ""
      }
    ]);
  };

  const eliminarActivo = (index) => {
    setDetalles(detalles.filter((_, i) => i !== index));
  };

  /* =========================
     SUBMIT
  ========================= */
  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      id_tipo: tipo,
      fecha_requerida: form.fecha_requerida,
      justificacion: form.justificacion,
      detalles: detalles.map(d => ({
        id_inventario: d.id_inventario,
        cantidad_solicitada: d.cantidad_solicitada,
        numeros_marbetes: d.numeros_marbetes,
        ubicacion_destino: d.ubicacion_destino
      }))
    };

    console.log("Solicitud lista:", payload);
    alert("Solicitud preparada correctamente");
  };

  return (
    <div className="min-h-screen bg-emerald-50 flex justify-center items-start p-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-4xl p-8 rounded-xl shadow-lg border space-y-6"
      >

        {/* ENCABEZADO */}
        <div className="text-center">
          <h1 className="text-2xl font-extrabold text-emerald-700">
            FORMATO DE SOLICITUD
          </h1>
          <p className="text-sm text-gray-500">Sistema de Inventario</p>
        </div>

        {/* TIPO DE MOVIMIENTO (DISEÑO ORIGINAL RESTAURADO) */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">
            Tipo de movimiento
          </label>

          <div className="flex gap-4 flex-wrap">
            {TIPOS.map(t => (
              <label
                key={t.id}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition
                  ${tipo === t.id
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-gray-100 hover:bg-gray-200"
                  }`}
              >
                <input
                  type="radio"
                  value={t.id}
                  checked={tipo === t.id}
                  onChange={() => setTipo(t.id)}
                  className="hidden"
                />
                {t.nombre.toUpperCase()}
              </label>
            ))}
          </div>
        </div>

        {/* ACTIVOS */}
        {detalles.map((detalle, index) => (
          <div key={index} className="border rounded-xl p-4 space-y-4 relative">

            {detalles.length > 1 && (
              <button
                type="button"
                onClick={() => eliminarActivo(index)}
                className="absolute top-3 right-3 text-red-500"
              >
                <Trash2 size={18} />
              </button>
            )}

            <div className="grid grid-cols-2 gap-4">

              <Input
                label="Marbete"
                name="marbete"
                value={detalle.marbete}
                onChange={(e) => handleDetalleChange(index, e)}
                icon={<Search size={16} />}
              />

              <Input
                label="Descripción"
                value={detalle.descripcion}
                readOnly
              />

              <Input
                label="Área actual"
                value={detalle.area}
                readOnly
              />

              <Input
                label="Cantidad solicitada"
                name="cantidad_solicitada"
                type="number"
                min="1"
                value={detalle.cantidad_solicitada}
                onChange={(e) => handleDetalleChange(index, e)}
              />

              <Input
                label="Ubicación destino"
                name="ubicacion_destino"
                value={detalle.ubicacion_destino}
                onChange={(e) => handleDetalleChange(index, e)}
              />

              <Input
                label="Números de marbetes"
                name="numeros_marbetes"
                value={detalle.numeros_marbetes}
                onChange={(e) => handleDetalleChange(index, e)}
              />

            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={agregarActivo}
          className="flex items-center gap-2 text-emerald-700 font-semibold"
        >
          <Plus size={16} />
          Agregar otro activo
        </button>

        {/* FECHA REQUERIDA */}
        <Input
          label="Fecha requerida"
          type="date"
          value={form.fecha_requerida}
          onChange={(e) =>
            setForm({ ...form, fecha_requerida: e.target.value })
          }
        />

        {/* JUSTIFICACIÓN */}
        <div>
          <label className="block font-semibold mb-2">
            Justificación
          </label>
          <textarea
            rows="4"
            value={form.justificacion}
            onChange={(e) =>
              setForm({ ...form, justificacion: e.target.value })
            }
            className="w-full border rounded-lg px-3 py-2"
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

/* =========================
   COMPONENTE INPUT
========================= */
function Input({ label, icon, ...props }) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-1">{label}</label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            {icon}
          </div>
        )}
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
