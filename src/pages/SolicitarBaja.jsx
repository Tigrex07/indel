import { useState, useEffect } from "react";
import { FileMinus, AlertCircle, CheckCircle } from "lucide-react";

export default function SolicitudBaja() {
  const [idActivo, setIdActivo] = useState("");
  const [motivo, setMotivo] = useState("");
  const [idSolicitante, setIdSolicitante] = useState(null);
  const [estado, setEstado] = useState(null); // success | error | null

  // Obtener usuario logueado
  useEffect(() => {
    fetch("https://corporacionperris.com/backend/api/me.php", {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setIdSolicitante(data.usuario.idUsuario);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!idActivo || !motivo) {
      setEstado({ tipo: "error", msg: "Completa todos los campos" });
      return;
    }

    const res = await fetch("https://corporacionperris.com/backend/api/solicitar_baja.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        idActivo,
        idSolicitante,
        motivo
      })
    });

    const data = await res.json();

    if (data.success) {
      setEstado({ tipo: "success", msg: "Solicitud enviada correctamente" });
      setIdActivo("");
      setMotivo("");
    } else {
      setEstado({ tipo: "error", msg: "Error al enviar la solicitud" });
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-red-200 max-w-xl space-y-6">

      {/* TÍTULO */}
      <div className="flex items-center gap-3">
        <FileMinus size={28} className="text-red-600" />
        <h2 className="text-2xl font-bold text-red-700 tracking-tight">
          Solicitud de Baja
        </h2>
      </div>

      {/* FORMULARIO */}
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* ID ACTIVO */}
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">
            ID del Activo
          </label>
          <input
            type="number"
            value={idActivo}
            onChange={(e) => setIdActivo(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400 outline-none"
            placeholder="Ej. 1023"
          />
        </div>

        {/* MOTIVO */}
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">
            Motivo de la baja
          </label>
          <textarea
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400 outline-none"
            rows="3"
            placeholder="Ej. Equipo dañado, obsoleto, pérdida..."
          />
        </div>

        {/* BOTÓN */}
        <button
          type="submit"
          className="w-full bg-red-600 text-white py-2.5 rounded-lg font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2 shadow-sm"
        >
          <FileMinus size={18} />
          Enviar Solicitud
        </button>
      </form>

      {/* MENSAJE DE ESTADO */}
      {estado && (
        <div
          className={`flex items-center gap-2 p-3 rounded-lg text-sm font-semibold ${
            estado.tipo === "success"
              ? "bg-green-100 text-green-700 border border-green-300"
              : "bg-red-100 text-red-700 border border-red-300"
          }`}
        >
          {estado.tipo === "success" ? (
            <CheckCircle size={18} />
          ) : (
            <AlertCircle size={18} />
          )}
          {estado.msg}
        </div>
      )}
    </div>
  );
}
