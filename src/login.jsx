import { useState } from "react";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    // Aquí luego conectarás con tu backend en PHP
    console.log("Login:", { email, password });

    onLogin(); // inicia sesión
  }

  return (
    <div className="auth-container">
      <div className="auth-card">

        <div className="auth-left">
          <h1 className="title">Bienvenido de Vuelta!</h1>
          <p className="subtitle">Inicia Sesión</p>

          <form onSubmit={handleSubmit} className="form">
            <input 
              type="email"
              placeholder="Correo Electrónico"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              className="input neumorph"
            />

            <input 
              type="password"
              placeholder="Número de Empleado"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              className="input neumorph"
            />

            <div className="options">
              <label><input type="checkbox"/> Recordarme</label>
              <span className="forgot">¿Olvidaste tu Contraseña?</span>
            </div>

            <button className="btn">Iniciar Sesión</button>
          </form>
        </div>

        <div className="auth-right">
          <h2>Welcome Back!</h2>
          <p>
            Log in to continue and control your tasks, data and projects
            efficiently with our platform.
          </p>
        </div>

      </div>
    </div>
  );
}
