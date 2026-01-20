import { useState } from "react";

export default function Register({ changeView }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    console.log("Registro:", { name, email, password });
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>Registro</h2>
      
      <input 
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      
      <input
        type="email"
        placeholder="Correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      
      <button type="submit">Crear cuenta</button>

      <p className="link" onClick={changeView}>
        ¿Ya tienes cuenta? Inicia sesión
      </p>
    </form>
  );
}
