// Protege rutas del admin.
// Si no hay token redirige al login.
// Si se provee prop roles, verifica que el rol del usuario esté permitido.

import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import Loader from '../ui/Loader/Loader';

interface Props {
  children: React.ReactNode;
  roles?: string[];
}

export default function ProtectedRoute({ children, roles }: Props) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center"><Loader size="lg" text="Cargando sesión..." /></div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  if (roles && (!user || !roles.includes(user.rol))) {
    return <Navigate to="/admin/unauthorized" replace />;
  }

  return <>{children}</>;
}
