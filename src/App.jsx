import { useState } from "react";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import CategoryView from "./pages/CategoryView.jsx";

export default function App() {
  const [screen, setScreen] = useState("login");
  const [category, setCategory] = useState(null);
  const [username, setUsername] = useState("");

  if (screen === "login") {
    return <Login onLogin={(nombre) => {
      setUsername(nombre);
      setScreen("dashboard");
    }} />;
  }

  if (screen === "dashboard") {
    return (
      <Dashboard
        username={username}
        onLogout={() => setScreen("login")}
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