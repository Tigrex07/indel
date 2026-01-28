import { LogOut } from "lucide-react";
import { sections } from "./Sections.jsx";

export default function Sidebar({ activeSection, setActiveSection, username, onLogout }) {
  return (
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
        Bienvenido, <span className="font-semibold text-white">{username}</span>
      </div>

      <button
        onClick={onLogout}
        className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
      >
        <LogOut size={18} />
        Cerrar sesión
      </button>
    </aside>
  );
}