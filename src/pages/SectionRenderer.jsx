import Usuario from "../components/Usuarios.jsx";
import DashboardHome from "../components/Dashboardhome.jsx";
import ActivosSection from "../components/ActivosSection.jsx";
import ActivosGrupo from "../components/ActivosGrupo.jsx";
import Bajas from "../components/Bajas.jsx";
import SolicitarBaja from "./SolicitarBaja.jsx";

export default function SectionRenderer({
  section,
  grupoSeleccionado,
  onOpenCategory
}) {
  switch (section) {
    case "dashboard":
      return <DashboardHome />;

    case "usuarios":
      return <Usuario />;

    case "bajas":
      return <Bajas />;

    case "solicitarBaja":
      return <SolicitarBaja />;

    case "activos":
      return grupoSeleccionado ? (
        <ActivosGrupo
          grupoClave={grupoSeleccionado}
          onBack={() => onOpenCategory(null)}
        />
      ) : (
        <ActivosSection onOpenCategory={onOpenCategory} />
      );

    default:
      return (
        <div className="bg-white p-10 rounded-xl shadow-xl border border-emerald-200">
          <p className="text-gray-700">Sección en construcción…</p>
        </div>
      );
  }
}
