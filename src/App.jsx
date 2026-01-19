import { useState } from "react";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import CategoryView from "./pages/CategoryView.jsx";

export default function App() {
  const [screen, setScreen] = useState("login"); 
  const [category, setCategory] = useState(null);
  const [username, setUsername] = useState(""); // ← nombre real del usuario

  // Cuando el usuario inicia sesión
  const handleLogin = (nombreReal) => {
    setUsername(nombreReal);   // Guardamos el nombre real
    setScreen("dashboard");    // Entramos al dashboard
  };

  // Cuando cierra sesión
  const handleLogout = () => {
    setUsername("");
    setScreen("login");
  };

  // Renderizado por pantallas
  if (screen === "login") {
    return <Login onLogin={handleLogin} />;
  }

  if (screen === "dashboard") {
    return (
      <Dashboard
        username={username}
        onLogout={handleLogout}
        onOpenCategory={(cat) => {
          setCategory(cat);
          setScreen("category");
        }}
      />
    );
  }

  if (screen === "category") {
    return (
      <CategoryView
        category={category}
        onBack={() => setScreen("dashboard")}
      />
    );
  }

  return null;
}