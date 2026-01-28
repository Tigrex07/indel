import Usuario from "../components/Usuarios.jsx";
import DashboardHome from "../components/Dashboardhome.jsx";
import ActivosSection from "../components/ActivosSection.jsx";
import Bajas from "../components/Bajas.jsx";
import SolicitarBaja from "./SolicitarBaja.jsx";

export default function SectionRenderer({ section, onOpenCategory }) {
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
      return <SolicitarBaja />;

    default:
      return (
        <div className="bg-white p-10 rounded-xl shadow-xl border border-emerald-200">
          <p className="text-gray-700">Sección en construcción…</p>
        </div>
      );
  }
}