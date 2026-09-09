import Card from "../ui/Card/Card";

export default function Promotions() {
  const promos = [
    {
      id: 1,
      title: "20% OFF en Globos",
      description: "En todos nuestros packs de globos",
      discount: 20,
      badge: "Oferta flash",
    },
    {
      id: 2,
      title: "Compra 2 lleva 3",
      description: "En cotillones seleccionados",
      discount: 33,
      badge: "Combo fiesta",
    },
  ];

  return (
    <section className="relative mx-auto mt-8 max-w-7xl overflow-hidden rounded-[2rem] border border-white/30 bg-gradient-to-br from-white/25 via-white/10 to-white/5 px-4 py-12 shadow-brand backdrop-blur-xl sm:px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.35),_transparent_45%)]" />
      <div className="relative">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center rounded-full border border-white/35 bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary-dark backdrop-blur-md">
            Ofertas destacadas
          </span>
          <h2 className="mt-4 text-3xl font-black text-ink sm:text-4xl font-display">
            Promociones
          </h2>
          <p className="mt-3 text-base leading-7 text-muted sm:text-lg">
            Combos, descuentos y packs listos para sumar color sin salirte del estilo de la tienda.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {promos.map((promo) => (
            <Card
              key={promo.id}
              variant="highlight"
              padding="lg"
              interactive
              className="overflow-hidden"
            >
              <div className="absolute -right-6 -top-8 h-28 w-28 rounded-full bg-secondary/15 blur-3xl" />
              <div className="relative flex items-start justify-between gap-6">
                <div className="space-y-3">
                  <span className="inline-flex w-fit rounded-full border border-white/35 bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-primary-dark backdrop-blur-md">
                    {promo.badge}
                  </span>
                  <div>
                    <h3 className="text-2xl font-black text-ink font-display">
                      {promo.title}
                    </h3>
                    <p className="mt-2 max-w-lg text-sm leading-6 text-muted">
                      {promo.description}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-2">
                  <span className="rounded-2xl border border-white/40 bg-white/20 px-4 py-3 text-3xl font-black tracking-tight text-primary-dark shadow-sm backdrop-blur-md">
                    {promo.discount}%
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
                    Ahorro
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
