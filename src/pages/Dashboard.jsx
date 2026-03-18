import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import SectionRenderer from "./SectionRenderer";

export default function Dashboard({ onLogout }) {
console.log("¡HOLA! Soy el Dashboard y ya cargué");

  const [activeSection, setActiveSection] = useState("dashboard");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState(""); // Nuevo estado para el rol
  const [userId, setUserId] = useState(null);

  const [grupoSeleccionado, setGrupoSeleccionado] = useState(null);
  const [edificioSeleccionado, setEdificioSeleccionado] = useState(null);
  const [aulaSeleccionada, setAulaSeleccionada] = useState(null);



const obtenerIdInterno = async (num) => {
    console.log("EJECUTANDO obtenerIdInterno CON NUM:", num); // LOG DE CONTROL 2
    try {
      const res = await fetch("https://corporacionperris.com/backend/api/idusuario.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numEmpleado: num })
      });
      const data = await res.json();
      console.log("RESPUESTA DE idusuario.php:", data); // LOG DE CONTROL 3
      if (data.success) {
        setUserId(data.id_usuario);
        localStorage.setItem("user_id_interno", data.id_usuario);
      }
    } catch (e) {
      console.error("ERROR EN FETCH ID:", e);
    }
  };

  useEffect(() => {
  fetch("https://corporacionperris.com/backend/api/me.php", {
    credentials: "include",
  })
    .then(r => r.json())
    .then(j => {
      if (j.success) {
        setUsername(j.usuario.nombre);
        setRole(j.usuario.rol);
        
        // Si el ID ya viene en la sesión (que ahora sí vendrá), lo guardamos directo
        if (j.usuario.id) {
          setUserId(j.usuario.id);
          localStorage.setItem("user_id_interno", j.usuario.id);
          console.log("ID cargado directamente desde sesión:", j.usuario.id);
        }
      }
    })
    .catch(err => console.error("Error:", err));
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
        userId={userId}
        onLogout={onLogout}
      />

      <main className="flex-1 p-10 space-y-10">
        <SectionRenderer
          section={activeSection}
          role={role} // Pasamos el rol al Renderer para seguridad
          userId={userId}
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