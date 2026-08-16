import Card from "../../components/ui/Card/Card";

export default function Nosotros() {
  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-black text-center mb-12 text-gray-800 font-display">
          NOSOTROS
        </h1>

        <Card hover={false} className="p-8 mb-8">
          <h2 className="text-3xl font-black mb-6 text-gray-800 font-display">
            ¿Quiénes somos?
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed mb-4">
            Somos Trinity, tu tienda especializada en artículos para fiestas y celebraciones.
            Con más de 10 años de experiencia, nos dedicamos a crear momentos inolvidables
            proporcionando los mejores productos de decoración, cotillones y regalos.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            Nuestro equipo está comprometido con la calidad, la creatividad y la satisfacción
            del cliente. Cada producto que ofrecemos es seleccionado cuidadosamente para garantizar
            que tu fiesta sea especial.
          </p>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card hover={false} className="p-6 text-center">
            <div className="text-4xl font-black text-primary mb-2 font-display">10+</div>
            <h3 className="font-bold text-gray-800">Años de Experiencia</h3>
          </Card>
          <Card hover={false} className="p-6 text-center">
            <div className="text-4xl font-black text-primary mb-2 font-display">5000+</div>
            <h3 className="font-bold text-gray-800">Clientes Felices</h3>
          </Card>
          <Card hover={false} className="p-6 text-center">
            <div className="text-4xl font-black text-primary mb-2 font-display">500+</div>
            <h3 className="font-bold text-gray-800">Productos</h3>
          </Card>
        </div>

        <Card hover={false} className="p-8">
          <h2 className="text-3xl font-black mb-6 text-gray-800 font-display">Nuestros Valores</h2>
          <ul className="space-y-4 text-gray-700">
            <li className="flex gap-3">
              <span className="text-2xl text-secondary">✓</span>
              <span><strong>Calidad:</strong> Productos de la mejor calidad</span>
            </li>
            <li className="flex gap-3">
              <span className="text-2xl text-secondary">✓</span>
              <span><strong>Variedad:</strong> Gran selección para todos los gustos</span>
            </li>
            <li className="flex gap-3">
              <span className="text-2xl text-secondary">✓</span>
              <span><strong>Servicio:</strong> Atención al cliente excepcional</span>
            </li>
            <li className="flex gap-3">
              <span className="text-2xl text-secondary">✓</span>
              <span><strong>Creatividad:</strong> Productos únicos y especiales</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
