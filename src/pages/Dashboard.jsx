import { useState } from "react";

const sections = [
  { key: "activos", label: "Activos", icon: "" },
  { key: "bajas", label: "Bajas", icon: "" },
  { key: "transferencias", label: "Transferencias", icon: "" },
  { key: "encargados", label: "Encargados", icon: "" },
  { key: "usuarios", label: "Usuarios", icon: "" },
  { key: "reportes", label: "Reportes", icon: "" },
  { key: "preferencias", label: "Preferencias", icon: "" },
];

export default function Dashboard({ onLogout }) {
  const [activeSection, setActiveSection] = useState("activos");

  return (
    <div className="min-h-screen flex bg-emerald-50 text-gray-900">
      {/* Sidebar */}
      <aside className="w-72 bg-gradient-to-b from-emerald-600 to-emerald-900 text-white flex flex-col p-6 shadow-2xl">
        <h2 className="text-2xl font-bold mb-8 tracking-wide text-emerald-200">
          Inventario Escolar
        </h2>
        <nav className="space-y-2">
          {sections.map((s) => (
            <button
              key={s.key}
              onClick={() => setActiveSection(s.key)}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all duration-300 
                ${activeSection === s.key 
                  ? "bg-emerald-400 text-black shadow-lg scale-105" 
                  : "hover:bg-emerald-300 hover:text-black"}`}
            >
              <span>{s.icon}</span>
              <span className="font-semibold">{s.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-10 space-y-10">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-extrabold text-emerald-700 tracking-wide">
            Panel de Control
          </h1>
          <div className="flex gap-4 items-center">
            <input
              type="text"
              placeholder="Buscar por edificio"
              className="px-4 py-2 border rounded-full w-56 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <input
              type="text"
              placeholder="Buscar por aula"
              className="px-4 py-2 border rounded-full w-56 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {/* Botón de cerrar sesión */}
            <button
              onClick={onLogout}
              className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition"
            >
              Cerrar sesión
            </button>
          </div>
        </div>

        {/* Sección dinámica */}
        <SectionRenderer section={activeSection} />
      </main>
    </div>
  );
}

function SectionRenderer({ section }) {
  switch (section) {
    case "activos":
      return <Grid title="Activos registrados" items={["Escritorios", "Teles", "Computadoras", "Proyectores"]} />;
    case "bajas":
      return <Grid title="Bajas recientes" items={["Monitor dañado", "CPU obsoleto"]} />;
    case "transferencias":
      return <Grid title="Transferencias" items={["De Roma Norte a Polanco", "De Edificio A a Edificio B"]} />;
    case "encargados":
      return <Grid title="Encargados" items={["Juan Pérez", "María López"]} />;
    case "usuarios":
      return <Grid title="Usuarios registrados" items={["Admin", "Encargado", "Visitante"]} />;
    case "reportes":
      return <Grid title="Reportes disponibles" items={["Inventario general", "Bajas por mes", "Transferencias activas"]} />;
    case "preferencias":
      return <Grid title="Preferencias" items={["Tema oscuro", "Notificaciones", "Roles y permisos"]} />;
    default:
      return null;
  }
}

function Grid({ title, items }) {
  return (
    <div className="bg-white rounded-xl shadow-xl p-8 border border-emerald-200 animate-fadeIn">
      <h2 className="text-xl font-bold text-emerald-600 mb-6">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {items.map((item, i) => (
          <div
            key={i}
            className="bg-emerald-100 rounded-lg p-6 text-center shadow hover:shadow-lg hover:bg-emerald-200 transition-all duration-300"
          >
            <p className="text-sm font-semibold text-gray-800">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}