import type { NuevoProducto, ProductosResponse } from '../types/producto'

const API_URL =
  import.meta.env.VITE_API_URL ??
  'https://nunk2bv345.execute-api.us-east-1.amazonaws.com/tablasvega'

export async function obtenerProductos(): Promise<ProductosResponse> {
  const res = await fetch(API_URL)

  if (!res.ok) {
    throw new Error(`Error al obtener productos (${res.status})`)
  }

  return res.json()
}

export async function crearProducto(
  producto: NuevoProducto,
): Promise<void> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(producto),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(
      text || `Error al crear producto (${res.status})`,
    )
  }
}
