import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Package,
  Trash2,
  Repeat,
  Users,
  FileText,
  Settings,
  LogOut,
  Text,
  FileMinus,
  FileMinus2
} from "lucide-react";

import Usuario from "../components/Usuarios.jsx";
import DashboardHome from "../components/Dashboardhome.jsx";
import ActivosSection from "../components/ActivosSection.jsx";
import Bajas from "../components/Bajas.jsx";
import SolicitarBaja from "../pages/SolicitarBaja.jsx"


const sections = [
  { key: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
  { key: "activos", label: "Activos", icon: <Package size={20} /> },
  { key: "bajas", label: "Bajas", icon: <Trash2 size={20} /> },
  { key: "transferencias", label: "Transferencias", icon: <Repeat size={20} /> },
  { key: "usuarios", label: "Usuarios", icon: <Users size={20} /> },
  { key: "reportes", label: "Reportes", icon: <FileText size={20} /> },
  { key: "solicitarBaja", label: "SolicitarBaja", icon: <FileMinus size={20} /> },
  { key: "preferencias", label: "Preferencias", icon: <Settings size={20} /> },
  { key: "preferencias", label: "Preferencias", icon: <Settings size={20} /> },
  { key: "preferencias", label: "Preferencias", icon: <Settings size={20} /> },
  { key: "preferencias", label: "Preferencias", icon: <Settings size={20} /> },
  { key: "preferencias", label: "Preferencias", icon: <Settings size={20} /> },
  

];


  export default function Dashboard({ onLogout, onOpenCategory }) {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [username, setUsername] = useState(""); // 👈 aquí guardaremos el nombre

   useEffect(() => {
    fetch("https://corporacionperris.com/backend/api/me.php", {
      method: "GET",
      credentials: "include", // 👈 enviar cookie PHP
    }).then(res => res.json())
      .then(json => {
        if (json.success) setUsername(json.usuario.nombre);
      })
      .catch(err => console.error("Error al obtener usuario:", err));
  }, []);



  return (
    <div className="min-h-screen flex bg-emerald-50 text-gray-900">

      {/* SIDEBAR */}
      <aside className="w-72 bg-gradient-to-b from-emerald-600 to-emerald-900 text-white flex flex-col p-6 shadow-2xl">
        <h2 className="text-2xl font-bold mb-8 tracking-wide text-emerald-200">
          Indeltario
        </h2>

        <nav className="space-y-2">
          {sections.map((s) => (
            <button
              key={s.key}
              onClick={() => setActiveSection(s.key)}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all duration-300 
                ${
                  activeSection === s.key
                    ? "bg-emerald-400 text-black shadow-lg scale-105"
                    : "hover:bg-emerald-300 hover:text-black"
                }`}
            >
              {s.icon}
              <span className="font-semibold">{s.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 text-sm text-emerald-200">
  Bienvenido,{" "}
  <span className="font-semibold text-white">{username}</span>
</div>

        <button
          onClick={onLogout}
          className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
        >
          <LogOut size={18} />
          Cerrar sesión
        </button>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-10 space-y-10">
        <h1 className="text-3xl font-extrabold text-emerald-700 tracking-wide">
          Panel de Control
        </h1>

        <SectionRenderer
          section={activeSection}
          onOpenCategory={onOpenCategory}
        />
      </main>
    </div>
  );
}

function SectionRenderer({ section, onOpenCategory }) {
  switch (section) {
    case "bajas":
      return <Bajas />;

    case "dashboard":
      return <DashboardHome />;

    case "usuarios":
      return <Usuario />;

    case "activos":
      return <ActivosSection />;

    case "solicitarBaja":
        return <SolicitarBaja />

    default:
      return (
        <div className="bg-white p-10 rounded-xl shadow-xl border border-emerald-200">
          <p className="text-gray-700">Sección en construcción…</p>
        </div>
      );
  }
}

