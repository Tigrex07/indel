import { useState, useEffect, useMemo } from "react";
import { Search, Building2, Plus, Pencil, Trash2, X, ShieldOff, ShieldCheck } from "lucide-react";

const API_URL = "https://corporacionperris.com/backend/api/edificios.php";

export default function EdificiosSection({ onSelectEdificio }) {
  const [search, setSearch] = useState("");
  const [catalogoEdificios, setCatalogoEdificios] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filtroEstado, setFiltroEstado] = useState("activos");

  const [showModal, setShowModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [edificioActual, setEdificioActual] = useState({
    idEdificio: null,
    nombre: "",
    clave: ""
  });

  /* =========================
     CARGAR EDIFICIOS
  ========================= */
  const cargarEdificios = () => {
    setLoading(true);

    fetch(`${API_URL}?estado=${filtroEstado}`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setCatalogoEdificios(json.data);
        }
      })
      .catch((err) =>
        console.error("Error cargando edificios:", err)
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    cargarEdificios();
  }, [filtroEstado]);

  /* =========================
     FILTRO BUSQUEDA
  ========================= */
  const filtered = useMemo(() => {
    return catalogoEdificios.filter((e) =>
      e.nombre.toLowerCase().includes(search.toLowerCase()) ||
      e.clave.toString().includes(search)
    );
  }, [catalogoEdificios, search]);

  /* =========================
     MODALES
  ========================= */

  const abrirCrear = () => {
    setModoEdicion(false);
    setEdificioActual({ idEdificio: null, nombre: "", clave: "" });
    setShowModal(true);
  };

  const abrirEditar = (edificio) => {
    setModoEdicion(true);
    setEdificioActual({
      idEdificio: edificio.idEdificio,
      nombre: edificio.nombre,
      clave: edificio.clave
    });
    setShowModal(true);
  };

  /* =========================
     GUARDAR
  ========================= */
  const guardarEdificio = async () => {
    if (!edificioActual.nombre || !edificioActual.clave) {
      alert("Completa todos los campos");
      return;
    }

    const metodo = modoEdicion ? "PUT" : "POST";

    try {
      const bodyData = {
        nombre: edificioActual.nombre,
        clave: edificioActual.clave
      };

      if (modoEdicion) {
        bodyData.idEdificio = edificioActual.idEdificio;
      }

      const response = await fetch(API_URL, {
        method: metodo,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });

      const json = await response.json();

      if (json.success) {
        setShowModal(false);
        cargarEdificios();
      } else {
        alert(json.message || "Error al guardar");
      }

    } catch (error) {
      console.error("Error guardando:", error);
      alert("Error de conexión");
    }
  };

  /* =========================
     ACTIVAR / INACTIVAR
  ========================= */
  const cambiarEstadoEdificio = async (edificio) => {

    const mensaje =
      edificio.actividad === 1
        ? "¿Deseas inactivar este edificio?"
        : "¿Deseas activar este edificio?";

    if (!window.confirm(mensaje)) return;

    try {
      const response = await fetch(API_URL, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idEdificio: edificio.idEdificio
        }),
      });

      const json = await response.json();

      if (json.success) {
        cargarEdificios();
      } else {
        alert(json.message || "Error al cambiar estado");
      }

    } catch (error) {
      console.error("Error cambiando estado:", error);
      alert("Error de conexión");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-xl p-8 border border-emerald-200 space-y-8 relative">

      {/* HEADER */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-emerald-600">
          Edificios
        </h2>

        <div className="flex gap-3 items-center">
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="border border-emerald-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="activos">Activos</option>
            <option value="inactivos">Inactivos</option>
            <option value="todos">Todos</option>
          </select>

          <button
            onClick={abrirCrear}
            className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
          >
            <Plus size={18} />
            Nuevo
          </button>
        </div>
      </div>

      {/* BUSCADOR */}
      <div className="flex items-center bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2">
        <Search size={18} className="text-emerald-600" />
        <input
          type="text"
          placeholder="Buscar edificio..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent flex-1 ml-2 focus:outline-none text-gray-800"
        />
      </div>

      {loading && (
        <p className="text-center text-gray-500">
          Cargando edificios...
        </p>
      )}

      {!loading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {filtered.map((edificio) => (
            <div
              key={edificio.idEdificio}
              className={`relative group border rounded-xl p-5 shadow transition-all duration-300
              ${edificio.actividad === 0 ? "opacity-60 bg-gray-50" : "hover:shadow-lg hover:bg-emerald-100 hover:scale-[1.02] active:scale-[0.98]"}`}
            >
              <div
                onClick={() =>
                  edificio.actividad === 1 &&
                  onSelectEdificio({
                    idEdificio: edificio.idEdificio,
                    nombre: edificio.nombre,
                    clave: edificio.clave,
                  })
                }
                className={`cursor-pointer ${edificio.actividad === 0 ? "cursor-not-allowed" : ""}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-emerald-600">
                    <Building2 size={18} />
                    <span className="text-sm font-semibold">
                      {edificio.clave}
                    </span>
                  </div>

                  <span className={`text-xs px-2 py-1 rounded-full 
                    ${edificio.actividad === 1 
                      ? "bg-green-100 text-green-700" 
                      : "bg-red-100 text-red-700"}`}>
                    {edificio.actividad === 1 ? "Activo" : "Inactivo"}
                  </span>
                </div>

                <p className="text-base font-bold text-gray-800 leading-tight">
                  {edificio.nombre}
                </p>
              </div>

              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition flex gap-2">
                {edificio.actividad === 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      abrirEditar(edificio);
                    }}
                    className="bg-white p-2 rounded-lg shadow hover:bg-emerald-100 transition"
                  >
                    <Pencil size={16} className="text-emerald-700" />
                  </button>
                )}

                <button
                    onClick={(e) => {
                      e.stopPropagation();
                      cambiarEstadoEdificio(edificio);
                    }}
                    className={`bg-white p-2 rounded-lg shadow transition
                      ${edificio.actividad === 1
                        ? "hover:bg-yellow-100"
                        : "hover:bg-green-100"}`}
                  >
                    {edificio.actividad === 1 ? (
                      <ShieldOff size={16} className="text-yellow-600" />
                    ) : (
                      <ShieldCheck size={16} className="text-green-600" />
                    )}
                  </button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <p className="col-span-full text-center text-gray-500">
              No se encontraron edificios
            </p>
          )}
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl space-y-4">

            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-emerald-600">
                {modoEdicion ? "Editar Edificio" : "Nuevo Edificio"}
              </h3>

              <button onClick={() => setShowModal(false)}>
                <X size={18} />
              </button>
            </div>

            <input
              type="text"
              placeholder="Clave"
              value={edificioActual.clave}
              onChange={(e) =>
                setEdificioActual({
                  ...edificioActual,
                  clave: e.target.value
                })
              }
              className="w-full border rounded-lg px-3 py-2"
            />

            <input
              type="text"
              placeholder="Nombre"
              value={edificioActual.nombre}
              onChange={(e) =>
                setEdificioActual({
                  ...edificioActual,
                  nombre: e.target.value
                })
              }
              className="w-full border rounded-lg px-3 py-2"
            />

            <button
              onClick={guardarEdificio}
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
