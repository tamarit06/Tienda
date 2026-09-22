import type { Producto } from "../types";

interface AdminProductListProps {
  productos: Producto[];
  onEliminar: (productoId: number) => void;
  onEditar: (producto: Producto) => void;
}

export default function AdminProductList({
  productos,
  onEliminar,
  onEditar,
}: AdminProductListProps) {
  return (
    <div className="admin-productos">
      {productos.map((producto) => (
        <div className="admin-producto" key={producto.id}>
          <div>
            <h3>{producto.nombre}</h3>

            <p>{producto.descripcion}</p>

            <span>
              ${producto.precio.toFixed(2)}
            </span>
          </div>

          <div>
            <span>
              {producto.disponible
                ? "Disponible"
                : "No disponible"}
            </span>

            <button
              onClick={() => onEditar(producto)}
            >
              Editar
            </button>

            <button
              onClick={() => onEliminar(producto.id)}
            >
              Eliminar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}