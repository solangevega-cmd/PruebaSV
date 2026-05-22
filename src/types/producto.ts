export interface Producto {
  tablasvega: string
  Nombre: string
  Stock: number
  'Valor Venta': number
  createdAt?: string
  updatedAt?: string
}

export interface ProductosResponse {
  items: Producto[]
  count: number
  lastEvaluatedKey: string | null
}

export interface NuevoProducto {
  Nombre: string
  Stock: number
  'Valor Venta': number
}

export interface ActualizarProducto extends NuevoProducto {
  tablasvega: string
}
