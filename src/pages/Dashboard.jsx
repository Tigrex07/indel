
import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import SectionRenderer from "./SectionRenderer";

export default function Dashboard({ onLogout }) {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [username, setUsername] = useState("");
  const [grupoSeleccionado, setGrupoSeleccionado] = useState(null);

  //edificio y aulas

const [edificioSeleccionado, setEdificioSeleccionado] = useState(null);

  useEffect(() => {
    fetch("https://corporacionperris.com/backend/api/me.php", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setUsername(json.usuario.nombre);
      });
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
          setEdificioSeleccionado={setEdificioSeleccionado}
          onOpenCategory={(clave) => {
            setGrupoSeleccionado(clave);
            setActiveSection("activos");
          }}
          />
      </main>
    </div>
  );
}
