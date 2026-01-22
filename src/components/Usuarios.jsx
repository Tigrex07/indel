import { useState, useEffect } from "react";
import { Plus, Pencil, Copy, MinusCircle, X } from "lucide-react";

const API_URL = "https://corporacionperris.com/backend/usuarios.php";

export default function Usuario() {
  const [openForm, setOpenForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [filtroActivo, setFiltroActivo] = useState("activos");

  const [usuarios, setUsuarios] = useState([]);

  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    numEmpleado: "",
    clave: "",
    rol: ""
  });

  /* =========================
     CARGAR USUARIOS (READ)
  ========================= */
  const cargarUsuarios = () => {
    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "read" }),
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) setUsuarios(json.data);
      });
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  /* =========================
     EDITAR
  ========================= */
  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      nombre: user.nombre,
      correo: user.correo,
      numEmpleado: user.numEmpleado,
      clave: user.clave,
      rol: user.rol
    });
    setOpenForm(true);
  };

  /* =========================
     COPIAR
  ========================= */
  const handleCopy = (user) => {
    const text = `
ID: ${user.id}
Nombre: ${user.nombre}
Correo: ${user.correo}
Empleado: ${user.numEmpleado}
Rol: ${user.rol}
    `;
    navigator.clipboard.writeText(text.trim());
  };

  /* =========================
     INACTIVAR / ACTIVAR
  ========================= */
  const handleDelete = () => {
    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "toggle",
        id: confirmDelete.id,
        activo: 0
      }),
    }).then(() => {
      setConfirmDelete(null);
      cargarUsuarios();
    });
  };

  const handleReactivate = (id) => {
    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "toggle",
        id,
        activo: 1
      }),
    }).then(() => cargarUsuarios());
  };

  /* =========================
     GUARDAR (CREATE / UPDATE)
  ========================= */
  const handleSave = () => {
    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: editingUser ? "update" : "create",
        ...(editingUser && { id: editingUser.id }),
        ...formData
      }),
    }).then(() => {
      setOpenForm(false);
      setEditingUser(null);
      setFormData({
        nombre: "",
        correo: "",
        numEmpleado: "",
        clave: "",
        rol: ""
      });
      cargarUsuarios();
    });
  };

  /* =========================
     FILTRO
  ========================= */
  const usuariosFiltrados = usuarios.filter((u) => {
    if (filtroActivo === "activos") return u.activo == 1;
    if (filtroActivo === "inactivos") return u.activo == 0;
    return true;
  });

  return (
    <div className="relative">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-emerald-700">Usuarios</h2>

        <button
          onClick={() => {
            setEditingUser(null);
            setFormData({
              nombre: "",
              correo: "",
              numEmpleado: "",
              clave: "",
              rol: ""
            });
            setOpenForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition"
        >
          <Plus size={18} /> Agregar Usuario
        </button>
      </div>

      {/* FILTRO */}
      <div className="mb-4 flex gap-3">
        <select
          value={filtroActivo}
          onChange={(e) => setFiltroActivo(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
        >
          <option value="activos">Activos</option>
          <option value="inactivos">Inactivos</option>
          <option value="todos">Todos</option>
        </select>
      </div>

      {/* TABLA */}
      <div className="bg-white rounded-xl shadow-xl border border-emerald-200 overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="bg-emerald-600 text-white">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Correo</th>
              <th className="px-4 py-3">Empleado</th>
              <th className="px-4 py-3">Clave</th>
              <th className="px-4 py-3">Rol</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {usuariosFiltrados.map((u) => (
              <tr
                key={u.id}
                className={`hover:bg-emerald-100 transition ${
                  u.activo == 1 ? "odd:bg-emerald-50 even:bg-white" : "bg-red-50"
                }`}
              >
                <td className="px-4 py-3 font-semibold">{u.id}</td>
                <td className="px-4 py-3">{u.nombre}</td>
                <td className="px-4 py-3">{u.correo}</td>
                <td className="px-4 py-3">{u.numEmpleado}</td>
                <td className="px-4 py-3">{"*".repeat(u.clave.length)}</td>
                <td className="px-4 py-3">{u.rol}</td>

                <td className="px-4 py-3 flex gap-3">
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => handleEdit(u)}
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    className="text-gray-600 hover:text-gray-800"
                    onClick={() => handleCopy(u)}
                  >
                    <Copy size={18} />
                  </button>

                  {u.activo == 1 ? (
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => setConfirmDelete(u)}
                    >
                      <MinusCircle size={18} />
                    </button>
                  ) : (
                    <button
                      className="text-green-600 hover:text-green-800"
                      onClick={() => handleReactivate(u.id)}
                    >
                      <Plus size={18} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL CONFIRMAR */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60]">
          <div className="bg-white w-[380px] rounded-xl shadow-xl p-6 border border-emerald-200">
            <h2 className="text-xl font-bold text-emerald-700 mb-2">
              ¿Inactivar usuario?
            </h2>

            <p className="text-gray-700 mb-6">
              ¿Seguro que quieres inactivar a{" "}
              <strong>{confirmDelete.nombre}</strong>?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                Cancelar
              </button>

              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Inactivar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PANEL LATERAL */}
      {openForm && (
        <div className="fixed inset-0 bg-black/40 z-40">
          <div className="fixed top-0 right-0 h-full w-[420px] bg-white shadow-xl border-l z-50">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold text-emerald-700">
                {editingUser ? "Editar Usuario" : "Agregar Usuario"}
              </h2>
              <button onClick={() => setOpenForm(false)}>
                <X size={28} />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <FormInput label="Nombre" value={formData.nombre} onChange={(v) => setFormData({ ...formData, nombre: v })} />
              <FormInput label="Correo" value={formData.correo} onChange={(v) => setFormData({ ...formData, correo: v })} />
              <FormInput label="Número de empleado" value={formData.numEmpleado} onChange={(v) => setFormData({ ...formData, numEmpleado: v })} />
              <FormInput label="Clave" type="password" value={formData.clave} onChange={(v) => setFormData({ ...formData, clave: v })} />

              <select
                value={formData.rol}
                onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">Selecciona un rol</option>
                <option>Administrador</option>
                <option>Docente</option>
                <option>Soporte</option>
              </select>
            </div>

            <div className="p-4 border-t flex justify-end gap-2">
              <button onClick={() => setOpenForm(false)} className="px-4 py-2 bg-gray-200 rounded-lg">
                Cancelar
              </button>
              <button onClick={handleSave} className="px-4 py-2 bg-emerald-600 text-white rounded-lg">
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FormInput({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="block font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500"
      />
    </div>
  );
}