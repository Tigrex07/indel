import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import ActivoModal from "./ActivoModal";

const API_LIST = "https://corporacionperris.com/backend/api/activoModal.php";
const ITEMS_PER_PAGE = 10;

export default function ActivosGrupo({ grupoClave, grupoNombre, onBack }) {

  const [data, setData] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [page, setPage] = useState(1);

  const [activoSeleccionado, setActivoSeleccionado] = useState(null);
  const [editMode, setEditMode] = useState(false);

  /* =========================
     CARGAR INVENTARIO
  ========================= */
  const cargar = () => {
    if (!grupoClave) return;

    fetch(`${API_LIST}?grupo=${grupoClave}`, {
      credentials: "include"
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setData(json.data);
          setPage(1);
        } else {
          setData([]);
        }
      })
      .catch(() => setData([]));
  };

  useEffect(() => {
    cargar();
  }, [grupoClave]);

  /* =========================
     FILTRO BUSCADOR
  ========================= */
  const filtrado = data.filter(i =>
    i.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    i.aula?.toString().includes(busqueda) ||
    i.edificio?.toString().includes(busqueda) ||
    i.marbete?.includes(busqueda)
  );

  /* =========================
     PAGINACIÓN
  ========================= */
  const totalPages = Math.ceil(filtrado.length / ITEMS_PER_PAGE);
  const inicio = (page - 1) * ITEMS_PER_PAGE;
  const paginaData = filtrado.slice(inicio, inicio + ITEMS_PER_PAGE);

  return (
    <div className="space-y-8">

      {/* VOLVER */}
      <button
        onClick={onBack}
        className="text-emerald-700 font-semibold hover:underline flex items-center gap-1"
      >
        ← Volver a grupos
      </button>

      {/* HEADER */}
      <div>
        <h2 className="text-3xl font-bold text-emerald-700 tracking-tight">
          Activos
        </h2>

        <p className="text-gray-600 font-medium">
          Grupo: <span className="text-emerald-700">{grupoNombre} ({grupoClave})</span>
        </p>
      </div>

      {/* BUSCADOR */}
      <div className="relative max-w-md">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600"
          size={18}
        />
        <input
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre, aula, edificio o marbete"
          className="w-full pl-10 pr-3 py-2.5 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
        />
      </div>

      {/* TABLA */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-emerald-200">
        <table className="w-full text-left">

          <thead className="bg-emerald-600 text-white">
            <tr>
              <th className="p-3 font-semibold">Nombre</th>
              <th className="p-3 font-semibold">Edificio</th>
              <th className="p-3 font-semibold">Aula</th>
              <th className="p-3 font-semibold">Activo</th>
              <th className="p-3 font-semibold">Marbete</th>
              <th className="p-3 font-semibold text-right">Importe</th>
            </tr>
          </thead>

          <tbody>
            {paginaData.map((i) => {

              const activo = i.marbete?.split("-").pop();

              return (
                <tr
                  key={i.idActivo}
                  onClick={() => {
                    setActivoSeleccionado(i);
                    setEditMode(false);
                  }}
                  className="border-t hover:bg-emerald-50 transition-all cursor-pointer"
                >

                  <td className="p-3 font-medium text-gray-800">
                    {i.nombre}
                  </td>

                  <td className="p-3 text-gray-700">
                    {i.edificio}
                  </td>

                  <td className="p-3 text-gray-700">
                    {i.aula}
                  </td>

                  <td className="p-3">
                    <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-mono text-sm shadow-sm">
                      {activo}
                    </span>
                  </td>

                  <td className="p-3 font-mono text-gray-700">
                    {i.marbete}
                  </td>

                  <td className="p-3 text-right font-semibold text-gray-800">
                    {i.importe ? `$${Number(i.importe).toLocaleString()}` : "-"}
                  </td>

                </tr>
              );

            })}
          </tbody>

        </table>
      </div>

      {/* PAGINACIÓN */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center pt-4">

          <button
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition"
          >
            Anterior
          </button>

          <span className="font-medium text-gray-700">
            Página {page} de {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition"
          >
            Siguiente
          </button>

        </div>
      )}

      {/* MODAL ACTIVO */}
      {activoSeleccionado && (
        <ActivoModal
          activo={activoSeleccionado}
          onClose={() => setActivoSeleccionado(null)}
          editMode={editMode}
          setEditMode={setEditMode}
        />
      )}

    </div>
  );
}
