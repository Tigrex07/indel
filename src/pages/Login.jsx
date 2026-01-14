import { useState } from "react";
import utnLogo from "../assets/utn.png";
import tiLogo from "../assets/ti.png";
import fondoUtn from "../assets/fondo-utn.jpg";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Usuario:", username, "Password:", password);
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${fondoUtn})` }}
    >
      {/* Overlay para opacar el fondo */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Contenido encima */}
      <div className="relative w-full max-w-lg bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-10 border border-green-300">
        
        {/* Logos grandes */}
        <div className="flex justify-center items-center gap-8 mb-8">
          <img src={utnLogo} alt="UTN Logo" className="h-20 w-auto drop-shadow-lg" />
          <img src={tiLogo} alt="TI Logo" className="h-20 w-auto drop-shadow-lg" />
        </div>

        {/* Título institucional */}
        <h2 className="text-2xl font-bold text-green-700 text-center mb-8">
          Acceso al Sistema Escolar
        </h2>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-5 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 transition"
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
              className="w-full px-5 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition duration-300 shadow-md"
          >
            Entrar
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-green-700 hover:underline cursor-pointer">
          ¿Ha olvidado sus datos de acceso?
        </p>
      </div>
    </div>
  );
}