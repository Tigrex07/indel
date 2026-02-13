import { useEffect, useState, useMemo } from "react";
import {
  Search,
  DoorOpen,
  Plus,
  Pencil,
  X,
  ShieldOff,
  ShieldCheck
} from "lucide-react";

const API_URL = "https://corporacionperris.com/backend/api/aulas.php";

export default function AulasSection({
  idEdificio,
  nombreEdificio,
  claveEdificio,
  actividadEdificio,
  onBack,
  onSelectAula
}) {
  const [search, setSearch] = useState("");
  const [aulas, setAulas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState("activas");

  const [showModal, setShowModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [aulaActual, setAulaActual] = useState({
    idAula: null,
    nombre: "",
    clave: ""
  });

  /* =========================
     CARGAR AULAS
  ========================= */
  const cargarAulas = () => {
    if (!idEdificio) return;

    setLoading(true);

    fetch(`${API_URL}?edificio=${idEdificio}&estado=${filtroEstado}`, {
      credentials: "include",
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) setAulas(json.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    cargarAulas();
  }, [idEdificio, filtroEstado]);

  if (!idEdificio) {
    return (
      <div className="bg-white p-10 rounded-xl shadow border">
        <p className="text-gray-600">
          Selecciona un edificio…
        </p>
      </div>
    );
  }

  /* =========================
     FILTRO BUSQUEDA
  ========================= */
  const filtered = useMemo(() => {
    return aulas.filter(
      (a) =>
        a.nombre.toLowerCase().includes(search.toLowerCase()) ||
        a.clave.toString().includes(search)
    );
  }, [aulas, search]);

  /* =========================
     MODALES
  ========================= */
  const abrirCrear = () => {
    setModoEdicion(false);
    setAulaActual({ idAula: null, nombre: "", clave: "" });
    setShowModal(true);
  };

  const abrirEditar = (aula) => {
    setModoEdicion(true);
    setAulaActual({
      idAula: aula.idAula,
      nombre: aula.nombre,
      clave: aula.clave
    });
    setShowModal(true);
  };

  /* =========================
     GUARDAR
  ========================= */
  const guardarAula = async () => {
    if (!aulaActual.nombre || !aulaActual.clave) {
      alert("Completa todos los campos");
      return;
    }

    const metodo = modoEdicion ? "PUT" : "POST";

    const bodyData = {
      nombre: aulaActual.nombre,
      clave: aulaActual.clave,
      idEdificio
    };

    if (modoEdicion) {
      bodyData.idAula = aulaActual.idAula;
    }

    await fetch(API_URL, {
      method: metodo,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyData),
    });

    setShowModal(false);
    cargarAulas();
  };

  /* =========================
     TOGGLE ACTIVIDAD
  ========================= */
  const cambiarEstadoAula = async (aula) => {

    const mensaje =
      aula.actividad === 1
        ? "¿Deseas inactivar esta aula?"
        : "¿Deseas activar esta aula?";

    if (!window.confirm(mensaje)) return;

    await fetch(API_URL, {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idAula: aula.idAula }),
    });

    cargarAulas();
  };

  return (
    <div className="bg-white rounded-xl shadow-xl p-8 border border-emerald-200 space-y-8">

      {/* HEADER */}
      <div className="flex justify-between items-center flex-wrap gap-4">

        <button
          onClick={onBack}
          className="text-emerald-600 font-semibold hover:underline"
        >
          ← Volver a edificios
        </button>

        <h2 className="text-2xl font-bold text-emerald-700">
          Aulas — {nombreEdificio}
          <span className="ml-2 text-sm text-emerald-500 font-semibold">
            ({claveEdificio})
          </span>
        </h2>

        <div className="flex gap-3 items-center">
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="border border-emerald-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="activas">Activas</option>
            <option value="inactivas">Inactivas</option>
            <option value="todas">Todas</option>
          </select>

          <button
            onClick={abrirCrear}
            className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
          >
            <Plus size={18} />
            Nueva
          </button>
        </div>
      </div>

      {/* BUSCADOR */}
      <div className="flex items-center bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2">
        <Search size={18} className="text-emerald-600" />
        <input
          type="text"
          placeholder="Buscar aula..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent flex-1 ml-2 focus:outline-none"
        />
      </div>

      {loading && (
        <p className="text-center text-gray-500">
          Cargando aulas...
        </p>
      )}

      {!loading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {filtered.map((aula) => (
            <div
                key={aula.idAula}
                onClick={() =>
                  aula.actividad === 1 &&
                  onSelectAula({
                    idAula: aula.idAula,
                    nombre: aula.nombre,
                    clave: aula.clave
                  })
                }
                className={`relative group border rounded-xl p-5 shadow transition-all duration-300 cursor-pointer
                ${aula.actividad === 0
                  ? "opacity-60 bg-gray-50 cursor-not-allowed"
                  : "hover:shadow-lg hover:bg-emerald-100 hover:scale-[1.02]"
                }`}
              >

              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2 text-emerald-600">
                  <DoorOpen size={18} />
                  <span className="text-sm font-semibold">
                    {aula.clave}
                  </span>
                </div>

                <span className={`text-xs px-2 py-1 rounded-full 
                  ${aula.actividad === 1
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"}`}>
                  {aula.actividad === 1 ? "Activa" : "Inactiva"}
                </span>
              </div>

              <p className="font-bold text-gray-800">
                {aula.nombre}
              </p>

              {/* ICONOS HOVER */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition flex gap-2">

                {aula.actividad === 1 && (
                  <button
                    onClick={() => abrirEditar(aula)}
                    className="bg-white p-2 rounded-lg shadow hover:bg-emerald-100 transition"
                  >
                    <Pencil size={16} className="text-emerald-700" />
                  </button>
                )}

                <button
                  onClick={() => cambiarEstadoAula(aula)}
                  className={`bg-white p-2 rounded-lg shadow transition
                    ${aula.actividad === 1
                      ? "hover:bg-yellow-100"
                      : "hover:bg-green-100"}`}
                >
                  {aula.actividad === 1 ? (
                    <ShieldOff size={16} className="text-yellow-600" />
                  ) : (
                    <ShieldCheck size={16} className="text-green-600" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl space-y-4">

            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-emerald-600">
                {modoEdicion ? "Editar Aula" : "Nueva Aula"}
              </h3>

              <button onClick={() => setShowModal(false)}>
                <X size={18} />
              </button>
            </div>

            <input
              type="text"
              placeholder="Clave"
              value={aulaActual.clave}
              onChange={(e) =>
                setAulaActual({
                  ...aulaActual,
                  clave: e.target.value
                })
              }
              className="w-full border rounded-lg px-3 py-2"
            />

            <input
              type="text"
              placeholder="Nombre"
              value={aulaActual.nombre}
              onChange={(e) =>
                setAulaActual({
                  ...aulaActual,
                  nombre: e.target.value
                })
              }
              className="w-full border rounded-lg px-3 py-2"
            />

            <button
              onClick={guardarAula}
              className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition"
            >
              Guardar
            </button>

          </div>
        </div>
      )}
    </div>
  );
}
