import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import Button from "../ui/Button/Button";
import Card from "../ui/Card/Card";
import { cloudinaryUrl } from "../../utils/cloudinary";

/**
 * @param {{ imagenes: Array<{ idImagen: number; url: string; principal: boolean }>; nombre: string }} props
 */
export default function ProductoGaleria({ imagenes = [], nombre }) {
  const [imagenActiva, setImagenActiva] = useState(0);
  const [imagenAnterior, setImagenAnterior] = useState(null);
  const [galeriaVisible, setGaleriaVisible] = useState(true);
  const touchStartX = useRef(null);
  const indiceActivoRef = useRef(0);
  const carruselRef = useRef(null);
  const imagenesValidas = imagenes.filter((imagen) => imagen?.url);
  const imageKey = imagenesValidas.map((imagen) => imagen.idImagen).join("-");

  useEffect(() => {
    const elemento = carruselRef.current;
    if (!elemento || !("IntersectionObserver" in window)) return undefined;
    const observador = new IntersectionObserver(([entrada]) =>
      setGaleriaVisible(entrada.isIntersecting),
    );
    observador.observe(elemento);
    return () => observador.disconnect();
  }, []);

  // Cambios móviles: fundido con entrada breve desde la derecha y mayor pausa entre imágenes.
  useEffect(() => {
    if (imagenesValidas.length < 2) return undefined;
    const consultaMovil = window.matchMedia("(max-width: 767px)");
    const consultaMovimientoReducido = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    let temporizador;
    const actualizarTemporizador = () => {
      window.clearTimeout(temporizador);
      if (
        !consultaMovil.matches ||
        consultaMovimientoReducido.matches ||
        !galeriaVisible ||
        document.hidden
      )
        return;
      temporizador = window.setTimeout(() => {
        const anterior = indiceActivoRef.current;
        const siguiente = (anterior + 1) % imagenesValidas.length;
        indiceActivoRef.current = siguiente;
        setImagenAnterior(anterior);
        setImagenActiva(siguiente);
      }, 6500);
    };
    actualizarTemporizador();
    consultaMovil.addEventListener("change", actualizarTemporizador);
    consultaMovimientoReducido.addEventListener("change", actualizarTemporizador);
    document.addEventListener("visibilitychange", actualizarTemporizador);
    return () => {
      window.clearTimeout(temporizador);
      consultaMovil.removeEventListener("change", actualizarTemporizador);
      consultaMovimientoReducido.removeEventListener(
        "change",
        actualizarTemporizador,
      );
      document.removeEventListener("visibilitychange", actualizarTemporizador);
    };
  }, [imageKey, imagenesValidas.length, imagenActiva, galeriaVisible]);

  if (imagenesValidas.length === 0) {
    return (
      <Card
        variant="subtle"
        padding="none"
        className="flex aspect-[4/5] items-center justify-center md:aspect-square"
      >
        <div className="text-center text-muted">
          <ImageIcon className="mx-auto mb-3 h-10 w-10" aria-hidden="true" />
          <p className="text-sm font-medium">Imagen no disponible</p>
        </div>
      </Card>
    );
  }

  const irAImagen = (indice) => {
    const siguiente =
      (indice + imagenesValidas.length) % imagenesValidas.length;
    if (siguiente === indiceActivoRef.current) return;
    setImagenAnterior(indiceActivoRef.current);
    indiceActivoRef.current = siguiente;
    setImagenActiva(siguiente);
  };

  const desplazarPorGesto = (event) => {
    if (touchStartX.current == null) return;
    const diferencia = event.clientX - touchStartX.current;
    if (Math.abs(diferencia) > 40)
      irAImagen(imagenActiva + (diferencia < 0 ? 1 : -1));
    touchStartX.current = null;
  };

  const imagen = imagenesValidas[imagenActiva] ?? imagenesValidas[0];

  return (
    <section aria-label={`Galería de ${nombre}`} className="space-y-3">
      <Card
        variant="elevated"
        padding="none"
        className="relative overflow-hidden"
      >
        <div
          ref={carruselRef}
          className="relative aspect-[4/5] touch-pan-y bg-white/20 md:hidden"
          onPointerDown={(event) => {
            touchStartX.current = event.clientX;
          }}
          onPointerUp={desplazarPorGesto}
          onPointerCancel={() => {
            touchStartX.current = null;
          }}
        >
          {imagenesValidas.map((slide, indice) => {
            const activa = indice === imagenActiva;
            const saliente = indice === imagenAnterior;
            const animacion = activa
              ? "translate-x-0 opacity-100"
              : saliente
                ? "-translate-x-3 opacity-0"
                : "translate-x-3 opacity-0";
            return (
              <div
                key={slide.idImagen}
                aria-hidden={!activa}
                className={`absolute inset-0 flex items-center justify-center transition-[opacity,transform] duration-1000 ease-in-out motion-reduce:transition-none ${activa ? "pointer-events-auto" : "pointer-events-none"} ${animacion}`}
              >
                <img
                  src={cloudinaryUrl(slide.url, "w_800,q_auto,f_auto")}
                  alt={`${nombre} — imagen ${indice + 1}`}
                  className="h-full w-full object-contain"
                  decoding="async"
                />
              </div>
            );
          })}
          {imagenesValidas.length > 1 && (
            <div
              className="absolute inset-x-0 bottom-3 z-10 flex justify-center gap-2"
              aria-label="Imágenes del producto"
            >
              {imagenesValidas.map((miniatura, indice) => (
                <button
                  key={miniatura.idImagen}
                  type="button"
                  onClick={() => irAImagen(indice)}
                  aria-label={`Ver imagen ${indice + 1}`}
                  aria-current={indice === imagenActiva ? "true" : undefined}
                  className={`h-2.5 w-2.5 rounded-full border border-primary-dark/40 ${indice === imagenActiva ? "bg-primary-dark" : "bg-white/80"}`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="relative hidden h-[360px] items-center justify-center bg-white/20 md:flex lg:h-[500px]">
          <img
            key={imagen.idImagen}
            src={cloudinaryUrl(imagen.url, "w_800,q_auto,f_auto")}
            alt={`${nombre}${imagenesValidas.length > 1 ? ` — imagen ${imagenActiva + 1}` : ""}`}
            className="h-full w-full object-contain animate-fade-in-up"
            decoding="async"
          />
          {imagenesValidas.length > 1 && (
            <>
              <Button
                variant="glass"
                size="icon"
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/75 text-primary-dark shadow-brand"
                onClick={() => irAImagen(imagenActiva - 1)}
                aria-label="Ver imagen anterior"
              >
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </Button>
              <Button
                variant="glass"
                size="icon"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/75 text-primary-dark shadow-brand"
                onClick={() => irAImagen(imagenActiva + 1)}
                aria-label="Ver imagen siguiente"
              >
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </Button>
            </>
          )}
        </div>
      </Card>

      {imagenesValidas.length > 1 && (
        <div
          className="hidden gap-2 overflow-x-auto pb-1 md:flex"
          aria-label="Miniaturas de producto"
        >
          {imagenesValidas.map((miniatura, indice) => (
            <button
              key={miniatura.idImagen}
              type="button"
              onClick={() => irAImagen(indice)}
              aria-label={`Ver imagen ${indice + 1}`}
              aria-current={indice === imagenActiva ? "true" : undefined}
              className={`h-14 w-14 shrink-0 overflow-hidden rounded-md border-2 bg-white/30 p-0.5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:h-16 sm:w-16 ${indice === imagenActiva ? "border-primary shadow-brand" : "border-white/50 hover:border-primary/50"}`}
            >
              <img
                src={cloudinaryUrl(miniatura.url, "w_160,q_auto,f_auto")}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
