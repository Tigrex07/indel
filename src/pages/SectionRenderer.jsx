import Usuario from "../components/Usuarios.jsx";
import DashboardHome from "../components/Dashboardhome.jsx";
import ActivosSection from "../components/ActivosSection.jsx";
import ActivosGrupo from "../components/ActivosGrupo.jsx";
import Bajas from "../components/Bajas.jsx";
import EdificiosSection from "../components/EdificiosSection.jsx";
import AulasSection from "../components/AulasSection.jsx";
import ActivosAula from "../components/ActivosAula.jsx"
import Reportes from "../components/Reportes.jsx";
import SolicitarBaja from "../components/SolicitarBaja.jsx";
export default function SectionRenderer({
  section,
  grupoSeleccionado,
  onOpenCategory,
  edificioSeleccionado,
  setEdificioSeleccionado,
  aulaSeleccionada,
  setAulaSeleccionada
}) {



  switch (section) {
    case "dashboard":
      return <DashboardHome />;

    case "usuarios":
      return <Usuario />;

    case "bajas":
      return <Bajas />;

      case "reportes":
      return <Reportes />;
    
    case "solicitar-baja":
      return <SolicitarBaja />;

    case "activos":
      return grupoSeleccionado ? (
        <ActivosGrupo
  grupoClave={grupoSeleccionado.clave}
  grupoNombre={grupoSeleccionado.nombre}
  idGrupo={grupoSeleccionado.id}
  onBack={() => onOpenCategory(null)}
/>
      ) : (
        <ActivosSection onOpenCategory={onOpenCategory} />
      );

case "edificios":

  if (!edificioSeleccionado) {
    return (
      <EdificiosSection
        onSelectEdificio={setEdificioSeleccionado}
      />
    );
  }

  if (!aulaSeleccionada) {
    return (
      <AulasSection
        idEdificio={edificioSeleccionado.idEdificio}
        nombreEdificio={edificioSeleccionado.nombre}
        claveEdificio={edificioSeleccionado.clave}
        actividadEdificio={edificioSeleccionado.actividad}
        onBack={() => setEdificioSeleccionado(null)}
        onSelectAula={setAulaSeleccionada}
      />
    );
  }

  return (
    <ActivosAula
      idAula={aulaSeleccionada.idAula}
      nombreAula={aulaSeleccionada.nombre}
      claveAula={aulaSeleccionada.clave}
      onBack={() => setAulaSeleccionada(null)}
    />
  );

    default:
      return (
        <div className="bg-white p-10 rounded-xl shadow border">
          Sección en construcción…
        </div>
      );
  }
}
