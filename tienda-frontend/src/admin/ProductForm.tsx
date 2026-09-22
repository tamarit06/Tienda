import { useState } from "react";

interface Producto {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  disponible: boolean;
}

interface ProductFormProps {
  producto?: Producto;
  onProductoGuardado: () => void;
  onCancelar?: () => void;
}

export default function ProductForm({
  producto,
  onProductoGuardado,
  onCancelar,
}: ProductFormProps) {

  const [nombre, setNombre] = useState(
    producto?.nombre ?? ""
  );

  const [descripcion, setDescripcion] = useState(
    producto?.descripcion ?? ""
  );

  const [precio, setPrecio] = useState(
    producto?.precio?.toString() ?? ""
  );

  const [disponible, setDisponible] = useState(
    producto?.disponible ?? true
  );

  async function guardarProducto(
    e: React.FormEvent
  ) {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("No estás autenticado");
      return;
    }

    const datos = {
      nombre,
      descripcion,
      precio: Number(precio),
      disponible,
    };

    const url = producto
      ? `http://localhost:8000/productos/${producto.id}`
      : "http://localhost:8000/productos";

    const method = producto ? "PUT" : "POST";

    const respuesta = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(datos),
    });

    if (!respuesta.ok) {

      if (respuesta.status === 401) {
        alert("Tu sesión no es válida o ha expirado");
        return;
      }

      alert("No se pudo guardar el producto");
      return;
    }

    setNombre("");
    setDescripcion("");
    setPrecio("");
    setDisponible(true);

    onProductoGuardado();
  }

  return (
    <form onSubmit={guardarProducto}>

      <h2>
        {producto ? "Editar producto" : "Nuevo producto"}
      </h2>

      <label>
        Nombre
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
      </label>

      <label>
        Descripción
        <input
          type="text"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
      </label>

      <label>
        Precio
        <input
          type="number"
          step="0.01"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          required
        />
      </label>

      <label>
        Disponible
        <input
          type="checkbox"
          checked={disponible}
          onChange={(e) => setDisponible(e.target.checked)}
        />
      </label>

      <button type="submit">
        {producto ? "Guardar cambios" : "Crear producto"}
      </button>

      {producto && onCancelar && (
        <button
          type="button"
          onClick={onCancelar}
        >
          Cancelar
        </button>
      )}

    </form>
  );
}