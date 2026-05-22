import { useCallback, useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { crearProducto, obtenerProductos } from '../api/tablasvega'
import type { NuevoProducto, Producto } from '../types/producto'
import './ProductosView.css'

const formularioInicial: NuevoProducto = {
  Nombre: '',
  Stock: 0,
  'Valor Venta': 0,
}

function formatearFecha(iso?: string) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('es-CO')
}

export default function ProductosView() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [total, setTotal] = useState(0)
  const [cargando, setCargando] = useState(true)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mensaje, setMensaje] = useState<string | null>(null)
  const [form, setForm] = useState<NuevoProducto>(formularioInicial)

  const cargarProductos = useCallback(async () => {
    setCargando(true)
    setError(null)
    try {
      const data = await obtenerProductos()
      setProductos(data.items)
      setTotal(data.count)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Error desconocido'
      setError(
        msg === 'Failed to fetch'
          ? 'No se pudo conectar con la API. En Amplify: agrega el rewrite /tablasvega (ver amplify-rewrites.json) y quita VITE_API_URL con la URL de API Gateway.'
          : msg,
      )
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    cargarProductos()
  }, [cargarProductos])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setEnviando(true)
    setError(null)
    setMensaje(null)

    try {
      await crearProducto({
        Nombre: form.Nombre.trim(),
        Stock: Number(form.Stock),
        'Valor Venta': Number(form['Valor Venta']),
      })
      setForm(formularioInicial)
      setMensaje('Producto creado correctamente.')
      await cargarProductos()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="productos">
      <header className="productos__header">
        <div>
          <h1>Tablas Vega</h1>
          <p className="productos__subtitle">
            Inventario desde API Gateway (GET / POST)
          </p>
        </div>
        <button
          type="button"
          className="btn btn--secondary"
          onClick={cargarProductos}
          disabled={cargando}
        >
          {cargando ? 'Actualizando…' : 'Actualizar lista'}
        </button>
      </header>

      {error && <div className="alert alert--error">{error}</div>}
      {mensaje && <div className="alert alert--success">{mensaje}</div>}

      <section className="card">
        <h2>Nuevo producto</h2>
        <form className="form" onSubmit={handleSubmit}>
          <label>
            Nombre
            <input
              type="text"
              required
              value={form.Nombre}
              onChange={(e) =>
                setForm((f) => ({ ...f, Nombre: e.target.value }))
              }
              placeholder="Ej. Cuaderno"
            />
          </label>
          <label>
            Valor venta
            <input
              type="number"
              required
              min={0}
              value={form['Valor Venta'] || ''}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  'Valor Venta': Number(e.target.value),
                }))
              }
            />
          </label>
          <label>
            Stock
            <input
              type="number"
              required
              min={0}
              value={form.Stock || ''}
              onChange={(e) =>
                setForm((f) => ({ ...f, Stock: Number(e.target.value) }))
              }
            />
          </label>
          <button
            type="submit"
            className="btn btn--primary"
            disabled={enviando}
          >
            {enviando ? 'Guardando…' : 'Crear (POST)'}
          </button>
        </form>
      </section>

      <section className="card">
        <div className="card__title">
          <h2>Listado de productos</h2>
          <span className="badge">{total} registros</span>
        </div>

        {cargando ? (
          <p className="productos__loading">Cargando productos…</p>
        ) : productos.length === 0 ? (
          <p className="productos__empty">No hay productos registrados.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Valor venta</th>
                  <th>Stock</th>
                  <th>ID</th>
                  <th>Creado</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((p) => (
                  <tr key={p.tablasvega}>
                    <td>{p.Nombre}</td>
                    <td>${p['Valor Venta'].toLocaleString('es-CO')}</td>
                    <td>{p.Stock.toLocaleString('es-CO')}</td>
                    <td className="mono" title={p.tablasvega}>
                      {p.tablasvega.slice(0, 8)}…
                    </td>
                    <td>{formatearFecha(p.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
