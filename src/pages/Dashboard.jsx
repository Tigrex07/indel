import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import SectionRenderer from "./SectionRenderer";

export default function Dashboard({ onLogout }) {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState(""); // Nuevo estado para el rol

  const [grupoSeleccionado, setGrupoSeleccionado] = useState(null);
  const [edificioSeleccionado, setEdificioSeleccionado] = useState(null);
  const [aulaSeleccionada, setAulaSeleccionada] = useState(null);

  useEffect(() => {
    fetch("https://corporacionperris.com/backend/api/me.php", {
      credentials: "include",
    })
      .then(r => r.json())
      .then(j => {
        if (j.success) {
          setUsername(j.usuario.nombre);
          // Guardamos el rol tal cual viene (Administrador, Soporte, etc.)
          setRole(j.usuario.rol); 
        }
      })
      .catch(err => console.error("Error al obtener datos del usuario:", err));
  }, []);

  return (
    <div className="min-h-screen flex bg-emerald-50 text-gray-900">

      <Sidebar
        activeSection={activeSection}
        setActiveSection={(sec) => {
          setActiveSection(sec);
          setGrupoSeleccionado(null);
          setEdificioSeleccionado(null);
          setAulaSeleccionada(null); 
        }}
        username={username}
        userRole={role} // Pasamos el rol al Sidebar
        onLogout={onLogout}
      />

      <main className="flex-1 p-10 space-y-10">
        <SectionRenderer
          section={activeSection}
          role={role} // Pasamos el rol al Renderer para seguridad
          grupoSeleccionado={grupoSeleccionado}
          edificioSeleccionado={edificioSeleccionado}
          setEdificioSeleccionado={(edificio) => {
            setEdificioSeleccionado(edificio);
            setAulaSeleccionada(null);
          }}
          aulaSeleccionada={aulaSeleccionada}
          setAulaSeleccionada={setAulaSeleccionada}
          onOpenCategory={(grupo) => {
            if (grupo === null) {
              setGrupoSeleccionado(null);
              return;
            }
            setGrupoSeleccionado(grupo);
            setActiveSection("activos");
          }}
        />
      </main>
    </div>
  );
}