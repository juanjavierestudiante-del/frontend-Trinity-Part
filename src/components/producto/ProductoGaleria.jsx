import Carousel from "../ui/Carousel/Carousel"
import { cloudinaryUrl } from "../../utils/cloudinary"

export default function ProductoGaleria({ imagenes, nombre }) {
  return (
    <Carousel>
      {imagenes?.map((img) => (
        <img
          key={img.id_imagen}
          src={cloudinaryUrl(img.url, "w_1000,q_auto,f_auto")}
          alt={nombre}
          loading="lazy"
          decoding="async"
          className="object-cover w-full rounded h-96"
        />
      ))}
    </Carousel>
  )
}
