import { useEffect, useId, useRef } from 'react'

export default function Modal({ isOpen, onClose, title, children, footer }) {
  const overlayRef = useRef(null)
  const dialogRef = useRef(null)
  const closeButtonRef = useRef(null)
  const titleId = useId()

  useEffect(() => {
    if (!isOpen) return undefined
    const previouslyFocused = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const focusInitial = () => {
      closeButtonRef.current?.focus()
    }
    const frame = window.requestAnimationFrame(focusInitial)
    const onKey = (event) => {
      if (event.key === 'Escape') {
        onClose?.()
        return
      }
      if (event.key !== 'Tab') return
      const focusable = Array.from(dialogRef.current?.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])') || [])
      if (!focusable.length) {
        event.preventDefault()
        dialogRef.current?.focus()
        return
      }
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      window.cancelAnimationFrame(frame)
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus()
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  function handleOverlayClick(e) {
    if (e.target === overlayRef.current) onClose?.()
  }

  return (
    <div ref={overlayRef} onMouseDown={handleOverlayClick} className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overscroll-contain bg-black/50 p-3 sm:p-4">
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={title ? titleId : undefined} aria-label={title ? undefined : 'Diálogo'} tabIndex={-1} className="relative flex max-h-[calc(100dvh-1.5rem)] w-full max-w-3xl flex-col overflow-hidden rounded-card border border-white/55 bg-gradient-to-br from-primary-light/85 via-primary-light/70 to-secondary/15 shadow-[0_14px_36px_-22px_rgba(91,31,184,0.45)] backdrop-blur-xl sm:max-h-[calc(100dvh-2rem)]">
        <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-4 py-3">
          <h3 id={titleId} className="text-lg font-semibold">{title}</h3>
          <button ref={closeButtonRef} type="button" onClick={onClose} className="inline-flex min-h-11 min-w-11 touch-manipulation items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" aria-label="Cerrar diálogo" title="Cerrar">✕</button>
        </div>
        <div className="min-h-0 max-w-full overflow-auto overscroll-contain p-4">{children}</div>
        {footer ? <div className="shrink-0 border-t border-gray-100 px-4 py-3">{footer}</div> : null}
      </div>
    </div>
  )
}
