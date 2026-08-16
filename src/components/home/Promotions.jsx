export default function Promotions() {
  const promos = [
    {
      id: 1,
      title: "20% OFF en Globos",
      description: "En todos nuestros packs de globos",
      discount: 20,
    },
    {
      id: 2,
      title: "Compra 2 lleva 3",
      description: "En cotillones seleccionados",
      discount: 33,
    },
  ];

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto bg-white rounded-card mt-8">
      <h2 className="text-3xl font-black text-center mb-12 text-gray-800 font-display">
        PROMOCIONES
      </h2>
      <div className="space-y-4">
        {promos.map((promo) => (
          <div
            key={promo.id}
            className="bg-gradient-to-r from-primary to-secondary p-6 rounded-card text-white flex justify-between items-center hover:shadow-lg transition-shadow"
          >
            <div>
              <h3 className="text-2xl font-bold font-display">{promo.title}</h3>
              <p className="text-white/80">{promo.description}</p>
            </div>
            <span className="text-4xl font-black font-display">{promo.discount}%</span>
          </div>
        ))}
      </div>
    </section>
  );
}
