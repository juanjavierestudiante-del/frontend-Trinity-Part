import Card from "../Card/Card";

const DEFAULT_HIGHLIGHTS = [
  "Accede a tus pedidos, direcciones y datos guardados sin perder el hilo.",
  "Mantén tu sesión dentro de una superficie glass alineada con la tienda.",
  "Recupera el contexto de compra más rápido cuando vuelvas a entrar.",
];

export default function AuthShell({
  badge = "Acceso seguro",
  title,
  description,
  highlights = DEFAULT_HIGHLIGHTS,
  children,
  footer,
}) {
  return (
    <section className="relative isolate min-h-[calc(100vh-5rem)] overflow-hidden px-4 py-10 sm:py-14">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-20 top-12 h-72 w-72 rounded-full bg-primary/20 blur-3xl animate-float-soft" />
        <div className="absolute right-0 top-20 h-80 w-80 rounded-full bg-secondary/15 blur-3xl animate-float-soft" style={{ animationDelay: "1.5s" }} />
        <div className="absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-white/20 blur-3xl" />
      </div>

      <div className="mx-auto grid w-full max-w-6xl items-stretch gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Card
          variant="glass"
          hover={false}
          padding={false}
          className="relative overflow-hidden border-white/35 p-6 sm:p-8 lg:p-10"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-white/10 to-secondary/15" />
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary-light" />

          <div className="relative flex h-full flex-col justify-between gap-8">
            <div className="space-y-6">
              <span className="inline-flex w-fit items-center rounded-full border border-white/40 bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-primary-dark shadow-sm backdrop-blur-md">
                {badge}
              </span>

              <div className="space-y-4">
                <h1 className="max-w-md text-4xl font-black leading-tight text-ink sm:text-5xl">
                  {title}
                </h1>
                <p className="max-w-xl text-base leading-7 text-muted sm:text-lg">
                  {description}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {highlights.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border border-white/35 bg-white/15 px-4 py-3 text-sm leading-6 text-ink shadow-sm backdrop-blur-md"
                >
                  <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-gradient-to-br from-primary to-secondary" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card
          variant="glass"
          hover={false}
          padding={false}
          className="relative overflow-hidden border-white/35 p-6 sm:p-8 lg:p-10"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/5 to-transparent" />
          <div className="relative h-full">
            {children}
            {footer ? <div className="pt-6">{footer}</div> : null}
          </div>
        </Card>
      </div>
    </section>
  );
}
