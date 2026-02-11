import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Search, Boxes } from "lucide-react";

const API_URL = "https://corporacionperris.com/backend/api/grupos_crud.php";

export default function ActivosSection({ onOpenCategory }) {

  const [grupos, setGrupos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState(false);

  const [form, setForm] = useState({
    idGrupo: null,
    nombre: ""
  });

  /* =========================
     CARGAR
  ========================= */
  const cargar = () => {
    fetch(API_URL, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "read" })
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) setGrupos(json.data);
      });
  };

  useEffect(() => {
    cargar();
  }, []);

  /* =========================
     FILTRO
  ========================= */
  const filtrados = grupos.filter(g =>
    g.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    g.clave.toString().includes(busqueda)
  );

  /* =========================
     CREAR / EDITAR
  ========================= */
  const abrirNuevo = () => {
    setEditando(false);
    setForm({ idGrupo: null, nombre: "" });
    setModal(true);
  };

  const abrirEditar = (grupo) => {
    setEditando(true);
    setForm({
      idGrupo: grupo.idGrupo,
      nombre: grupo.nombre
    });
    setModal(true);
  };

  const guardar = () => {
    if (!form.nombre.trim()) {
      alert("El nombre es obligatorio");
      return;
    }

    fetch(API_URL, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: editando ? "update" : "create",
        idGrupo: form.idGrupo,
        nombre: form.nombre
      })
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setModal(false);
          cargar();
        }
      });
  };

  const eliminar = (idGrupo) => {
    if (!confirm("¿Eliminar grupo?")) return;

    fetch(API_URL, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "delete",
        idGrupo
      })
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) cargar();
      });
  };

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-emerald-600">
          Grupos
        </h2>

        <button
          onClick={abrirNuevo}
          className="bg-emerald-600 text-white px-5 py-2 rounded-xl flex items-center gap-2 hover:bg-emerald-700 transition shadow"
        >
          <Plus size={18} />
          Nuevo
        </button>
      </div>

      {/* BUSCADOR */}
      <div className="relative max-w-xl">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600"
        />
        <input
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar grupo..."
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-emerald-200 bg-emerald-50 focus:bg-white focus:ring-2 focus:ring-emerald-400 outline-none transition"
        />
      </div>

      {/* GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

        {filtrados.map(grupo => (
          <div
            key={grupo.idGrupo}
            className="group relative bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:bg-emerald-50 hover:border-emerald-400 transition-all duration-300 cursor-pointer"
            onClick={() => onOpenCategory(grupo.clave)}
          >

            {/* ICONO */}
            <div className="flex items-center gap-2 text-emerald-600 mb-3">
              <Boxes size={20} />
              <span className="text-sm font-semibold">
                {grupo.clave}
              </span>
            </div>

            <p className="text-lg font-bold text-gray-800 leading-tight">
              {grupo.nombre}
            </p>

            {/* BOTONES HOVER */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition flex gap-2">

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  abrirEditar(grupo);
                }}
                className="bg-white p-2 rounded-lg shadow hover:bg-emerald-100 transition"
              >
                <Pencil size={16} className="text-emerald-700" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  eliminar(grupo.idGrupo);
                }}
                className="bg-white p-2 rounded-lg shadow hover:bg-red-100 transition"
              >
                <Trash2 size={16} className="text-red-600" />
              </button>

            </div>

          </div>
        ))}

      </div>

      {/* MODAL */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">

          <div className="bg-white p-8 rounded-2xl w-[400px] space-y-5 shadow-2xl">

            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-emerald-700">
                {editando ? "Editar grupo" : "Nuevo grupo"}
              </h3>

              <button onClick={() => setModal(false)}>
                <X />
              </button>
            </div>

            <input
              value={form.nombre}
              onChange={(e) =>
                setForm({ ...form, nombre: e.target.value })
              }
              placeholder="Nombre del grupo"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition"
            />

            <button
              onClick={guardar}
              className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition shadow"
            >
              Guardar
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
