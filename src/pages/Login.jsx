import { useState } from "react";
import utnLogo from "../assets/utn.png";
import tiLogo from "../assets/ti.png";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Usuario:", username, "Password:", password);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-white via-green-100 to-white">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-md p-8 border border-green-200">
        
        {/* Logos arriba */}
        <div className="flex justify-center gap-6 mb-6">
          <img src={utnLogo} alt="UTN Logo" className="h-16 w-auto" />
          <img src={tiLogo} alt="TI Logo" className="h-16 w-auto" />
        </div>

        <h2 className="text-2xl font-semibold text-green-700 text-center mb-6">
          Acceso al Sistema Escolar
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              placeholder="Ingresa tu usuario"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition duration-300"
          >
            Entrar
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-green-600 hover:underline cursor-pointer">
          ¿Olvidaste tu contraseña?
        </p>
      </div>
    </div>
  );
}