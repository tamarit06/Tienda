
import { useEffect, useState } from "react";
import { obtenerProductos } from "../api";
import type { Producto, ItemCarrito } from "../types";

import ProductGrid from "../components/ProductGrid";
import Cart from "../components/Cart";

import "./Tienda.css";

export default function Tienda() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [carritoAbierto, setCarritoAbierto] = useState(false);

  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    async function cargarDatos() {
      try {
        const prods = await obtenerProductos();
        setProductos(prods);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error desconocido"
        );
      } finally {
        setCargando(false);
      }
    }

    cargarDatos();
  }, []);

  function agregarAlCarrito(producto: Producto) {
    setCarrito((actual) => {
      const existente = actual.find(
        (item) => item.producto.id === producto.id
      );

      if (existente) {
        return actual.map((item) =>
          item.producto.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }

      return [...actual, { producto, cantidad: 1 }];
    });

    setMensaje(`✓ ${producto.nombre} agregado al carrito`);

    setTimeout(() => {
      setMensaje("");
    }, 2000);
  }

  function cambiarCantidad(productoId: number, delta: number) {
    setCarrito((actual) =>
      actual
        .map((item) =>
          item.producto.id === productoId
            ? { ...item, cantidad: item.cantidad + delta }
            : item
        )
        .filter((item) => item.cantidad > 0)
    );
  }

  function quitarDelCarrito(productoId: number) {
    setCarrito((actual) =>
      actual.filter((item) => item.producto.id !== productoId)
    );
  }

  const totalPrecio = carrito.reduce(
    (suma, item) =>
      suma + item.producto.precio * item.cantidad,
    0
  );

  return (
    <div className="pagina">

      {mensaje && (
        <div className="mensaje-carrito">
          {mensaje}
        </div>
      )}

      <main className="contenido">
        <h1>Productos</h1>

        {cargando && (
          <p className="estado-info">
            Cargando el menú...
          </p>
        )}

        {error && (
          <p className="estado-error">
            {error}. Revisá que el backend esté corriendo en{" "}
            <code>localhost:8000</code>.
          </p>
        )}

        {!cargando && !error && (
          <ProductGrid
            productos={productos}
            onAgregar={agregarAlCarrito}
          />
        )}
      </main>

      <button
        className="boton-carrito"
        onClick={() => setCarritoAbierto(true)}
      >
        🛒
      </button>

      <Cart
        items={carrito}
        total={totalPrecio}
        abierto={carritoAbierto}
        onCerrar={() => setCarritoAbierto(false)}
        onCambiarCantidad={cambiarCantidad}
        onQuitar={quitarDelCarrito}
      />
    </div>
  );
}

