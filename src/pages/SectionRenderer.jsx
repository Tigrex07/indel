import Usuario from "../components/Usuarios.jsx";
import DashboardHome from "../components/Dashboardhome.jsx";
import ActivosSection from "../components/ActivosSection.jsx";
import ActivosGrupo from "../components/ActivosGrupo.jsx";
import Bajas from "../components/Bajas.jsx";
import SolicitarBaja from "./SolicitarBaja.jsx";
import AulasSection from "../components/AulasSection.jsx";
import EdificiosSection from "../components/EdificiosSection.jsx";




export default function SectionRenderer({
  section,
  grupoSeleccionado,
  onOpenCategory,
   edificioSeleccionado,
  setEdificioSeleccionado
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

    case "edificios":
  return edificioSeleccionado ? (
    <AulasSection
      idEdificio={edificioSeleccionado}
      onBack={() => setEdificioSeleccionado(null)}
    />
  ) : (
    <EdificiosSection
      onSelectEdificio={(id) => setEdificioSeleccionado(id)}
    />
  );

      case "aulas":
  return (
    <AulasSection
      idEdificio={edificioSeleccionado}
      onBack={() => {
        setEdificioSeleccionado(null);
        setSection("edificios");
      }}
    />
  );

    default:
      return (
        <div className="bg-white p-10 rounded-xl shadow-xl border border-emerald-200">
          <p className="text-gray-700">Sección en construcción…</p>
        </div>
      );
  }
}
