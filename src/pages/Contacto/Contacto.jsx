import { Mail, Phone, MapPin } from "lucide-react";
import Input from "../../components/ui/Input/Input";
import Button from "../../components/ui/Button/Button";
import Textarea from "../../components/ui/Textarea/Textarea";
import Card from "../../components/ui/Card/Card";
import Seo from "../../components/seo/Seo";

function IconoWhatsApp({ size = 32, className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function Contacto() {
  return (
    <div className="min-h-screen">
      <Seo
        title="Contacto | Trinity Party & Events"
        description="Contacta con Trinity Party & Events para consultas, pedidos y colaboraciones en La Paz, Bolivia."
      />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-black text-center mb-12 text-ink font-display">
          CONTACTO
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="space-y-6">
            <Card variant="subtle" padding="md">
              <div>
                <h2 className="font-bold text-ink">Trinity Party & Events</h2>
                <p className="text-muted">Artículos para fiestas y celebraciones</p>
              </div>
            </Card>

            <Card variant="subtle" padding="md">
              <div className="flex items-center gap-4">
                <Mail className="text-primary" size={32} />
                <div>
                  <h3 className="font-bold text-ink">Email</h3>
                  <a
                    href="mailto:trinitypartyandevents@gmail.com"
                    className="text-muted transition hover:text-primary"
                  >
                    trinitypartyandevents@gmail.com
                  </a>
                </div>
              </div>
            </Card>

            <Card variant="subtle" padding="md">
              <div className="flex items-center gap-4">
                <Phone className="text-primary" size={32} />
                <div>
                  <h3 className="font-bold text-ink">Teléfono</h3>
                  <a
                    href="tel:+59177231475"
                    className="text-muted transition hover:text-primary"
                  >
                    +591 77231475
                  </a>
                </div>
              </div>
            </Card>

            <Card variant="subtle" padding="md">
              <div className="flex items-center gap-4">
                <IconoWhatsApp className="text-primary" size={32} />
                <div>
                  <h3 className="font-bold text-ink">WhatsApp</h3>
                  <a
                    href="https://wa.me/59177231475"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted transition hover:text-primary"
                  >
                    +591 77231475
                  </a>
                </div>
              </div>
            </Card>

            <Card variant="subtle" padding="md">
              <div className="flex items-center gap-4">
                <MapPin className="text-primary" size={32} />
                <div>
                  <h3 className="font-bold text-ink">Ubicación</h3>
                  <p className="text-muted">Calle Tablada, La Paz, Bolivia</p>
                </div>
              </div>
            </Card>
          </div>

          <Card variant="default" padding="md">
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
