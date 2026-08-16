import { useEffect, useRef } from 'react'
import Button from '../Button/Button'

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
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-label={title || 'Dialog'} className="max-w-3xl w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <Button onClick={onClose} variant="ghost" size="sm" className="text-gray-500 p-1">✕</Button>
        </div>
        <div className="p-4">{children}</div>
        {footer ? <div className="px-4 py-3 border-t border-gray-100">{footer}</div> : null}
      </div>
    </div>
  )
}
