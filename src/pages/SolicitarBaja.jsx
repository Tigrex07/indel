import { useState, useEffect } from "react";
import { FileMinus } from "lucide-react";

export default function SolicitudBaja() {
  const [idActivo, setIdActivo] = useState("");
  const [motivo, setMotivo] = useState("");
  const [idSolicitante, setIdSolicitante] = useState(null);
  const [mensaje, setMensaje] = useState("");

  // 🔹 Obtener usuario logueado
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
      setMensaje("Completa todos los campos");
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
      setMensaje("✅ Solicitud enviada correctamente");
      setIdActivo("");
      setMotivo("");
    } else {
      setMensaje("❌ Error al enviar la solicitud");
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-red-200 max-w-lg">
      <h2 className="text-xl font-bold text-red-700 mb-4 flex items-center gap-2">
        <FileMinus size={20} /> Solicitud de Baja
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-1">
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

        <div>
          <label className="block text-sm font-semibold mb-1">
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

        <button
          type="submit"
          className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2"
        >
          <FileMinus size={18} /> Enviar Solicitud
        </button>
      </form>

      {mensaje && (
        <p className="mt-4 text-sm font-semibold text-center">{mensaje}</p>
      )}
    </div>
  );
}
