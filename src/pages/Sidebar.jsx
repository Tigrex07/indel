import React, { useState } from "react";
import { LogOut, UserCircle, LayoutDashboard, ChevronRight, AlertCircle } from "lucide-react";
import { sections } from "./Sections.jsx";

export default function Sidebar({ activeSection, setActiveSection, username, userRole, onLogout }) {
  const [showConfirm, setShowConfirm] = useState(false);

  // Filtrado ultra-seguro
  const getFilteredSections = () => {
    // Si por alguna razón 'sections' no existe, devolvemos un array vacío para no romper React
    if (!sections || !Array.isArray(sections)) return [];

    // Si no hay userRole, mostramos todas las secciones (evita pantalla en blanco)
    if (!userRole) return sections;

    return sections.filter((s) => {
      // Si la sección no tiene roles definidos, la mostramos
      if (!s.roles) return true;
      
      // Comparamos sin importar mayúsculas/minúsculas o espacios
      return s.roles.some(r => 
        r.toLowerCase().trim() === userRole.toLowerCase().trim()
      );
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
              <h2 className="text-2xl font-bold tracking-tight text-white">Indeltario</h2>
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
              className={`flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all duration-200
                ${activeSection === s.key ? "bg-emerald-600 text-white shadow-lg" : "text-emerald-100 hover:bg-emerald-600/50"}`}
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
                <p className="text-[10px] font-medium text-emerald-300 uppercase leading-none mb-1">{userRole || "Rol"}</p>
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
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-xs rounded-2xl shadow-2xl p-6 text-center border border-gray-100">
            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={28} />
            </div>
            <h3 className="text-lg font-bold text-gray-800">¿Cerrar Sesión?</h3>
            <p className="text-gray-500 text-xs mt-2 mb-6">Estás a punto de salir del sistema.</p>
            <div className="flex gap-2">
              <button onClick={() => setShowConfirm(false)} className="flex-1 py-2 rounded-xl border border-gray-200 text-gray-600 font-bold text-xs uppercase hover:bg-gray-50">No</button>
              <button onClick={onLogout} className="flex-1 py-2 rounded-xl bg-red-600 text-white font-bold text-xs uppercase hover:bg-red-700 shadow-lg">Sí, salir</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}