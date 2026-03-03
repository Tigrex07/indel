import { FiBell, FiLogOut } from "react-icons/fi";

export default function Topbar({ user, onLogout }) {
  return (
    <div className="h-16 bg-white shadow flex items-center justify-between px-6 border-b">
      <div className="text-lg font-semibold">Bienvenido {user?.nombre || ""}</div>

      <div className="flex items-center gap-4">
        <FiBell className="text-xl" />
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
        >
          <FiLogOut /> Salir
        </button>
      </div>
    </div>
  );
}