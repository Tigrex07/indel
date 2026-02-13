import { useEffect, useState, useMemo } from "react";
import { Search, Package } from "lucide-react";

const API_URL = "https://corporacionperris.com/backend/api/inventario.php";

export default function ActivosAula({
  idAula,
  nombreAula,
  claveAula,
  onBack
}) {
  const [activos, setActivos] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!idAula) return;

    setLoading(true);

    fetch(`${API_URL}?aula=${idAula}`, {
      credentials: "include"
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) setActivos(json.data);
      })
      .finally(() => setLoading(false));

  }, [idAula]);

  const filtered = useMemo(() => {
    return activos.filter(a =>
      a.nombre.toLowerCase().includes(search.toLowerCase()) ||
      a.clave.toString().includes(search)
    );
  }, [activos, search]);

  return (
    <div className="bg-white rounded-xl shadow-xl p-8 border border-emerald-200 space-y-8">

      <div className="flex justify-between items-center">
        <button
          onClick={onBack}
          className="text-emerald-600 font-semibold hover:underline"
        >
          ← Volver a aulas
        </button>

        <h2 className="text-2xl font-bold text-emerald-700">
          Activos — {nombreAula}
          <span className="ml-2 text-sm text-emerald-500">
            ({claveAula})
          </span>
        </h2>
      </div>

      <div className="flex items-center bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2">
        <Search size={18} className="text-emerald-600" />
        <input
          type="text"
          placeholder="Buscar activo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent flex-1 ml-2 focus:outline-none"
        />
      </div>

      {loading && (
        <p className="text-center text-gray-500">
          Cargando activos...
        </p>
      )}

      {!loading && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border rounded-lg overflow-hidden">
            <thead className="bg-emerald-600 text-white">
              <tr>
                <th className="px-4 py-3">Clave</th>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Importe</th>
                <th className="px-4 py-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((activo) => (
                <tr
                  key={activo.idActivo}
                  className="border-b hover:bg-emerald-50 transition"
                >
                  <td className="px-4 py-3 font-semibold">
                    {activo.clave}
                  </td>
                  <td className="px-4 py-3">
                    {activo.nombre}
                  </td>
                  <td className="px-4 py-3">
                    {activo.fecha}
                  </td>
                  <td className="px-4 py-3">
                    ${activo.importe}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs
                      ${activo.actividad == 1
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                      }`}>
                      {activo.actividad == 1 ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <p className="text-center text-gray-500 mt-4">
              No hay activos en esta aula
            </p>
          )}
        </div>
      )}
    </div>
  );
}
