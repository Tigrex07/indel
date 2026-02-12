import { useEffect, useState } from "react";
import { History, Search, ArrowRight, Calendar, User } from "lucide-react";

export default function Reportes() {
  const [eventos, setEventos] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  // 🔹 Cargar mocks en vez de API
  useEffect(() => {
    const mockEventos = [
      {
        id: 1,
        fecha: "2026-02-10",
        hora: "09:15",
        descripcion: "Asignación de equipo de cómputo",
        detalles: "Se asignó laptop Dell a Juan Pérez",
        usuario: "Admin"
      },
      {
        id: 2,
        fecha: "2026-02-11",
        hora: "14:30",
        descripcion: "Retiro de proyector",
        detalles: "Proyector Epson retirado por mantenimiento",
        usuario: "María López"
      },
      {
        id: 3,
        fecha: "2026-02-12",
        hora: "08:00",
        descripcion: "Préstamo de impresora",
        detalles: "Impresora HP prestada al área de Finanzas",
        usuario: "Carlos Ruiz"
      },
      {
        id: 4,
        fecha: "2026-02-12",
        hora: "10:45",
        descripcion: "Movimiento de mobiliario",
        detalles: "Se movieron 10 pupitres al edificio B",
        usuario: "Admin"
      }
    ];
    setEventos(mockEventos);
  }, []);

  /* ============================
        FILTRO POR RANGO
  ============================ */
  const filtrarEventos = () => {
    return eventos.filter(ev => {
      const fechaEv = new Date(ev.fecha);

      if (fechaInicio) {
        const inicio = new Date(fechaInicio);
        if (fechaEv < inicio) return false;
      }

      if (fechaFin) {
        const fin = new Date(fechaFin);
        fin.setHours(23, 59, 59);
        if (fechaEv > fin) return false;
      }

      return ev.descripcion.toLowerCase().includes(busqueda.toLowerCase());
    });
  };

  const eventosFiltrados = filtrarEventos();

  /* ============================
        AGRUPAR POR DÍA
  ============================ */
  const gruposPorDia = eventosFiltrados.reduce((acc, ev) => {
    const fecha = new Date(ev.fecha).toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });

    if (!acc[fecha]) acc[fecha] = [];
    acc[fecha].push(ev);
    return acc;
  }, {});

  return (
    <div className="space-y-10">

      {/* HEADER */}
      <div className="flex items-center gap-3">
        <History size={30} className="text-emerald-700" />
        <h2 className="text-3xl font-bold text-emerald-700 tracking-tight">
          Historial de Movimientos
        </h2>
      </div>

      {/* FILTROS */}
      <div className="flex flex-wrap gap-6 items-end">
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">Desde</label>
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className="border border-emerald-300 rounded-lg px-3 py-2 bg-white"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">Hasta</label>
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            className="border border-emerald-300 rounded-lg px-3 py-2 bg-white"
          />
        </div>

        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600"
            size={18}
          />
          <input
            className="pl-10 pr-3 py-2 border border-emerald-300 rounded-lg bg-white"
            placeholder="Buscar evento..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      {/* TIMELINE */}
      <div className="space-y-10">
        {Object.keys(gruposPorDia).map((dia) => (
          <div key={dia} className="space-y-4">
            <div className="flex items-center gap-2 text-emerald-700 font-semibold">
              <Calendar size={18} />
              <span>{dia}</span>
            </div>

            {gruposPorDia[dia].map((ev) => (
              <div
                key={ev.id}
                className="bg-white border border-emerald-200 rounded-xl p-5 shadow-sm hover:shadow-md transition"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <ArrowRight className="text-emerald-600 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-800">
                        {ev.descripcion}
                      </p>
                      {ev.detalles && (
                        <p className="text-gray-600 text-sm mt-1">
                          {ev.detalles}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-right text-gray-500 text-sm flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1">
                      <User size={14} />
                      <span>{ev.usuario}</span>
                    </div>
                    <span>{ev.hora}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}

        {eventosFiltrados.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 opacity-70">
            <History size={60} className="text-emerald-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700">
              No hay eventos registrados
            </h3>
            <p className="text-gray-500 mt-1">
              Aquí aparecerán los movimientos, ediciones y cambios del sistema.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
