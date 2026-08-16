import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative w-full h-96 bg-gradient-to-r from-primary via-primary to-secondary flex items-center justify-center text-center text-white overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 bg-secondary rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-primary-light rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="absolute top-0 left-0 w-24 h-full bg-gradient-to-b from-white/10 to-transparent clip-bolt opacity-30" />

      <div className="relative z-10 px-6">
        <h1 className="text-5xl md:text-6xl font-black mb-4 font-display">
          TODO PARA TU FIESTA
        </h1>
        <p className="text-lg md:text-xl mb-8 text-white/90">
          Decoraciones, regalos y cotillones para celebraciones inolvidables
        </p>
        <Link
          to="/catalogo"
          className="inline-block px-8 py-3 bg-white text-primary font-bold rounded-full hover:bg-primary-light transition-all duration-200 transform hover:scale-105 font-display"
        >
          Comprar Ahora
        </Link>
      </div>
    </section>
  );
}
