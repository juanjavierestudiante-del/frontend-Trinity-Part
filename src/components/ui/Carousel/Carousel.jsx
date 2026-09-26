import { useState } from 'react'
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi'

export default function Carousel({ children, className = '' }) {
  const items = Array.isArray(children) ? children : [children]
  const [currentIndex, setCurrentIndex] = useState(0)

  const goTo = (index) => {
    if (index < 0) setCurrentIndex(items.length - 1)
    else if (index >= items.length) setCurrentIndex(0)
    else setCurrentIndex(index)
  }

  if (items.length === 0) return null

  return (
    <div
      className={`relative group ${className}`}
      role="region"
      aria-roledescription="carrusel"
      aria-label="Galería de imágenes"
    >
      <div className="overflow-hidden rounded-card" aria-live="polite" aria-atomic="true">
        {items[currentIndex]}
      </div>

      {items.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => goTo(currentIndex - 1)}
            className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 touch-manipulation items-center justify-center rounded-full bg-black/40 p-2 text-white opacity-100 transition-opacity hover:bg-black/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:opacity-0 sm:group-hover:opacity-100"
            aria-label="Imagen anterior"
          >
            <HiChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => goTo(currentIndex + 1)}
            className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 touch-manipulation items-center justify-center rounded-full bg-black/40 p-2 text-white opacity-100 transition-opacity hover:bg-black/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:opacity-0 sm:group-hover:opacity-100"
            aria-label="Imagen siguiente"
          >
            <HiChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </>
      )}

      {items.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {items.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentIndex(index)}
              className={`h-9 w-9 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                index === currentIndex
                  ? 'bg-primary'
                  : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Ir a la imagen ${index + 1} de ${items.length}`}
              aria-current={index === currentIndex ? 'true' : undefined}
            />
          ))}
        </div>
      )}
    </div>
  )
}
