import { useState } from "react";
import utnLogo from "../assets/utn.png";
import tiLogo from "../assets/ti.png";
import fondoUtn from "../assets/fondo-utn.jpg";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setLoading(true);

    try {
      const response = await fetch("https://corporacionperris.com/backend/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          numEmpleado: username,
          clave: password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMensaje("✅ " + data.message);
        // Pasamos el nombre real al App.jsx
        onLogin(data.nombre); // ← asegúrate que el backend devuelve { success: true, nombre: "Viktor" }
      } else {
        setMensaje("❌ " + data.message);
      }
    } catch (error) {
      setMensaje("❌ Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${fondoUtn})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Contenedor */}
      <div className="relative w-full max-w-lg bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-10 border border-green-300">
        {/* Logos */}
        <div className="flex justify-center items-center gap-8 mb-8">
          <img src={utnLogo} alt="UTN Logo" className="h-20 drop-shadow-lg" />
          <img src={tiLogo} alt="TI Logo" className="h-20 drop-shadow-lg" />
        </div>

        <h2 className="text-2xl font-bold text-green-700 text-center mb-8">
          Acceso al Sistema Escolar
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-5 py-3 border rounded-full focus:ring-2 focus:ring-green-500"
              placeholder="Ingresa tu usuario"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-3 border rounded-full focus:ring-2 focus:ring-green-500"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition shadow-md disabled:opacity-50"
          >
            {loading ? "Validando..." : "Entrar"}
          </button>
        </form>

        {mensaje && (
          <p className="mt-6 text-center font-semibold">{mensaje}</p>
        )}

        <p className="mt-4 text-center text-sm text-green-700 hover:underline cursor-pointer">
          ¿Ha olvidado sus datos de acceso?
        </p>
      </div>
    </div>
  );
}