import Usuario from "../components/Usuarios.jsx";
import DashboardHome from "../components/DashboardHome.jsx";
import ActivosSection from "../components/ActivosSection.jsx";
import ActivosGrupo from "../components/ActivosGrupo.jsx";
import Bajas from "../components/Bajas.jsx";
import EdificiosSection from "../components/EdificiosSection.jsx";
import AulasSection from "../components/AulasSection.jsx";
import ActivosAula from "../components/ActivosAula.jsx";
import Reportes from "../components/Reportes.jsx";
import SolicitarBaja from "../components/SolicitarBaja.jsx";
import Encargados from "../pages/Encargados.jsx";
import Recursos from "../components/Recursos.jsx";
import Transferencias from "../pages/Transferencias.jsx";
import MisEncargos from "../components/MisEncargos.jsx";
export default function SectionRenderer({
  section,
  role, // Viene de Dashboard.jsx
  userId,
  username,
  grupoSeleccionado,
  onOpenCategory,
  edificioSeleccionado,
  setEdificioSeleccionado,
  aulaSeleccionada,
  setAulaSeleccionada
}) {

  const permisos = {
    "Administrador": ["dashboard", "usuarios", "encargados", "activos", "edificios", "transferencias", "bajas", "recursos", "reportes", "solicitar-baja", "Mis Encargos"], // <-- AÑADIDO AQUÍ
    "Soporte": ["dashboard", "activos", "edificios", "transferencias", "bajas", "recursos", "reportes", "solicitar-baja"], // <-- AÑADIDO AQUÍ TAMBIÉN
    "Docente": ["solicitar-baja", "recursos", "Mis Encargos"],
    "Encargado": ["solicitar-baja", "recursos", "Mis Encargos"]
  };

  // 2. Validación de seguridad
  const tieneAcceso = permisos[role]?.includes(section);

  if (role && !tieneAcceso) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="bg-red-50 text-red-500 p-8 rounded-[2rem] border border-red-100 shadow-xl">
          <h2 className="text-xl font-black uppercase italic">Acceso Denegado</h2>
          <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-[0.2em]">
            Tu nivel de usuario ({role}) no permite ver esta sección.
          </p>
        </div>
      </div>
    );
  }

  // 3. Renderizado de componentes
  switch (section) {
    case "dashboard":
      return <DashboardHome />;

    case "usuarios":
      return <Usuario />;

    case "encargados":
      return <Encargados />;

    case "bajas":
      return <Bajas />;

    case "reportes":
      return <Reportes />;

    case "recursos":
      return <Recursos />;

    case "transferencias":
      return <Transferencias />;
    
    case "solicitar-baja":
      return <SolicitarBaja userId={userId}/>;

    
case "Mis Encargos":
    // Ahora sí, le pasamos el nombre real al componente
    return <MisEncargos nombreUsuario={username} userRole={role} />;

    case "activos":
      // Si seleccionamos un grupo (ej. Escritorios), mostramos el inventario de ese grupo
      if (grupoSeleccionado) {
        return (
          <ActivosGrupo
            grupoClave={grupoSeleccionado.clave}
            grupoNombre={grupoSeleccionado.nombre}
            idGrupo={grupoSeleccionado.idGrupo}
            onBack={() => onOpenCategory(null)}
          />
        );
      }
      // Si no, mostramos la cuadrícula de grupos
      return <ActivosSection onOpenCategory={onOpenCategory} />;

    case "edificios":
      // Nivel 1: Lista de Edificios
      if (!edificioSeleccionado) {
        return (
          <EdificiosSection
            onSelectEdificio={setEdificioSeleccionado}
          />
        );
      }

      // Nivel 2: Lista de Aulas del edificio seleccionado
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

      // Nivel 3: Activos dentro del aula seleccionada
      return (
        <ActivosAula
          idAula={aulaSeleccionada.idAula}
          nombreAula={aulaSeleccionada.nombre}
          claveAula={aulaSeleccionada.clave}
          onBack={() => setAulaSeleccionada(null)}
        />
      );

    default:
      return <DashboardHome />;
  }
}