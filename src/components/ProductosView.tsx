import { useCallback, useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import {
  actualizarProducto,
  crearProducto,
  obtenerProductos,
} from '../api/tablasvega'
import type { ActualizarProducto, NuevoProducto, Producto } from '../types/producto'
import Modal from './Modal'
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
  const [editando, setEditando] = useState<ActualizarProducto | null>(null)
  const [modalCrear, setModalCrear] = useState(false)
  const [modalGuardar, setModalGuardar] = useState(false)

  const formCrearRef = useRef<HTMLFormElement>(null)
  const formEditarRef = useRef<HTMLFormElement>(null)

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

  function iniciarEdicion(producto: Producto) {
    setEditando({
      tablasvega: producto.tablasvega,
      Nombre: producto.Nombre,
      Stock: producto.Stock,
      'Valor Venta': producto['Valor Venta'],
    })
    setMensaje(null)
    setError(null)
    setModalGuardar(false)
  }

  function cancelarEdicion() {
    setEditando(null)
    setModalGuardar(false)
  }

  function abrirModalCrear() {
    if (!formCrearRef.current?.reportValidity()) return
    setModalCrear(true)
  }

  function abrirModalGuardar() {
    if (!formEditarRef.current?.reportValidity()) return
    setModalGuardar(true)
  }

  async function confirmarCrear() {
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
      setModalCrear(false)
      setMensaje('Producto creado correctamente.')
      await cargarProductos()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear')
      setModalCrear(false)
    } finally {
      setEnviando(false)
    }
  }

  async function confirmarGuardar() {
    if (!editando) return

    setEnviando(true)
    setError(null)
    setMensaje(null)

    try {
      await actualizarProducto({
        tablasvega: editando.tablasvega,
        Nombre: editando.Nombre.trim(),
        Stock: Number(editando.Stock),
        'Valor Venta': Number(editando['Valor Venta']),
      })
      setEditando(null)
      setModalGuardar(false)
      setMensaje('Producto actualizado correctamente.')
      await cargarProductos()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar')
      setModalGuardar(false)
    } finally {
      setEnviando(false)
    }
  }

  function handleSubmitCrear(e: FormEvent) {
    e.preventDefault()
    abrirModalCrear()
  }

  function handleSubmitEditar(e: FormEvent) {
    e.preventDefault()
    abrirModalGuardar()
  }

  return (
    <div className="productos">
      <header className="productos__header">
        <div>
          <h1>Tablas Vega</h1>
          <p className="productos__subtitle">
            Inventario — API Gateway (GET / POST / PATCH)
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

      <Modal
        abierto={modalCrear}
        titulo="Confirmar creación"
        onCerrar={() => !enviando && setModalCrear(false)}
      >
        <p className="modal__texto">¿Deseas crear este producto?</p>
        <ul className="modal__resumen">
          <li>
            <strong>Nombre:</strong> {form.Nombre}
          </li>
          <li>
            <strong>Valor venta:</strong> $
            {Number(form['Valor Venta']).toLocaleString('es-CO')}
          </li>
          <li>
            <strong>Stock:</strong> {Number(form.Stock).toLocaleString('es-CO')}
          </li>
        </ul>
        <div className="modal__actions">
          <button
            type="button"
            className="btn btn--secondary"
            onClick={() => setModalCrear(false)}
            disabled={enviando}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="btn btn--primary"
            onClick={confirmarCrear}
            disabled={enviando}
          >
            {enviando ? 'Creando…' : 'Crear'}
          </button>
        </div>
      </Modal>

      <Modal
        abierto={modalGuardar}
        titulo="Confirmar cambios"
        onCerrar={() => !enviando && setModalGuardar(false)}
      >
        {editando && (
          <>
            <p className="modal__texto">¿Deseas guardar los cambios?</p>
            <ul className="modal__resumen">
              <li>
                <strong>Nombre:</strong> {editando.Nombre}
              </li>
              <li>
                <strong>Valor venta:</strong> $
                {Number(editando['Valor Venta']).toLocaleString('es-CO')}
              </li>
              <li>
                <strong>Stock:</strong>{' '}
                {Number(editando.Stock).toLocaleString('es-CO')}
              </li>
            </ul>
            <div className="modal__actions">
              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => setModalGuardar(false)}
                disabled={enviando}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn--primary"
                onClick={confirmarGuardar}
                disabled={enviando}
              >
                {enviando ? 'Guardando…' : 'Guardar'}
              </button>
            </div>
          </>
        )}
      </Modal>

      {editando && (
        <section className="card card--edit">
          <div className="card__title">
            <h2>Editar producto</h2>
            <span className="mono mono--sm" title={editando.tablasvega}>
              {editando.tablasvega}
            </span>
          </div>
          <form
            ref={formEditarRef}
            className="form"
            onSubmit={handleSubmitEditar}
          >
            <label>
              Nombre
              <input
                type="text"
                required
                value={editando.Nombre}
                onChange={(e) =>
                  setEditando((f) =>
                    f ? { ...f, Nombre: e.target.value } : f,
                  )
                }
              />
            </label>
            <label>
              Valor venta
              <input
                type="number"
                required
                min={0}
                value={editando['Valor Venta'] || ''}
                onChange={(e) =>
                  setEditando((f) =>
                    f
                      ? { ...f, 'Valor Venta': Number(e.target.value) }
                      : f,
                  )
                }
              />
            </label>
            <label>
              Stock
              <input
                type="number"
                required
                min={0}
                value={editando.Stock || ''}
                onChange={(e) =>
                  setEditando((f) =>
                    f ? { ...f, Stock: Number(e.target.value) } : f,
                  )
                }
              />
            </label>
            <div className="form__actions">
              <button type="submit" className="btn btn--primary">
                Guardar
              </button>
              <button
                type="button"
                className="btn btn--secondary"
                onClick={cancelarEdicion}
              >
                Cancelar
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="card">
        <h2>Nuevo producto</h2>
        <form ref={formCrearRef} className="form" onSubmit={handleSubmitCrear}>
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
          <button type="submit" className="btn btn--primary">
            Crear
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
                  <th>Actualizado</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {productos.map((p) => (
                  <tr
                    key={p.tablasvega}
                    className={
                      editando?.tablasvega === p.tablasvega
                        ? 'row--active'
                        : undefined
                    }
                  >
                    <td>{p.Nombre}</td>
                    <td>${p['Valor Venta'].toLocaleString('es-CO')}</td>
                    <td>{p.Stock.toLocaleString('es-CO')}</td>
                    <td>{formatearFecha(p.updatedAt ?? p.createdAt)}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn--link"
                        onClick={() => iniciarEdicion(p)}
                        disabled={enviando}
                      >
                        Editar
                      </button>
                    </td>
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
