import { useEffect, useState } from "react";
import { Plus, Pencil, X, Search, ShieldOff, ShieldCheck, Layers } from "lucide-react";

const API_URL = "https://corporacionperris.com/backend/api/grupos.php";

export default function ActivosSection({ onOpenCategory }) {

  const [grupos, setGrupos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState(false);
const [filtroEstado, setFiltroEstado] = useState("activos");

  const [form, setForm] = useState({
    idGrupo: null,
    nombre: "",
    clave: ""
  });

  /* =========================
     CARGAR
  ========================= */

const cargar = () => {

  fetch(API_URL, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "read"
    })
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
     FILTRO BUSQUEDA
  ========================= */

  const filtrados = grupos.filter(g =>
    g.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    (g.clave ?? "").toString().includes(busqueda)
  );


// filtro logico

const gruposFiltrados = grupos.filter(g => {

  if (filtroEstado === "activos") return g.actividad == 1;
  if (filtroEstado === "inactivos") return g.actividad == 0;

  return true;

}).filter(g =>
  g.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
  (g.clave ?? "").toString().includes(busqueda)
);

  /* =========================
     CREAR
  ========================= */

  const abrirNuevo = () => {

    setEditando(false);

    setForm({
      idGrupo: null,
      nombre: "",
      clave: ""
    });

    setModal(true);

  };

  
  //editar

  const abrirEditar = (grupo) => {

  setEditando(true);

  setForm({
    idGrupo: grupo.idGrupo,
    nombre: grupo.nombre,
    clave: grupo.clave
  });

  setModal(true);

};


//guardar

const guardar = () => {

  if (!form.nombre.trim()) {
    alert("El nombre es obligatorio");
    return;
  }

  if (!form.clave.trim()) {
    alert("La clave es obligatoria");
    return;
  }

  fetch(API_URL, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: editando ? "update" : "create",
      idGrupo: form.idGrupo,
      nombre: form.nombre,
      clave: form.clave
    })
  })
    .then(res => res.json())
    .then(json => {

      if (json.success) {
        setModal(false);
        cargar();
      } else {
        alert(json.message || "Error");
      }

    });

};

  /* =========================
     ACTIVAR / INACTIVAR
  ========================= */

  const toggleActivo = (grupo) => {

    fetch(API_URL, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "toggle",
        idGrupo: grupo.idGrupo
      })
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) cargar();
      });

  };

  /* =========================
     KPIs
  ========================= */

const totalGrupos = grupos.length;
const activos = grupos.filter(g => g.actividad == 1).length;
const inactivos = grupos.filter(g => g.actividad == 0).length;

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

      {/* BUSCADOR + FILTROS + KPIs */}

      <div className="flex items-center justify-between gap-4 flex-wrap">

  {/* IZQUIERDA */}

  <div className="flex items-center gap-4 w-full max-w-xl">

    <div className="relative w-full">

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

    {/* SELECT FILTRO */}

    <select
      value={filtroEstado}
      onChange={(e) => setFiltroEstado(e.target.value)}
      className="border border-emerald-300 rounded-lg px-3 py-2 text-sm"
    >
      <option value="activos">Activos</option>
      <option value="inactivos">Inactivos</option>
      <option value="todos">Todos</option>
    </select>

  </div>

  {/* DERECHA KPIs */}

  <div className="flex gap-3">

    <div className="bg-white border border-emerald-200 rounded-lg px-4 py-2 shadow text-center">
      <p className="text-xs text-gray-500">Total</p>
      <p className="text-lg font-bold text-emerald-700">{totalGrupos}</p>
    </div>

    <div className="bg-white border border-emerald-200 rounded-lg px-4 py-2 shadow text-center">
      <p className="text-xs text-gray-500">Activos</p>
      <p className="text-lg font-bold text-emerald-700">{activos}</p>
    </div>

    <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 shadow text-center">
      <p className="text-xs text-gray-500">Inactivos</p>
      <p className="text-lg font-bold text-gray-600">{inactivos}</p>
    </div>

  </div>

</div>

      {/* GRID */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

        {gruposFiltrados.map(grupo => (

          <div
            key={grupo.idGrupo}
            className={`group relative rounded-2xl p-6 shadow-sm transition-all duration-300 cursor-pointer
              ${grupo.actividad == 1
                ? "bg-white border border-gray-200 hover:shadow-xl hover:bg-emerald-50 hover:border-emerald-400"
                : "bg-gray-100 border border-gray-300 opacity-70"
              }`}
            onClick={() => onOpenCategory(grupo.clave)}
          >

            {/* ICONO */}

            <div className="flex items-center gap-2 text-emerald-600 mb-3">

              <Layers size={20} />

              <span className="text-sm font-semibold">
                {grupo.clave}
              </span>

            </div>

            <p className="text-lg font-bold text-gray-800 leading-tight">
              {grupo.nombre}
            </p>

            {grupo.actividad != 1 && (
              <p className="text-xs text-red-500 font-semibold mt-1">
                INACTIVO
              </p>
            )}

            {/* BOTONES */}

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
                  toggleActivo(grupo);
                }}
                className="bg-white p-2 rounded-lg shadow hover:bg-gray-100 transition"
              >
                {grupo.actividad == 1 ? (
                  <ShieldOff size={16} className="text-red-600" />
                ) : (
                  <ShieldCheck size={16} className="text-emerald-600" />
                )}
              </button>

            </div>

          </div>

        ))}

      </div>

      {/* MODAL */}

      {modal && (

        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">

          <div className="bg-white p-8 rounded-2xl w-[420px] space-y-5 shadow-2xl">

            <div className="flex justify-between items-center">

              <h3 className="text-lg font-bold text-emerald-700">
                {editando ? "Editar grupo" : "Nuevo grupo"}
              </h3>

              <button onClick={() => setModal(false)}>
                <X />
              </button>

            </div>

            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={form.clave}
              onChange={(e) => {

                const valor = e.target.value.replace(/\D/g, "");

                setForm({
                  ...form,
                  clave: valor
                });

              }}
              placeholder="Clave del grupo"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition"
            />

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
