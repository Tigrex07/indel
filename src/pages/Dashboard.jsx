import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import SectionRenderer from "./SectionRenderer";

export default function Dashboard({ onLogout }) {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [username, setUsername] = useState("");

  const [grupoSeleccionado, setGrupoSeleccionado] = useState(null);
  const [edificioSeleccionado, setEdificioSeleccionado] = useState(null);

  const [aulaSeleccionada, setAulaSeleccionada] = useState(null);


  useEffect(() => {
    fetch("https://corporacionperris.com/backend/api/me.php", {
      credentials: "include",
    })
      .then(r => r.json())
      .then(j => j.success && setUsername(j.usuario.nombre));
  }, []);

  return (
    <div className="min-h-screen flex bg-emerald-50 text-gray-900">

      <Sidebar
        activeSection={activeSection}
        setActiveSection={(sec) => {
          setActiveSection(sec);
          setGrupoSeleccionado(null);
          setEdificioSeleccionado(null);
        }}
        username={username}
        onLogout={onLogout}
      />

      <main className="flex-1 p-10 space-y-10">

        <SectionRenderer
              section={activeSection}
              grupoSeleccionado={grupoSeleccionado}
              edificioSeleccionado={edificioSeleccionado}
              setEdificioSeleccionado={(edificio) => {
                setEdificioSeleccionado(edificio);
                setAulaSeleccionada(null); // 🔥 reset si cambias edificio
              }}
              aulaSeleccionada={aulaSeleccionada}
              setAulaSeleccionada={setAulaSeleccionada}

              onOpenCategory={(clave, nombre, id) => {

                if (clave === null) {
                  setGrupoSeleccionado(null);
                  return;
                }

                setGrupoSeleccionado({ clave, nombre, id });
                setActiveSection("activos");
              }}
            />

      </main>
    </div>
  );
}
