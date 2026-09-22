import type { Producto } from "../types";
import ProductCard from "./ProductCard.tsx";
import "./ProductGrid.css";

interface ProductGridProps {
  productos: Producto[];
  onAgregar: (producto: Producto) => void;
}

export default function ProductGrid({ productos, onAgregar }: ProductGridProps) {
  if (productos.length === 0) {
    return <p className="estado-info">Todavía no hay productos cargados en el backend.</p>;
  }

  return (
    <div className="grilla-productos">
      {productos.map((producto) => (
        <ProductCard key={producto.id} producto={producto} onAgregar={onAgregar} />
      ))}
    </div>
  );
}
