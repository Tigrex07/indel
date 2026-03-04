import { useState, useMemo, useEffect } from "react";
import { Search } from "lucide-react";
import ActivoModal from "./ActivoModal";

export default function ActivosAula({
  idAula,
  nombreAula,
  claveAula,
  onBack
}) {
  const [activos, setActivos] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedActivo, setSelectedActivo] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!idAula) return;

    const fetchActivos = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `https://corporacionperris.com/backend/api/activoModal.php?aula=${idAula}`,
          { credentials: "include" }
        );

        const data = await res.json();

        if (!data.success) {
          setError(data.message || "Error cargando activos");
          setActivos([]);
          return;
        }

        setActivos(Array.isArray(data.data) ? data.data : []);
      } catch (err) {
        setError("No se pudo conectar con el servidor");
        setActivos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivos();
  }, [idAula]);

  const filtered = useMemo(() => {
    return activos.filter(a =>
      a?.nombre?.toLowerCase().includes(search.toLowerCase()) ||
      a?.clave?.toString().includes(search)
    );
  }, [activos, search]);

  const handleChange = (e) => {
    setSelectedActivo(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSave = async () => {
    try {
      const res = await fetch(
        "https://corporacionperris.com/backend/php/updateActivo.php",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(selectedActivo)
        }
      );

      const data = await res.json();

      if (!data.success) {
        alert(data.message);
        return;
      }

      setActivos(prev =>
        prev.map(a =>
          a.idActivo === selectedActivo.idActivo ? selectedActivo : a
        )
      );

      setEditMode(false);
      alert("Activo actualizado correctamente");
    } catch {
      alert("Error actualizando activo");
    }
  };

  if (loading)
    return <div className="p-8 text-center text-emerald-600">Cargando activos...</div>;

  if (error)
    return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="bg-white rounded-xl shadow-xl p-8 border border-emerald-200 space-y-8">

      {/* HEADER */}
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

      {/* BUSCADOR */}
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

      {/* TABLA */}
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
                onClick={() => {
                  setSelectedActivo(activo);
                  setEditMode(false);
                }}
                className="border-b hover:bg-emerald-50 transition cursor-pointer"
              >
                <td className="px-4 py-3 font-semibold">{activo.clave}</td>
                <td className="px-4 py-3">{activo.nombre}</td>
                <td className="px-4 py-3">{activo.fecha}</td>
                <td className="px-4 py-3">${activo.importe || "—"}</td>
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
      </div>

      {/* MODAL */}
          {selectedActivo && (
            <ActivoModal
              activo={selectedActivo}
              onClose={() => setSelectedActivo(null)}
              editMode={editMode}
              setEditMode={setEditMode}
              onSave={handleSave}
            />
          )}

    </div>
  );
}