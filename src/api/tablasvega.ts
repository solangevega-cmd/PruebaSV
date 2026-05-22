import type {
  ActualizarProducto,
  NuevoProducto,
  ProductosResponse,
} from '../types/producto'

/** En Amplify usa ruta relativa + rewrite (evita CORS). En local, proxy de Vite. */
const API_URL = import.meta.env.VITE_API_URL ?? '/tablasvega'

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

export async function actualizarProducto(
  producto: ActualizarProducto,
): Promise<void> {
  const res = await fetch(API_URL, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(producto),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(
      text || `Error al actualizar producto (${res.status})`,
    )
  }
}
