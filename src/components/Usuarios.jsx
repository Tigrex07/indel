import { useState } from "react";
import { Plus, Pencil, Copy, MinusCircle, X } from "lucide-react";

export default function Usuario() {
  const [openForm, setOpenForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [filtroActivo, setFiltroActivo] = useState("activos"); // activos | inactivos | todos

  const [usuarios, setUsuarios] = useState([
    {
      id: 1,
      nombre: "Tigrex Team",
      correo: "tigrexteam@gmail.com",
      numEmpleado: "001",
      clave: "123",
      rol: "Perron",
      activo: true
    },
    {
      id: 2,
      nombre: "Usuario Inactivo",
      correo: "inactivo@correo.com",
      numEmpleado: "002",
      clave: "abc",
      rol: "Docente",
      activo: false
    }
  ]);

  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    numEmpleado: "",
    clave: "",
    rol: ""
  });

  // Abrir panel en modo edición
  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData(user);
    setOpenForm(true);
  };

  // Copiar datos
  const handleCopy = (user) => {
    const text = `
ID: ${user.id}
Nombre: ${user.nombre}
Correo: ${user.correo}
Empleado: ${user.numEmpleado}
Clave: ${user.clave}
Rol: ${user.rol}
    `;
    navigator.clipboard.writeText(text.trim());
  };

  // Inactivar usuario
  const handleDelete = () => {
    setUsuarios(
      usuarios.map((u) =>
        u.id === confirmDelete.id ? { ...u, activo: false } : u
      )
    );
    setConfirmDelete(null);
  };
const handleReactivate = (id) => {
  setUsuarios(
    usuarios.map(u =>
      u.id === id ? { ...u, activo: true } : u
    )
  );
};
  // Guardar (agregar o editar)
  const handleSave = () => {
    if (editingUser) {
      setUsuarios(
        usuarios.map((u) =>
          u.id === editingUser.id ? { ...editingUser, ...formData } : u
        )
      );
    } else {
      setUsuarios([
        ...usuarios,
        { id: usuarios.length + 1, activo: true, ...formData }
      ]);
    }

    setEditingUser(null);
    setFormData({
      nombre: "",
      correo: "",
      numEmpleado: "",
      clave: "",
      rol: ""
    });
    setOpenForm(false);
  };

  // Filtrado por estado
  const usuariosFiltrados = usuarios.filter((u) => {
    if (filtroActivo === "activos") return u.activo;
    if (filtroActivo === "inactivos") return !u.activo;
    return true; // todos
  });

  return (
    <div className="relative">

      {/* Header */}
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

      {/* Filtros */}
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

      {/* Tabla */}
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
                  u.activo ? "odd:bg-emerald-50 even:bg-white" : "bg-red-50"
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

                  {u.activo && (
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => setConfirmDelete(u)}
                    >
                      <MinusCircle size={18} />
                    </button>
                  )}
                  {!u.activo && (
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

      {/* Overlay */}
      {openForm && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setOpenForm(false)}
        ></div>
      )}

      {/* Panel lateral */}
      <div
        className={`fixed top-0 right-0 h-full w-[420px] bg-white shadow-xl border-l border-gray-200 z-50 transform transition-transform duration-300 ${
          openForm ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header panel */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-emerald-700">
            {editingUser ? "Editar Usuario" : "Agregar Usuario"}
          </h2>

          <button
            onClick={() => setOpenForm(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={28} className="text-gray-600 hover:text-black" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 overflow-y-auto max-h-[calc(100vh-110px)] space-y-4">
          <FormInput
            label="Nombre"
            value={formData.nombre}
            onChange={(v) => setFormData({ ...formData, nombre: v })}
          />

          <FormInput
            label="Correo"
            value={formData.correo}
            onChange={(v) => setFormData({ ...formData, correo: v })}
          />

          <FormInput
            label="Número de empleado"
            value={formData.numEmpleado}
            onChange={(v) => setFormData({ ...formData, numEmpleado: v })}
          />

          <FormInput
            label="Clave"
            type="password"
            value={formData.clave}
            onChange={(v) => setFormData({ ...formData, clave: v })}
          />

          <div>
            <label className="block font-medium text-gray-700 mb-1">Rol</label>
            <select
              value={formData.rol}
              onChange={(e) =>
                setFormData({ ...formData, rol: e.target.value })
              }
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Selecciona un rol</option>
              <option>Administrador</option>
              <option>Docente</option>
              <option>Soporte</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex justify-end gap-2">
          <button
            onClick={() => setOpenForm(false)}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            Cancelar
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
          >
            Guardar
          </button>
        </div>
      </div>

      {/* Modal de confirmación */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60]">
          <div className="bg-white w-[380px] rounded-xl shadow-xl p-6 border border-emerald-200 animate-fadeIn">

            <h2 className="text-xl font-bold text-emerald-700 mb-2">
              ¿Inactivar usuario?
            </h2>

            <p className="text-gray-700 mb-6">
              ¿Seguro que quieres inactivar al usuario{" "}
              <strong>{confirmDelete.nombre}</strong>?  
              Podrás reactivarlo más adelante.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
              >
                Cancelar
              </button>

              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
              >
                Inactivar
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