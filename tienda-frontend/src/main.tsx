import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

const contenedor = document.getElementById("root");
if (!contenedor) {
  throw new Error("No se encontró el elemento #root en index.html");
}

ReactDOM.createRoot(contenedor).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
