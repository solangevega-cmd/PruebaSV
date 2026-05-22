import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import type { ReactNode } from 'react'
import './Modal.css'

interface ModalProps {
  abierto: boolean
  titulo: string
  children: ReactNode
  onCerrar: () => void
}

export default function Modal({
  abierto,
  titulo,
  children,
  onCerrar,
}: ModalProps) {
  useEffect(() => {
    if (!abierto) return

    const anterior = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function onEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') onCerrar()
    }

    document.addEventListener('keydown', onEscape)

    return () => {
      document.body.style.overflow = anterior
      document.removeEventListener('keydown', onEscape)
    }
  }, [abierto, onCerrar])

  if (!abierto) return null

  return createPortal(
    <div
      className="modal-overlay"
      role="presentation"
      onClick={onCerrar}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modal__header">
          <h3 id="modal-title">{titulo}</h3>
          <button
            type="button"
            className="modal__close"
            onClick={onCerrar}
            aria-label="Cerrar"
          >
            ×
          </button>
        </header>
        <div className="modal__body">{children}</div>
      </div>
    </div>,
    document.body,
  )
}
