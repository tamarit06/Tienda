export interface Producto {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio: number;
  disponible: boolean;
}

export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}