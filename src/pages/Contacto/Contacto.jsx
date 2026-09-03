import { Mail, Phone, MapPin } from "lucide-react";
import Input from "../../components/ui/Input/Input";
import Button from "../../components/ui/Button/Button";
import Textarea from "../../components/ui/Textarea/Textarea";
import Card from "../../components/ui/Card/Card";
import Seo from "../../components/seo/Seo";

export default function Contacto() {
  return (
    <div className="min-h-screen">
      <Seo
        title="Contacto | Trinity Party & Events"
        description="Contacta con Trinity Party & Events para consultas, pedidos y colaboraciones. Estamos en Madrid para ayudarte con tus fiestas y celebraciones."
      />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-black text-center mb-12 text-ink font-display">
          CONTACTO
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="space-y-6">
            <Card hover={false}>
              <div className="flex items-center gap-4 mb-4">
                <Mail className="text-primary" size={32} />
                <div>
                  <h3 className="font-bold text-ink">Email</h3>
                  <p className="text-muted">info@trinity.com</p>
                </div>
              </div>
            </Card>

            <Card hover={false}>
              <div className="flex items-center gap-4 mb-4">
                <Phone className="text-primary" size={32} />
                <div>
                  <h3 className="font-bold text-ink">Teléfono</h3>
                  <p className="text-muted">+34 123 456 789</p>
                </div>
              </div>
            </Card>

            <Card hover={false}>
              <div className="flex items-center gap-4 mb-4">
                <MapPin className="text-primary" size={32} />
                <div>
                  <h3 className="font-bold text-ink">Ubicación</h3>
                  <p className="text-muted">Calle Principal 123, Madrid</p>
                </div>
              </div>
            </Card>
          </div>

          <Card hover={false}>
            <h2 className="text-2xl font-bold mb-6 text-ink font-display">
              Envíanos un mensaje
            </h2>
            <form className="space-y-4">
              <Input placeholder="Tu nombre" />
              <Input placeholder="tu@email.com" type="email" />
              <Textarea
                label="Mensaje"
                rows={4}
                placeholder="Tu mensaje aquí..."
              />
              <Button type="submit" className="w-full" variant="primary">
                Enviar
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
