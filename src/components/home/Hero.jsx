import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative w-full h-96 bg-gradient-to-r from-primary via-primary to-secondary flex items-center justify-center text-center text-white overflow-hidden">
      <div className="absolute inset-0 opacity-25">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-secondary rounded-full blur-3xl animate-float-soft"></div>
        <div className="absolute bottom-10 right-1/4 w-44 h-44 bg-primary-light rounded-full blur-3xl animate-float-soft" style={{ animationDelay: "1.5s" }}></div>
        <div className="absolute top-1/3 right-10 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
      </div>

      <div className="absolute top-0 left-0 w-24 h-full bg-gradient-to-b from-white/10 to-transparent clip-bolt opacity-40" />
      <div className="absolute top-0 right-0 w-16 h-full bg-gradient-to-b from-white/10 to-transparent clip-bolt opacity-20" />

      <div className="relative z-10 px-6">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.4em] text-white/80 animate-fade-in-up" style={{ animationDelay: "0.05s" }}>
          Celebra con estilo
        </p>
        <h1 className="text-5xl md:text-6xl font-black mb-4 font-display animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
          TODO PARA TU FIESTA
        </h1>
        <p className="text-lg md:text-xl mb-8 text-white/90 animate-fade-in-up" style={{ animationDelay: "0.25s" }}>
          Decoraciones, regalos y cotillones para celebraciones inolvidables
        </p>
        <Link
          to="/catalogo"
          className="inline-block px-8 py-3 bg-white text-primary font-bold rounded-full hover:bg-primary-light transition-all duration-200 transform hover:scale-105 hover:shadow-[0_8px_32px_rgba(255,255,255,0.35)] font-display animate-fade-in-up"
          style={{ animationDelay: "0.35s" }}
        >
          Comprar Ahora
        </Link>
      </div>
    </section>
  );
}
