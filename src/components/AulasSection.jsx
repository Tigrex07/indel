import { useEffect, useState } from "react";
import { Search, DoorOpen } from "lucide-react";

const API_URL =
  "https://corporacionperris.com/backend/api/aulas.php";

export default function AulasSection({ idEdificio, onBack }) {
  const [search, setSearch] = useState("");
  const [aulas, setAulas] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}?edificio=${idEdificio}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setAulas(json.data);
      });
  }, [idEdificio]);

  const filtered = aulas.filter((a) =>
    a.nombre.toLowerCase().includes(search.toLowerCase()) ||
    a.clave.toString().includes(search)
  );

  return (
    <div className="bg-white rounded-xl shadow-xl p-8 border border-emerald-200 space-y-8">
      
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <button
          onClick={onBack}
          className="text-emerald-600 font-semibold hover:underline"
        >
          ← Volver a edificios
        </button>

        <h2 className="text-2xl font-bold text-emerald-600">
          Aulas
        </h2>
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

      {/* GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {filtered.map(({ idAula, clave, nombre }) => (
          <div
            key={idAula}
            className="border rounded-xl p-5 shadow hover:bg-emerald-100 transition"
          >
            <div className="flex items-center gap-2 text-emerald-600 mb-2">
              <DoorOpen size={18} />
              <span className="text-sm font-semibold">
                {clave}
              </span>
            </div>

            <p className="font-bold text-gray-800">
              {nombre}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
