import { useEffect, useState } from "react";
import { Copy } from "lucide-react";

const API_URL =
  "https://corporacionperris.com/backend/api/inventario_por_grupo.php";

export default function ActivosGrupo({ grupoClave, onBack }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!grupoClave) return;

    fetch(`${API_URL}?grupo=${grupoClave}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setData(json.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [grupoClave]);

  if (loading) return <p className="text-gray-600">Cargando activos…</p>;

  return (
    <div className="space-y-6">

      {/* BOTÓN VOLVER */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-emerald-700 font-semibold hover:text-emerald-900 transition"
        >
          ← Volver a grupos
        </button>

        <h2 className="text-2xl font-bold text-emerald-700">
          Activos del grupo {grupoClave}
        </h2>
      </div>

      {/* TABLA */}
      <div className="bg-white border border-emerald-200 rounded-xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-emerald-600 text-white">
            <tr>
              <th className="p-3">Nombre</th>
              <th className="p-3">Edificio</th>
              <th className="p-3">Aula</th>
              <th className="p-3">Grupo</th>
              <th className="p-3">Activo</th>
              <th className="p-3">Marbete</th>
            </tr>
          </thead>
          <tbody>
            {data.map((i, idx) => (
              <tr key={idx} className="border-t hover:bg-emerald-50">
                <td className="p-3 font-semibold">{i.nombre_activo}</td>
                <td className="p-3">{i.edificio}</td>
                <td className="p-3">{i.aula}</td>
                <td className="p-3">{i.grupo}</td>
                <td className="p-3">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                    {i.activo}
                  </span>
                </td>
                <td className="p-3 flex items-center gap-2 font-mono">
                  {i.marbete}
                  <button
                    onClick={() => navigator.clipboard.writeText(i.marbete)}
                    className="text-gray-500 hover:text-black"
                  >
                    <Copy size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
