import { useEffect, useRef } from 'react'
import Button from '../Button/Button'
import Card from '../Card/Card'

export default function Modal({ isOpen, onClose, title, children, footer }) {
  const overlayRef = useRef(null)
  const dialogRef = useRef(null)

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose && onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', onKey)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  function handleOverlayClick(e) {
    if (e.target === overlayRef.current) onClose && onClose()
  }

  return (
    <div ref={overlayRef} onMouseDown={handleOverlayClick} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card ref={dialogRef} role="dialog" aria-modal="true" aria-label={title || 'Dialog'} variant="elevated" padding="none" className="max-w-3xl w-full overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <Button onClick={onClose} variant="ghost" size="icon-sm" className="text-gray-500" aria-label="Cerrar diálogo" title="Cerrar">✕</Button>
        </div>
        <div className="p-4">{children}</div>
        {footer ? <div className="px-4 py-3 border-t border-gray-100">{footer}</div> : null}
      </Card>
    </div>
  )
}
