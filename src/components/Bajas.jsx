      {/* Modal de detalle */}
      {detalle && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-[500px] space-y-4 animate-fadeIn">
            <h2 className="text-xl font-bold text-emerald-700">Detalle de Solicitud #{detalle.id}</h2>
            <p><strong>Fecha:</strong> {detalle.fecha} — <strong>Hora:</strong> {detalle.hora}</p>
            <p><strong>Usuario:</strong> {detalle.usuario}</p>
            <p><strong>Tipo:</strong> {detalle.tipo}</p>
            <p><strong>Justificación:</strong> {detalle.justificacion}</p>

            <h3 className="font-semibold text-emerald-700 mt-3">Activos</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              {detalle.activos.map(a => (
                <li key={a.id}>{a.activo} — {a.edificio} / {a.aula} ({a.grupo})</li>
              ))}
            </ul>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setDetalle(null)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
              >
                Cerrar
              </button>
              {detalle.estado === "pendiente" && (
                <>
                  <button
                    onClick={() => { aprobar(detalle.id); setDetalle(null); }}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                  >
                    Aprobar
                  </button>
                  <button
                    onClick={() => { rechazar(detalle.id); setDetalle(null); }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    Rechazar
                  </button>
                </>
              )}
              {detalle.estado === "aprobada" && (
                <button
                  onClick={() => { desaprobar(detalle.id); setDetalle(null); }}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                >
                  Desaprobar
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =======================
   COMPONENTES AUXILIARES
======================= */

function KPI({ icon, label, value, color }) {
  const colors = {
    yellow: "bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-700 border-yellow-200",
    green: "bg-gradient-to-r from-green-100 to-green-50 text-green-700 border-green-200",
    red: "bg-gradient-to-r from-red-100 to-red-50 text-red-700 border-red-200"
  };
  return (
    <div className={`bg-white border rounded-xl p-5 shadow-md flex items-center gap-4 hover:shadow-lg transition-all`}>
      <div className={`p-3 rounded-lg ${colors[color]}`}>{icon}</div>
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}

function EstadoBadge({ estado }) {
  const styles = {
    pendiente: "bg-yellow-100 text-yellow-700 border border-yellow-200",
    aprobada: "bg-green-100 text-green-700 border border-green-200",
    rechazada: "bg-red-100 text-red-700 border border-red-200"
  };
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${styles[estado]}`}>
      {estado}
    </span>
  );
}
