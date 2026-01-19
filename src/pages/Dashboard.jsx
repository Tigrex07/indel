import { useState } from "react";

const sections = [
  { key: "activos", label: "Activos", icon: "📦" },
  { key: "bajas", label: "Bajas", icon: "🗑️" },
  { key: "transferencias", label: "Transferencias", icon: "⇄" },
  { key: "encargados", label: "Encargados", icon: "👤" },
  { key: "usuarios", label: "Usuarios", icon: "👥" },
  { key: "reportes", label: "Reportes", icon: "📑" },
  { key: "preferencias", label: "Preferencias", icon: "⚙" },
];

export default function Dashboard({ username, onLogout, onOpenCategory }) {
  const [activeSection, setActiveSection] = useState("activos");

  return (
    <div className="min-h-screen flex bg-emerald-50 text-gray-900">

      {/* SIDEBAR */}
      <aside className="w-72 bg-gradient-to-b from-emerald-600 to-emerald-900 text-white flex flex-col p-6 shadow-2xl">

        <h2 className="text-2xl font-bold mb-8 tracking-wide text-emerald-200">
          Inventario Escolar
        </h2>

        {/* Opciones */}
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

        {/* Bienvenida abajo a la izquierda */}
        <div className="mt-auto pt-6 text-sm text-emerald-200 opacity-80">
          Bienvenido, <span className="font-semibold text-white">{username}</span>
        </div>

      </aside>

      {/* MAIN */}
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
              className="px-4 py-2 border rounded-full w-56 focus:ring-2 focus:ring-emerald-500"
            />
            <input
              type="text"
              placeholder="Buscar por aula"
              className="px-4 py-2 border rounded-full w-56 focus:ring-2 focus:ring-emerald-500"
            />

            <button
              onClick={onLogout}
              className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition"
            >
              Cerrar sesión
            </button>
          </div>
        </div>

        {/* Sección dinámica */}
        <SectionRenderer section={activeSection} onOpenCategory={onOpenCategory} />

      </main>
    </div>
  );
}

function SectionRenderer({ section, onOpenCategory }) {
  switch (section) {
    case "activos":
      return <ActivosSection onOpenCategory={onOpenCategory} />;

    default:
      return (
        <div className="bg-white p-10 rounded-xl shadow-xl border border-emerald-200">
          <p className="text-gray-700">Sección en construcción…</p>
        </div>
      );
  }
}

function ActivosSection({ onOpenCategory }) {
  const categories = ["Escritorios", "Teles", "Computadoras", "Proyectores"];

  return (
    <div className="bg-white rounded-xl shadow-xl p-8 border border-emerald-200">
      <h2 className="text-xl font-bold text-emerald-600 mb-6">Activos registrados</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onOpenCategory(cat)}
            className="bg-emerald-100 rounded-lg p-6 text-center shadow hover:shadow-lg hover:bg-emerald-200 transition-all duration-300"
          >
            <p className="text-sm font-semibold text-gray-800">{cat}</p>
          </button>
        ))}
      </div>
    </div>
  );
}