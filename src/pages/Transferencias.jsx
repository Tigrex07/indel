import { useEffect, useState } from "react";
import { Search } from "lucide-react";

const API_URL = "https://corporacionperris.com/backend/api/transferencias.php";

export default function Transferencias() {
  const [search, setSearch] = useState("");
  const [resultados, setResultados] = useState([]);
  const [activo, setActivo] = useState(null);

  // 🔍 Buscar artículos
  const buscar = () => {
    if (!search.trim()) return;

    fetch(`${API_URL}?q=${encodeURIComponent(search)}`, {
      credentials: "include",
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setResultados(json.data);
          setActivo(null);
        }
      });
  };

  // ✏️ Editar campo
  const handleChange = (field, value) => {
    setActivo(prev => ({ ...prev, [field]: value }));
  };

  // 💾 Guardar cambios
  const guardar = () => {
    fetch(API_URL, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(activo),
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          alert("Activo actualizado correctamente");
        }
      });
  };

  return (
    <div className="space-y-8">

      <h1 className="text-3xl font-extrabold text-emerald-700">
        Transferencia de Activos
      </h1>

      {/* BUSCADOR */}
      <div className="flex gap-2">
        <div className="flex items-center bg-white border rounded-lg px-4 py-2 flex-1">
          <Search size={18} className="text-emerald-600" />
          <input
            type="text"
            placeholder="Buscar por ID, nombre o clave"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ml-2 flex-1 outline-none"
          />
        </div>

        <button
          onClick={buscar}
          className="bg-emerald-600 text-white px-6 rounded-lg hover:bg-emerald-700"
        >
          Buscar
        </button>
      </div>

      {/* RESULTADOS */}
      {resultados.length > 0 && (
        <div className="bg-white rounded-xl shadow">
          <table className="w-full">
            <thead className="bg-emerald-600 text-white">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Nombre</th>
                <th className="p-3">Clave</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {resultados.map(a => (
                <tr key={a.idActivo} className="border-b">
                  <td className="p-3">{a.idActivo}</td>
                  <td className="p-3">{a.nombre}</td>
                  <td className="p-3">{a.clave}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => setActivo(a)}
                      className="text-emerald-600 font-semibold"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* FORMULARIO */}
      {activo && (
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="text-xl font-bold text-emerald-700">
            Editar Activo #{activo.idActivo}
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              value={activo.idAula}
              onChange={(e) => handleChange("idAula", e.target.value)}
              className="border rounded-lg p-2"
              placeholder="ID Aula"
            />

            <input
              type="number"
              value={activo.idGrupo}
              onChange={(e) => handleChange("idGrupo", e.target.value)}
              className="border rounded-lg p-2"
              placeholder="ID Grupo"
            />

            <input
              type="text"
              value={activo.descripcion || ""}
              onChange={(e) => handleChange("descripcion", e.target.value)}
              className="border rounded-lg p-2 col-span-2"
              placeholder="Descripción"
            />
          </div>

          <button
            onClick={guardar}
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700"
          >
            Guardar cambios
          </button>
        </div>
      )}
    </div>
  );
}
