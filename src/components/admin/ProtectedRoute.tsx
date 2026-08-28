// Protege rutas del admin.
// Si no hay token redirige al login.
// Si se provee prop roles, verifica que el rol del usuario esté permitido.

import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';

interface Props {
  children: React.ReactNode;
  roles?: string[];
}

export default function ProtectedRoute({ children, roles }: Props) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const usuario = useAuthStore((state) => state.usuario);

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  if (roles && usuario && !roles.includes(usuario.rol)) {
    return <Navigate to="/admin/unauthorized" replace />;
  }

  return <>{children}</>;
}
