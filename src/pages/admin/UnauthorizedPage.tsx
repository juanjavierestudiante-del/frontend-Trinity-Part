import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';

export default function UnauthorizedPage() {
  const usuario = useAuthStore((state) => state.usuario);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold text-red-400">403</h1>
        <h2 className="mb-2 text-2xl font-bold text-gray-100">No tienes permisos</h2>
        <p className="mb-6 text-gray-400">
          Tu rol (<span className="font-semibold text-gray-300">{usuario?.rol}</span>) no tiene acceso a esta sección.
        </p>
        <Link
          to="/admin/dashboard"
          className="px-6 py-3 font-semibold text-white transition-colors rounded-lg bg-primary hover:bg-primary/80"
        >
          Volver al Dashboard
        </Link>
      </div>
    </div>
  );
}
