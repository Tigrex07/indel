import React, { useState } from "react";
import { LogOut, LayoutDashboard, AlertCircle, Users, Package, Building2, FileText, Download, Trash2, User, ClipboardList } from "lucide-react";

// 1. Definición de secciones con los nombres EXACTOS de tu imagen
const sections = [
  { key: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={20}/>, roles: ["Administrador", "Soporte"] },
  { key: "activos", label: "Grupos", icon: <Package size={20}/>, roles: ["Administrador", "Soporte"] },
  { key: "edificios", label: "Edificios", icon: <Building2 size={20}/>, roles: ["Administrador", "Soporte"] },
  { key: "bajas", label: "Gestión de Solicitudes", icon: <Trash2 size={20}/>, roles: ["Administrador", "Soporte"] },
  { key: "usuarios", label: "Usuarios", icon: <Users size={20}/>, roles: ["Administrador"] },
  { key: "reportes", label: "Reportes", icon: <ClipboardList size={20}/>, roles: ["Administrador", "Soporte"] },
  { key: "solicitar-baja", label: "Solicitar Movimiento", icon: <FileText size={20}/>, roles: ["Administrador", "Soporte", "Docente"] },
  { key: "recursos", label: "Recursos", icon: <Download size={20}/>, roles: ["Administrador", "Soporte", "Docente"] },
  { key: "encargados", label: "Encargados", icon: <User size={20}/>, roles: ["Administrador"] },
  { key: "Mis Encargos", label: "Mis Encargos", icon: <ClipboardList size={20}/>, roles: ["Administrador", "Soporte", "Docente"] },
];

export default function Sidebar({ activeSection, setActiveSection, username, userRole, onLogout }) {
  const [showConfirm, setShowConfirm] = useState(false);

  const getFilteredSections = () => {
    if (!sections || !Array.isArray(sections)) return [];
    if (!userRole) return sections; // Mostrar todo si no hay rol para evitar bloqueos iniciales

    return sections.filter((s) => {
      if (!s.roles) return true;
      return s.roles.some(r => r.toLowerCase().trim() === userRole.toLowerCase().trim());
    });
  };

  const menuItems = getFilteredSections();

  return (
    <>
      <aside className="w-72 bg-emerald-700 text-white flex flex-col p-4 shadow-2xl min-h-screen border-r border-emerald-800">
        
        {/* HEADER */}
        <div className="px-4 py-8 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <LayoutDashboard size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white italic">Indeltario</h2>
              <p className="text-[10px] text-emerald-200 font-medium uppercase mt-1 opacity-80">
                {userRole || "ADMIN PANEL"}
              </p>
            </div>
          </div>
        </div>

        {/* NAVEGACIÓN */}
        <nav className="flex-1 space-y-1 px-2">
          <p className="text-[10px] font-semibold text-emerald-300 opacity-50 uppercase px-4 mb-4">
            Menú Principal
          </p>
          
          {menuItems.map((s) => (
            <button
              key={s.key}
              onClick={() => setActiveSection(s.key)}
              className={`flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all duration-200 group
                ${activeSection === s.key 
                  ? "bg-emerald-600 text-white shadow-lg" 
                  : "text-emerald-100 hover:bg-emerald-600/50"}`}
            >
              <div className="flex items-center gap-3 font-semibold text-sm">
                <span>{s.icon}</span>
                {s.label}
              </div>
              {activeSection === s.key && <div className="w-1.5 h-1.5 rounded-full bg-white shadow-md" />}
            </button>
          ))}
        </nav>

        {/* FOOTER USUARIO */}
        <div className="mt-auto pt-6 px-2 pb-2">
          <div className="bg-emerald-800/50 rounded-2xl p-4 mb-3 border border-emerald-600/30 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold border border-emerald-500/20 text-lg">
                {username ? username.charAt(0).toUpperCase() : "?"}
              </div>
              <div className="overflow-hidden">
                <p className="text-[10px] font-medium text-emerald-300 uppercase leading-none mb-1 tracking-widest">{userRole}</p>
                <p className="text-sm font-bold truncate text-white">{username || "Usuario"}</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowConfirm(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-xl font-bold text-xs uppercase hover:bg-red-700 transition-all shadow-lg"
          >
            <LogOut size={16} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* MODAL DE CONFIRMACIÓN */}
      {showConfirm && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 text-gray-900">
          <div className="bg-white w-full max-w-xs rounded-2xl shadow-2xl p-6 text-center border border-gray-100 animate-in zoom-in duration-200">
            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={28} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 italic">¿Cerrar Sesión?</h3>
            <p className="text-gray-500 text-xs mt-2 mb-6 uppercase font-bold tracking-tighter">Estás a punto de salir del sistema.</p>
            <div className="flex gap-2">
              <button onClick={() => setShowConfirm(false)} className="flex-1 py-2 rounded-xl border border-gray-200 text-gray-400 font-bold text-xs uppercase hover:bg-gray-50 transition-colors">No</button>
              <button onClick={onLogout} className="flex-1 py-2 rounded-xl bg-red-600 text-white font-bold text-xs uppercase hover:bg-red-700 shadow-xl shadow-red-200 transition-transform active:scale-95">Sí, salir</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}