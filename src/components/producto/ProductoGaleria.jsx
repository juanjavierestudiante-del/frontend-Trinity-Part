import Carousel from "../ui/Carousel/Carousel"

export default function ProductoGaleria({ imagenes, nombre }) {
  return (
    <Carousel>
      {imagenes?.map((img) => (
        <img
          key={img.id_imagen}
          src={img.url}
          alt={nombre}
          className="object-cover w-full rounded h-96"
        />
      ))}
    </Carousel>
  )
}
