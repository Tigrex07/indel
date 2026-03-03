import React, { useState, useEffect, useMemo } from "react";
import { 
  Plus, Pencil, Copy, MinusCircle, X, 
  UserCircle, Mail, Hash, ShieldCheck, 
  Search, Loader2, UserPlus, CheckCircle2, AlertCircle 
} from "lucide-react";

const API_URL = "https://corporacionperris.com/backend/api/usuarios.php";

export default function Usuario() {
  const [openForm, setOpenForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [filtroActivo, setFiltroActivo] = useState("activos");
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(false);
  const [usuarios, setUsuarios] = useState([]);

  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    numEmpleado: "",
    clave: "",
    rol: ""
  });

  const cargarUsuarios = () => {
    setLoading(true);
    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ action: "read" }),
    })
      .then(res => res.json())
      .then(json => {
        if (json.success && Array.isArray(json.data)) {
          setUsuarios(json.data);
        } else {
          setUsuarios([]);
        }
      })
      .catch(() => setUsuarios([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const usuariosFiltrados = useMemo(() => {
    return (usuarios || []).filter((u) => {
      const cumpleFiltro = 
        filtroActivo === "todos" ? true :
        filtroActivo === "activos" ? u.activo == 1 : u.activo == 0;
      
      const cumpleBusqueda = 
        u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        u.correo.toLowerCase().includes(busqueda.toLowerCase()) ||
        u.numEmpleado.toString().includes(busqueda);

      return cumpleFiltro && cumpleBusqueda;
    });
  }, [usuarios, filtroActivo, busqueda]);

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      nombre: user.nombre,
      correo: user.correo,
      numEmpleado: user.numEmpleado,
      clave: "",
      rol: user.rol
    });
    setOpenForm(true);
  };

  const handleCopy = (user) => {
    const text = `ID: ${user.id}\nNombre: ${user.nombre}\nCorreo: ${user.correo}\nEmpleado: ${user.numEmpleado}\nRol: ${user.rol}`;
    navigator.clipboard.writeText(text);
  };

  const handleDelete = () => {
    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ action: "toggle", id: confirmDelete.id, activo: 0 }),
    }).then(() => {
      setConfirmDelete(null);
      cargarUsuarios();
    });
  };

  const handleReactivate = (id) => {
    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ action: "toggle", id, activo: 1 }),
    }).then(() => cargarUsuarios());
  };

  const handleSave = () => {
    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        action: editingUser ? "update" : "create",
        ...(editingUser && { id: editingUser.id }),
        ...formData
      }),
    }).then(() => {
      setOpenForm(false);
      setEditingUser(null);
      setFormData({ nombre: "", correo: "", numEmpleado: "", clave: "", rol: "" });
      cargarUsuarios();
    });
  };

  return (
    <div className="p-6 md:p-10 bg-[#F8FAFC] min-h-screen font-sans text-slate-900 transition-all">
      
      {/* HEADER: Proporción equilibrada */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <div className="p-2 bg-emerald-600 rounded-lg shadow-lg shadow-emerald-200">
                <UserCircle className="text-white" size={28} />
            </div>
            Gestión de Usuarios
          </h2>
          <p className="text-slate-400 text-sm mt-1 font-medium italic">Panel de control administrativo / Directorio</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Buscar por nombre o empleado..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none transition-all shadow-sm"
            />
          </div>

          <select
            value={filtroActivo}
            onChange={(e) => setFiltroActivo(e.target.value)}
            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-500 uppercase tracking-wider outline-none cursor-pointer hover:bg-slate-50"
          >
            <option value="activos">Activos</option>
            <option value="inactivos">Inactivos</option>
            <option value="todos">Todos los registros</option>
          </select>

          <button
            onClick={() => {
              setEditingUser(null);
              setFormData({ nombre: "", correo: "", numEmpleado: "", clave: "", rol: "" });
              setOpenForm(true);
            }}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition-all active:scale-95 shadow-md shadow-emerald-600/10"
          >
            <Plus size={18} /> Nuevo Registro
          </button>
        </div>
      </div>

      {/* TABLA: Estilo Verde y Blanco */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left">Datos de Usuario</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left">ID Empleado</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left">Rol / Permisos</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left">Estado</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Opciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {loading ? (
                  <tr>
                      <td colSpan="5" className="py-20 text-center">
                          <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto" />
                          <p className="text-slate-400 mt-3 text-xs font-medium">Cargando base de datos...</p>
                      </td>
                  </tr>
              ) : usuariosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-20 text-center">
                    <p className="text-slate-400 text-sm">No se encontraron registros para mostrar.</p>
                  </td>
                </tr>
              ) : (
                usuariosFiltrados.map((u) => (
                  <tr key={u.id} className="group hover:bg-emerald-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center border ${u.activo == 1 ? "bg-white border-emerald-100 text-emerald-600" : "bg-slate-50 border-slate-200 text-slate-400"}`}>
                            <UserCircle size={20} />
                        </div>
                        <div>
                          <div className="font-bold text-slate-700 text-sm leading-none mb-1">{u.nombre}</div>
                          <div className="text-[11px] text-slate-400 font-medium">{u.correo}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-500 font-bold">
                      #{u.numEmpleado}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tighter inline-flex items-center gap-1.5 border ${
                        u.rol === "Administrador" ? "bg-emerald-600 text-white border-emerald-600" : 
                        u.rol === "Docente" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-slate-100 text-slate-600 border-slate-200"
                      }`}>
                        {u.rol || "Sin Rol"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black border ${u.activo == 1 ? "bg-white border-emerald-200 text-emerald-700" : "bg-white border-red-100 text-red-500"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${u.activo == 1 ? "bg-emerald-500" : "bg-red-400"}`} />
                        {u.activo == 1 ? "ACTIVO" : "INACTIVO"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(u)} className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-all" title="Editar">
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => handleCopy(u)} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-all" title="Copiar">
                          <Copy size={16} />
                        </button>
                        {u.activo == 1 ? (
                          <button onClick={() => setConfirmDelete(u)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-all" title="Desactivar">
                            <MinusCircle size={16} />
                          </button>
                        ) : (
                          <button onClick={() => handleReactivate(u.id)} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded transition-all" title="Reactivar">
                            <CheckCircle2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DRAWER: Proporción Estilizada */}
      {openForm && (
        <>
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[80] transition-opacity" onClick={() => setOpenForm(false)} />
            <div className="fixed top-0 right-0 h-full w-full max-w-[420px] bg-white z-[90] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded">
                            <UserPlus size={20} />
                        </div>
                        <h2 className="text-lg font-bold text-slate-800 tracking-tight">
                            {editingUser ? "Editar Usuario" : "Añadir Usuario"}
                        </h2>
                    </div>
                    <button onClick={() => setOpenForm(false)} className="text-slate-400 hover:text-slate-600 p-2">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <FormInput icon={<UserCircle size={18}/>} label="Nombre Completo" value={formData.nombre} placeholder="Nombre y Apellidos" onChange={(v) => setFormData({ ...formData, nombre: v })} />
                    <FormInput icon={<Mail size={18}/>} label="Correo Institucional" value={formData.correo} placeholder="ejemplo@utn.edu.mx" onChange={(v) => setFormData({ ...formData, correo: v })} />
                    <FormInput icon={<Hash size={18}/>} label="ID de Empleado" value={formData.numEmpleado} placeholder="12345" onChange={(v) => setFormData({ ...formData, numEmpleado: v })} />
                    <FormInput icon={<ShieldCheck size={18}/>} label="Contraseña" type="password" value={formData.clave} placeholder="••••••••" onChange={(v) => setFormData({ ...formData, clave: v })} />

                    <div className="space-y-3 pt-2">
                        <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Nivel de Acceso</label>
                        <div className="grid grid-cols-1 gap-2">
                          {["Administrador", "Docente", "Soporte"].map((role) => (
                            <button
                              key={role}
                              onClick={() => setFormData({...formData, rol: role})}
                              className={`flex items-center justify-between px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
                                formData.rol === role 
                                ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm" 
                                : "border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200"
                              }`}
                            >
                              {role}
                              {formData.rol === role && <CheckCircle2 size={16} />}
                            </button>
                          ))}
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-100 grid grid-cols-2 gap-3">
                    <button onClick={() => setOpenForm(false)} className="px-4 py-2.5 bg-white border border-slate-200 text-slate-600 font-bold rounded-lg text-sm hover:bg-slate-100 transition-colors">
                        Cerrar
                    </button>
                    <button onClick={handleSave} className="px-4 py-2.5 bg-emerald-600 text-white font-bold rounded-lg text-sm hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20">
                        {editingUser ? "Actualizar" : "Registrar"}
                    </button>
                </div>
            </div>
        </>
      )}

      {/* MODAL ELIMINAR */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white w-full max-w-xs rounded-xl shadow-2xl p-6 border border-slate-100 text-center animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
                <AlertCircle size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-800">¿Inactivar Usuario?</h3>
            <p className="text-slate-500 text-xs mt-2 mb-6 leading-relaxed">
              El usuario <strong>{confirmDelete.nombre}</strong> no podrá acceder al sistema hasta ser reactivado.
            </p>
            <div className="flex gap-2">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2 rounded-lg bg-slate-100 text-slate-600 text-sm font-bold hover:bg-slate-200">Cancelar</button>
              <button onClick={handleDelete} className="flex-1 py-2 rounded-lg bg-red-600 text-white text-sm font-bold hover:bg-red-700 shadow-lg shadow-red-600/10">Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FormInput({ label, value, onChange, type = "text", icon, placeholder }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest ml-1">{label}</label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors">
            {icon}
        </div>
        <input
            type={type}
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:bg-white focus:border-emerald-500 outline-none transition-all placeholder:text-slate-300"
        />
      </div>
    </div>
  );
}
