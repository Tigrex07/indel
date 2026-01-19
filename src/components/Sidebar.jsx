import { Building2, School, Boxes, Users, Home, LogOut } from "lucide-react";

export default function Sidebar({ setView, currentView, onLogout }) {
  return (
    <aside className="w-64 bg-white border-r shadow-sm flex flex-col">
      <div className="p-6">
        <h2 className="text-xl font-bold text-green-700">Sistema Escolar</h2>
        <p className="text-sm text-gray-500">Panel de Administración</p>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        
        <Item
          label="Dashboard"
          icon={<Home size={20} />}
          active={currentView === "dashboard"}
          onClick={() => setView("dashboard")}
        />

        <Item
          label="Edificios"
          icon={<Building2 size={20} />}
          active={currentView === "edificios"}
          onClick={() => setView("edificios")}
        />

        <Item
          label="Aulas"
          icon={<School size={20} />}
          active={currentView === "aulas"}
          onClick={() => setView("aulas")}
        />

        <Item
          label="Inventario"
          icon={<Boxes size={20} />}
          active={currentView === "inventario"}
          onClick={() => setView("inventario")}
        />

        <Item
          label="Usuarios"
          icon={<Users size={20} />}
          active={currentView === "usuarios"}
          onClick={() => setView("usuarios")}
        />
      </nav>

      <div className="p-3 border-t">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 transition"
        >
          <LogOut size={18} /> Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}

function Item({ label, icon, active, onClick }) {
  return (
    <button
      className={`
        flex items-center gap-3 w-full px-3 py-2 rounded-lg transition
        ${active ? "bg-green-600 text-white shadow" : "hover:bg-green-100 text-gray-700"}
      `}
      onClick={onClick}
    >
      {icon}
      {label}
    </button>
  );
}