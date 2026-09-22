import type { ItemCarrito } from "../types";
import "./Cart.css";

interface CartProps {
  items: ItemCarrito[];
  total: number;
  abierto: boolean;
  onCerrar: () => void;
  onCambiarCantidad: (productoId: number, delta: number) => void;
  onQuitar: (productoId: number) => void;
}

export default function Cart({
  items,
  total,
  abierto,
  onCerrar,
  onCambiarCantidad,
  onQuitar,
}: CartProps) {
  function hacerPedido() {
  const mensaje = items
    .map(
      (item) =>
        `${item.producto.nombre} x${item.cantidad} - $${(
          item.producto.precio * item.cantidad
        ).toFixed(2)}`
    )
    .join("\n");

  const texto = `Hola, quiero realizar este pedido:\n\n${mensaje}\n\nTotal: $${total.toFixed(2)}`;

  const numeroWhatsApp = "59150133";

  const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(texto)}`;

  window.open(url, "_blank");
}
  return (
    <>
      {abierto && <div className="carrito-overlay" onClick={onCerrar} />}

      <aside className={`carrito ${abierto ? "carrito-abierto" : ""}`}>
        <div className="carrito-cabecera">
          <h2>Tu combo</h2>
          <button className="carrito-cerrar" onClick={onCerrar} aria-label="Cerrar carrito">
            ×
          </button>
        </div>

        {items.length === 0 ? (
          <p className="carrito-vacio">Todavía no agregaste nada. Elegí algo del menú.</p>
        ) : (
          <ul className="carrito-lista">
            {items.map((item) => (
              <li key={item.producto.id} className="carrito-item">
                <div className="carrito-item-info">
                  <span className="carrito-item-nombre">{item.producto.nombre}</span>
                  <span className="carrito-item-precio">
                    ${(item.producto.precio * item.cantidad).toFixed(2)}
                  </span>
                </div>

                <div className="carrito-item-controles">
                  <button onClick={() => onCambiarCantidad(item.producto.id, -1)} aria-label="Restar">
                    −
                  </button>
                  <span>{item.cantidad}</span>
                  <button onClick={() => onCambiarCantidad(item.producto.id, 1)} aria-label="Sumar">
                    +
                  </button>
                  <button
                    className="carrito-item-quitar"
                    onClick={() => onQuitar(item.producto.id)}
                    aria-label="Quitar del carrito"
                  >
                    Quitar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="carrito-total">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <button
  className="boton-pedido"
  onClick={hacerPedido}
  disabled={items.length === 0}
>
  Realizar pedido
</button>
      </aside>
    </>
  );
}
