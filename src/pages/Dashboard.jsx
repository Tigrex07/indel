import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import SectionRenderer from "./SectionRenderer";

export default function Dashboard({ onLogout, onOpenCategory }) {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [username, setUsername] = useState("");

  useEffect(() => {
    fetch("https://corporacionperris.com/backend/api/me.php", {
      method: "GET",
      credentials: "include"
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setUsername(json.usuario.nombre);
      })
      .catch(err => console.error("Error al obtener usuario:", err));
  }, []);

  return (
    <div className="min-h-screen flex bg-emerald-50 text-gray-900">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        username={username}
        onLogout={onLogout}
      />

      <main className="flex-1 p-10 space-y-10">
        <h1 className="text-3xl font-extrabold text-emerald-700 tracking-wide">
          Panel de Control
        </h1>

        <SectionRenderer
          section={activeSection}
          onOpenCategory={onOpenCategory}
        />
      </main>
    </div>
  );
}