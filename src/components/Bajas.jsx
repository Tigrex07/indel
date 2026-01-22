import { useEffect, useState } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  Printer,
  Trash2
} from "lucide-react";

export default function Bajas() {
  const [tab, setTab] = useState("nueva");
  const [activos, setActivos] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);
  const [selected, setSelected] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [search, setSearch] = useState("");
  const [filtroEdificio, setFiltroEdificio] = useState("Todos");
  const [filtroGrupo, setFiltroGrupo] = useState("Todos");

  // Cargar activos reales
  useEffect(() => {
    fetch("https://corporacionperris.com/backend/read.php")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setActivos(json.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // KPIs discretos
  const pendientes = solicitudes.filter((s) => s.estado === "pendiente").length;
  const aprobadas = solicitudes.filter((s) => s.estado === "aprobada").length;
  const rechazadas = solicitudes.filter((s) => s.estado === "rechazada").length;

  // Filtro inteligente
  const activosFiltrados = activos.filter((a) => {
    const match =
      a.activo.toLowerCase().includes(search.toLowerCase()) ||
      a.edificio.toLowerCase().includes(search.toLowerCase()) ||
      a.aula.toString().includes(search) ||
      a.grupo.toLowerCase().includes(search.toLowerCase());

    const edificioOK = filtroEdificio === "Todos" || a.edificio === filtroEdificio;
    const grupoOK = filtroGrupo === "Todos" || a.grupo === filtroGrupo;

    return match && edificioOK && grupoOK;
  });

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const enviarSolicitud = () => {
    if (selected.length === 0) return;

    const nueva = {
      id: solicitudes.length + 1,
      fecha: new Date().toLocaleString(),
      activos: activos.filter((a) => selected.includes(a.id)),
      estado: "pendiente"
    };

    setSolicitudes([...solicitudes, nueva]);
    setSelected([]);
    setModalOpen(false);
  };

  const cancelarSolicitud = (id) => {
    setSolicitudes(solicitudes.filter((s) => s.id !== id));
  };

  const aprobar = (id) => {
    setSolicitudes(
      solicitudes.map((s) =>
        s.id === id ? { ...s, estado: "aprobada" } : s
      )
    );
  };

  const rechazar = (id) => {
    setSolicitudes(
      solicitudes.map((s) =>
        s.id === id ? { ...s, estado: "rechazada" } : s
      )
    );
  };

  const imprimirSolicitud = (s) => {
    const contenido = `
SOLICITUD DE BAJA
-------------------------
Fecha: ${s.fecha}
ID: ${s.id}

Activos:
${s.activos.map((a) => `- ${a.activo} (${a.edificio}-${a.aula})`).join("\n")}

Firma usuario Master: ______________________
    `;
    const ventana = window.open("", "_blank");
    ventana.document.write(`<pre>${contenido}</pre>`);
    ventana.print();
  };
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-emerald-700">Bajas de Activos</h1>

      {/* Tabs */}
      <div className="flex gap-6 border-b pb-2">
        <button
          onClick={() => setTab("nueva")}
          className={`pb-2 font-semibold ${
            tab === "nueva"
              ? "text-emerald-700 border-b-2 border-emerald-700"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Nueva Solicitud
        </button>

        <button
          onClick={() => setTab("solicitudes")}
          className={`pb-2 font-semibold ${
            tab === "solicitudes"
              ? "text-emerald-700 border-b-2 border-emerald-700"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Solicitudes
        </button>
      </div>

      {/* =======================
          SECCIÓN 1 — NUEVA SOLICITUD
      ======================== */}
      {tab === "nueva" && (
        <section className="space-y-6">

          {/* KPIs discretos */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <KPI icon={<Clock size={24} />} label="Pendientes" value={pendientes} />
            <KPI icon={<CheckCircle size={24} />} label="Aprobadas" value={aprobadas} />
            <KPI icon={<XCircle size={24} />} label="Rechazadas" value={rechazadas} />
          </div>

          {/* SELECCIÓN DE ACTIVOS */}
          <div className="bg-white border rounded-xl p-6 shadow space-y-6">
            <h2 className="text-xl font-semibold text-emerald-700">Seleccionar activos</h2>

            {/* BUSCADOR + FILTROS */}
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="Buscar activo, edificio, aula, grupo…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-emerald-600"
              />

              <select
                value={filtroEdificio}
                onChange={(e) => setFiltroEdificio(e.target.value)}
                className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-600"
              >
                <option>Todos</option>
                {[...new Set(activos.map((a) => a.edificio))].map((ed) => (
                  <option key={ed}>{ed}</option>
                ))}
              </select>

              <select
                value={filtroGrupo}
                onChange={(e) => setFiltroGrupo(e.target.value)}
                className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-600"
              >
                <option>Todos</option>
                {[...new Set(activos.map((a) => a.grupo))].map((gr) => (
                  <option key={gr}>{gr}</option>
                ))}
              </select>
            </div>

            {/* TABLA PROFESIONAL */}
            <div className="max-h-[350px] overflow-y-auto rounded-lg border">
              <table className="w-full text-left table-fixed">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="p-3 w-12">Sel</th>
                    <th className="p-3">Activo</th>
                    <th className="p-3">Edificio</th>
                    <th className="p-3">Aula</th>
                    <th className="p-3">Grupo</th>
                  </tr>
                </thead>

                <tbody>
                  {activosFiltrados.map((a) => (
                    <tr key={a.id} className="border-t hover:bg-gray-50">
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={selected.includes(a.id)}
                          onChange={() => toggleSelect(a.id)}
                        />
                      </td>
                      <td className="p-3">{a.activo}</td>
                      <td className="p-3">{a.edificio}</td>
                      <td className="p-3">{a.aula}</td>
                      <td className="p-3">{a.grupo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setModalOpen(true)}
                disabled={selected.length === 0}
                className="bg-emerald-700 text-white px-6 py-3 rounded-lg hover:bg-emerald-800 disabled:opacity-40"
              >
                Enviar solicitud
              </button>
            </div>
          </div>
        </section>
      )}
      {/* =======================
          SECCIÓN 2 — SOLICITUDES
      ======================== */}
      {tab === "solicitudes" && (
        <section className="space-y-6">
          <div className="bg-white border rounded-xl p-6 shadow space-y-4">
            <h2 className="text-xl font-semibold text-emerald-700">
              Solicitudes enviadas
            </h2>

            {solicitudes.length === 0 ? (
              <p className="text-gray-500">No hay solicitudes aún…</p>
            ) : (
              <div className="space-y-4">
                {solicitudes.map((s) => (
                  <div
                    key={s.id}
                    className="border rounded-xl p-4 shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-lg">
                        Solicitud #{s.id}
                      </h3>

                      <EstadoBadge estado={s.estado} />
                    </div>

                    <p className="text-gray-600 text-sm mb-2">
                      Fecha: {s.fecha}
                    </p>

                    <div className="text-gray-700 text-sm mb-3">
                      {s.activos.map((a) => (
                        <div key={a.id}>• {a.activo}</div>
                      ))}
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => imprimirSolicitud(s)}
                        className="text-gray-700 hover:text-black"
                      >
                        <Printer size={20} />
                      </button>

                      {s.estado === "pendiente" && (
                        <>
                          <button
                            onClick={() => cancelarSolicitud(s.id)}
                            className="text-gray-600 hover:text-black"
                          >
                            <Trash2 size={20} />
                          </button>

                          <button
                            onClick={() => aprobar(s.id)}
                            className="text-emerald-700 hover:text-emerald-900"
                          >
                            <CheckCircle size={20} />
                          </button>

                          <button
                            onClick={() => rechazar(s.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <XCircle size={20} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* =======================
          MODAL DE CONFIRMACIÓN
      ======================== */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[350px]">
            <h2 className="text-xl font-bold text-emerald-700 mb-4">
              Confirmar solicitud
            </h2>

            <p className="text-gray-700 mb-6">
              ¿Deseas enviar esta solicitud al usuario Master?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cancelar
              </button>

              <button
                onClick={enviarSolicitud}
                className="px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800"
              >
                Enviar
              </button>
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

function KPI({ icon, label, value }) {
  return (
    <div className="bg-white border rounded-xl p-5 shadow-sm flex items-center gap-4">
      <div className="bg-gray-100 text-emerald-700 p-3 rounded-lg">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-emerald-700">{value}</p>
      </div>
    </div>
  );
}

function EstadoBadge({ estado }) {
  const styles = {
    pendiente: "bg-yellow-100 text-yellow-700",
    aprobada: "bg-green-100 text-green-700",
    rechazada: "bg-red-100 text-red-700"
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${styles[estado]}`}>
      {estado}
    </span>
  );
}