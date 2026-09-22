import { Link } from 'react-router-dom';

interface Props {
  admin?: boolean;
}

export default function NotFound({ admin = false }: Props) {
  return (
    <section className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">404</p>
        <h1 className="mt-3 text-3xl font-black text-ink sm:text-4xl">Página no encontrada</h1>
        <p className="mx-auto mt-4 max-w-prose text-muted">
          La dirección que intentaste abrir no existe o ya no está disponible.
        </p>
        <Link to={admin ? '/admin/dashboard' : '/'} className="mt-8 inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-5 py-3 font-semibold text-white transition hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
          {admin ? 'Volver al panel' : 'Volver al inicio'}
        </Link>
      </div>
    </section>
  );
}
