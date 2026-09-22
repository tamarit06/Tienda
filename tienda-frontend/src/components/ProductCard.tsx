import type { Producto } from "../types";
import "./ProductCard.css";

interface ProductCardProps {
  producto: Producto;
  onAgregar: (producto: Producto) => void;
}

export default function ProductCard({ producto, onAgregar }: ProductCardProps) {
  return (
    <article className={`tarjeta-producto ${!producto.disponible ? "no-disponible" : ""}`}>
      <div className="tarjeta-producto-info">
        <h3>{producto.nombre}</h3>
        {producto.descripcion && <p className="descripcion">{producto.descripcion}</p>}
      </div>

      <div className="tarjeta-producto-pie">
        <span className="precio">${producto.precio.toFixed(2)}</span>
        <button
          className="boton-agregar"
          onClick={() => onAgregar(producto)}
          disabled={!producto.disponible}
        >
          {producto.disponible ? "Agregar" : "Agotado"}
        </button>
      </div>
    </article>
  );
}
