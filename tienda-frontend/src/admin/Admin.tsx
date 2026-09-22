
import { useEffect, useState } from "react";

import { obtenerProductos } from "../api";
import type { Producto } from "../types";

import AdminProductList from "./AdminProductList";
import ProductForm from "./ProductForm";

import "./Admin.css";

export default function Admin() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [productoEditando, setProductoEditando] =
    useState<Producto | null>(null);

  async function cargarProductos() {
    try {
      const datos = await obtenerProductos();
      setProductos(datos);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error desconocido"
      );
    } finally {
      setCargando(false);
    }
  }

  async function eliminarProducto(productoId: number) {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No estás autenticado");
      return;
    }

    const respuesta = await fetch(
      `http://localhost:8000/productos/${productoId}`,
      {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      }
    );

    if (!respuesta.ok) {
      if (respuesta.status === 401) {
        setError("Tu sesión no es válida o ha expirado");
        return;
      }

      setError("No se pudo eliminar el producto");
      return;
    }

    cargarProductos();
  }

  useEffect(() => {
    cargarProductos();
  }, []);

  return (
    <div className="admin">
      <header className="admin-header">
        <h1>Panel de administración</h1>
      </header>

      <main className="admin-contenido">
        <div className="admin-titulo">
          <h2>Productos</h2>

          <button
            className="boton-nuevo"
            onClick={() => setMostrarFormulario(true)}
          >
            + Nuevo producto
          </button>
        </div>

        {mostrarFormulario && (
          <ProductForm
            onProductoGuardado={() => {
              setMostrarFormulario(false);
              cargarProductos();
            }}
          />
        )}

        {productoEditando && (
          <ProductForm
            producto={productoEditando}
            onProductoGuardado={() => {
              setProductoEditando(null);
              cargarProductos();
            }}
          />
        )}

        {cargando && (
          <p>Cargando productos...</p>
        )}

        {error && (
          <p>{error}</p>
        )}

        {!cargando && !error && (
          <AdminProductList
            productos={productos}
            onEliminar={eliminarProducto}
            onEditar={setProductoEditando}
          />
        )}
      </main>
    </div>
  );
}