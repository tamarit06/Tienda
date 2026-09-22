import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Login.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  async function iniciarSesion(e: React.FormEvent) {
    e.preventDefault();

    setError("");

    try {
      const respuesta = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      if (!respuesta.ok) {
        setError("Usuario o contraseña incorrectos");
        return;
      }

      const datos = await respuesta.json();

      localStorage.setItem("token", datos.access_token);

      navigate("/admin");

    } catch (err) {
      setError("No se pudo conectar con el servidor");
    }
  }

  return (
    <div className="login">
      <form className="login-form" onSubmit={iniciarSesion}>
        <h1>Administración</h1>

        <label>
          Usuario
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>

        <label>
          Contraseña
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        {error && (
          <p className="login-error">
            {error}
          </p>
        )}

        <button type="submit">
          Iniciar sesión
        </button>
      </form>
    </div>
  );
}