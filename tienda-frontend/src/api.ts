import type { Producto } from "./types";

// Ajustá esta URL si tu backend corre en otro puerto o dominio.
const API_URL = "http://localhost:8000";

async function manejarRespuesta<T>(res: Response, mensajeError: string): Promise<T> {
  if (!res.ok) {
    throw new Error(mensajeError);
  }
  return res.json() as Promise<T>;
}

export async function obtenerProductos(): Promise<Producto[]> {
  const res = await fetch(`${API_URL}/productos`);
  return manejarRespuesta<Producto[]>(res, "No se pudieron cargar los productos");
}