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
  if (!abierto) return null

  return (
    <div
      className="modal-overlay"
      role="presentation"
      onClick={onCerrar}
      onKeyDown={(e) => e.key === 'Escape' && onCerrar()}
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
    </div>
  )
}
