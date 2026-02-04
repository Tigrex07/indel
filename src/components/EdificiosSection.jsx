import { useState, useEffect, useMemo } from "react";
import { Search, Building2 } from "lucide-react";

const API_URL = "https://corporacionperris.com/backend/api/edificios.php";

export default function EdificiosSection({ onSelectEdificio }) {
  const [search, setSearch] = useState("");
  const [catalogoEdificios, setCatalogoEdificios] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================
     CARGAR EDIFICIOS
  ========================= */
  useEffect(() => {
    fetch(API_URL, {
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
  }, []);

  /* =========================
     FILTRO
  ========================= */
  const filtered = useMemo(() => {
    return catalogoEdificios.filter((e) =>
      e.nombre.toLowerCase().includes(search.toLowerCase()) ||
      e.clave.toString().includes(search)
    );
  }, [catalogoEdificios, search]);

  return (
    <div className="bg-white rounded-xl shadow-xl p-8 border border-emerald-200 space-y-8">
      <h2 className="text-2xl font-bold text-emerald-600">
        Edificios
      </h2>

      {/* BUSCADOR */}
      <div className="flex items-center bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2">
        <Search size={18} className="text-emerald-600" />
        <input
          type="text"
          aria-label="Buscar edificio"
          placeholder="Buscar edificio..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent flex-1 ml-2 focus:outline-none text-gray-800"
        />
      </div>

      {/* ESTADO CARGA */}
      {loading && (
        <p className="text-center text-gray-500">
          Cargando edificios...
        </p>
      )}

      {/* GRID */}
      {!loading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {filtered.map(({ idEdificio, clave, nombre }) => (
            <button
              key={idEdificio}
              onClick={() =>
                onSelectEdificio({
                  id: idEdificio,
                  nombre,
                  clave,
                })
              }
              className="text-left border rounded-xl p-5 shadow hover:shadow-lg hover:bg-emerald-100 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              <div className="flex items-center gap-2 mb-2 text-emerald-600">
                <Building2 size={18} />
                <span className="text-sm font-semibold">
                  {clave}
                </span>
              </div>

              <p className="text-base font-bold text-gray-800 leading-tight">
                {nombre}
              </p>
            </button>
          ))}

          {filtered.length === 0 && (
            <p className="col-span-full text-center text-gray-500">
              No se encontraron edificios
            </p>
          )}
        </div>
      )}
    </div>
  );
}
