import { useEffect, useState } from "react";
import { Plus, Pencil, X, Copy, CheckCircle, Search } from "lucide-react";

const API_LIST   = "https://corporacionperris.com/backend/api/inventario_por_grupo.php";
const API_CREATE = "https://corporacionperris.com/backend/api/inventario_create.php";
const API_UPDATE = "https://corporacionperris.com/backend/api/inventario_update.php";

const ITEMS_PER_PAGE = 10;

export default function ActivosGrupo({ grupoClave, idGrupo, onBack }) {
  const [data, setData] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState(false);
  const [copiado, setCopiado] = useState("");
  const [page, setPage] = useState(1);

  const [form, setForm] = useState({
    idActivo: "",
    nombre: "",
    idAula: ""
  });

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
    i.nombre_activo.toLowerCase().includes(busqueda.toLowerCase()) ||
    i.aula.toString().includes(busqueda) ||
    i.edificio.toString().includes(busqueda) ||
    i.marbete.includes(busqueda)
  );

  /* =========================
     PAGINACIÓN
  ========================= */
  const totalPages = Math.ceil(filtrado.length / ITEMS_PER_PAGE);
  const inicio = (page - 1) * ITEMS_PER_PAGE;
  const paginaData = filtrado.slice(inicio, inicio + ITEMS_PER_PAGE);

  /* =========================
     NUEVO
  ========================= */
  const abrirNuevo = () => {
    setEditando(false);
    setForm({ idActivo: "", nombre: "", idAula: "" });
    setModal(true);
  };

  /* =========================
     EDITAR
  ========================= */
  const abrirEditar = (i) => {
    setEditando(true);
    setForm({
      idActivo: i.idActivo,
      nombre: i.nombre_activo ?? "",
      idAula: i.idAula ?? ""
    });
    setModal(true);
  };

  /* =========================
     GUARDAR (FIX 400)
  ========================= */
  const guardar = () => {
    if (!form.nombre || !form.idAula) {
      alert("Datos incompletos");
      return;
    }

    const payload = {
      idGrupo,
      nombre: form.nombre,
      idAula: form.idAula,
      ...(editando && { idActivo: form.idActivo })
    };

    fetch(editando ? API_UPDATE : API_CREATE, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(r => r.json())
      .then(j => {
        if (j.success) {
          setModal(false);
          cargar();
        } else {
          alert(j.message || "Error al guardar");
        }
      });
  };

  const copiar = (m) => {
    navigator.clipboard.writeText(m);
    setCopiado(m);
    setTimeout(() => setCopiado(""), 1200);
  };

  return (
    <div className="space-y-6">

      {/* VOLVER */}
      <button onClick={onBack} className="text-emerald-700 font-semibold">
        ← Volver a grupos
      </button>

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-emerald-700">
          Activos · {grupoClave}
        </h2>

        <button
          onClick={abrirNuevo}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex gap-2"
        >
          <Plus size={18}/> Agregar
        </button>
      </div>

      {/* BUSCADOR */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600" size={18}/>
        <input
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre, aula, edificio o marbete"
          className="w-full pl-10 pr-3 py-2 border rounded-lg"
        />
      </div>

      {/* TABLA */}
      <div className="bg-white rounded-xl shadow overflow-hidden border border-emerald-200">
        <table className="w-full text-left">
          <thead className="bg-emerald-600 text-white">
            <tr>
              <th className="p-3">Nombre</th>
              <th className="p-3">Edificio</th>
              <th className="p-3">Aula</th>
              <th className="p-3">Activo</th>
              <th className="p-3">Marbete</th>
              <th className="p-3"></th>
            </tr>
          </thead>

          <tbody>
            {paginaData.map(i => {
              const activo = i.marbete.split("-").pop();

              return (
                <tr key={i.idActivo} className="border-t hover:bg-emerald-50">
                  <td className="p-3 font-semibold">{i.nombre_activo}</td>
                  <td className="p-3">{i.edificio}</td>
                  <td className="p-3">{i.aula}</td>

                  <td className="p-3">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-mono text-sm">
                      {activo}
                    </span>
                  </td>

                  <td className="p-3 font-mono flex items-center gap-2">
                    {i.marbete}
                    <button onClick={() => copiar(i.marbete)}>
                      {copiado === i.marbete
                        ? <CheckCircle size={16} className="text-green-600"/>
                        : <Copy size={16}/>
                      }
                    </button>
                  </td>

                  <td className="p-3">
                    <button onClick={() => abrirEditar(i)}>
                      <Pencil size={18}/>
                    </button>
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
            className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
          >
            Anterior
          </button>

          <span className="font-medium">
            Página {page} de {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      )}

      {/* MODAL */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-[400px] space-y-4">

            <div className="flex justify-between">
              <h3 className="font-bold text-emerald-700">
                {editando ? "Editar activo" : "Nuevo activo"}
              </h3>
              <button onClick={() => setModal(false)}>
                <X />
              </button>
            </div>

            <input
              value={form.nombre}
              onChange={e => setForm({ ...form, nombre: e.target.value })}
              placeholder="Nombre del activo"
              className="w-full border rounded-lg px-3 py-2"
            />

            <input
              value={form.idAula}
              onChange={e => setForm({ ...form, idAula: e.target.value })}
              placeholder="ID Aula"
              className="w-full border rounded-lg px-3 py-2"
            />

            <button
              onClick={guardar}
              className="w-full bg-emerald-600 text-white py-2 rounded-lg"
            >
              Guardar
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
