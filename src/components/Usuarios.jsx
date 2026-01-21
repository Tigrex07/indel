import { useState } from "react";
import { Plus, Pencil, Copy, MinusCircle, X } from "lucide-react";

export default function Usuario() {
  const [openForm, setOpenForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [usuarios, setUsuarios] = useState([
    {
      id: 1,
      nombre: "Tigrex Team",
      correo: "tigrexteam@gmail.com",
      numEmpleado: "001",
      clave: "123",
      rol: "Perron"
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

  // Borrar usuario
  const handleDelete = (id) => {
    setUsuarios(usuarios.filter((u) => u.id !== id));
  };

  // Guardar (agregar o editar)
  const handleSave = () => {
    if (editingUser) {
      // Editar
      setUsuarios(
        usuarios.map((u) =>
          u.id === editingUser.id ? { ...editingUser, ...formData } : u
        )
      );
    } else {
      // Agregar
      setUsuarios([
        ...usuarios,
        { id: usuarios.length + 1, ...formData }
      ]);
    }

    // Reset
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
            {usuarios.map((u) => (
              <tr
                key={u.id}
                className="odd:bg-emerald-50 even:bg-white hover:bg-emerald-100 transition"
              >
                <td className="px-4 py-3 font-semibold">{u.id}</td>
                <td className="px-4 py-3">{u.nombre}</td>
                <td className="px-4 py-3">{u.correo}</td>
                <td className="px-4 py-3">{u.numEmpleado}</td>
                <td className="px-4 py-3">{u.clave}</td>
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

                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => handleDelete(u.id)}
                  >
                    <MinusCircle size={18} />
                  </button>
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
    </div>
  );
}

/* Input reutilizable */
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